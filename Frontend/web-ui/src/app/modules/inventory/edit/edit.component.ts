import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../inventory.model';
import { InventoryService } from '../inventory.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  pageParentLink = 'Inventory';
  pageTitle = 'Edit Item';
  inventoryForm: UntypedFormGroup;
  inventoryId: number | null = null;
  selectedFile: File | null = null;
  imageUrl : string | null | ArrayBuffer = '';
  isLoading: boolean = false;
  isButtonLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      description: [''],
      id: [0],
      image: [''],
      imageFile: [null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inventoryId = +params['id'];
        this.loadInventory();
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.inventoryForm.patchValue({
        imageFile: file
      });
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        if(event.target)
        this.imageUrl = event.target.result;
      }
    }
  }

  loadInventory(): void {
    this.isLoading = true;
    if (this.inventoryId) {
      this.inventoryService.get(this.inventoryId).subscribe({
        next: (inventory) => {
           if(inventory.image)
           {
             this.imageUrl = environment.MediaUploadUrl + inventory.image;
           }
          this.inventoryForm.patchValue(inventory);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading inventory data', error);
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.inventoryForm.invalid) {
      return;
    }
    this.isButtonLoading = true;
    const inventory: Inventory = this.inventoryForm.value;
    inventory.quantity = (inventory.quantity).toString();
      const formData: FormData = new FormData();
      formData.append('name', inventory.name);
      formData.append('code', inventory.code);
      formData.append('description', inventory.description || '');
      formData.append('image', inventory.image || '');
      formData.append('quantity', inventory.quantity);
      formData.append('id', inventory.id.toString());
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

    if (this.inventoryId) {
      this.inventoryService.update(formData).subscribe({
        next: () => {
          this.toastr.success('Data updated successfully');
          this.router.navigate(['/inventory']);
        },
        error: (error) => {
          this.toastr.error('Something went wrong');
          console.error('Error updating inventory', error);
          this.isButtonLoading = false;
        }
      });
    }
  }


}
