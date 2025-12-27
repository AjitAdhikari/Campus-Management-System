import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Inventory } from '../inventory.model';
import { InventoryService } from '../inventory.service';
import { stringify } from 'querystring';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  pageParentLink = 'Inventory';
  pageTitle = 'Add Item';
  inventoryForm!: UntypedFormGroup;
  selectedFile: File | null = null;
  imageUrl : string | null | ArrayBuffer = '';
  isLoading: boolean = false

  constructor(
    private fb: UntypedFormBuilder,
    private inventoryService: InventoryService,
    private _router: Router,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      imageFile: [null]
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

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      this.isLoading = true;
      const inventory: Inventory = this.inventoryForm.value;
      inventory.quantity = (inventory.quantity).toString();
      const formData: FormData = new FormData();
      formData.append('name', inventory.name);
      formData.append('code', inventory.code);
      formData.append('description', inventory.description || '');
      formData.append('quantity', inventory.quantity);
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

      this.inventoryService.create(formData).subscribe({
        next: (response) => {
          this.toastr.success('Item added successfully');
          this._router.navigate([`/inventory`]);
        },
        error: (error) => {
          this.isLoading = false
          this.toastr.error('Something went wrong');
          console.error('There was an error creating the inventory', error);
        }
      });
    } else {
      this.isLoading = false
      this.inventoryForm.markAllAsTouched();
    }
  }
}
