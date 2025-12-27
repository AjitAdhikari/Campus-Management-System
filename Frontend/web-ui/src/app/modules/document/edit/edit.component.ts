import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Documents } from '../document.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  pageParentLink = 'Inventory';
  pageTitle = 'Edit Item';
  form: UntypedFormGroup;
  itemId: number | null = null;
  selectedFile: File | null = null;
  imageUrl : string | null | ArrayBuffer = '';
  isLoading: boolean = false;
  isButtonLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private _service: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      createdDate: [''],
      size: [''],
      type: [''],
      id: [''],
      path: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.itemId = params.id;
        this.loadData();
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.form.patchValue({
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

  loadData(): void {
    this.isLoading = true;
    console.log(this.itemId)
    if (this.itemId) {
      this._service.get(this.itemId).subscribe({
        next: (item) => {
          this.form.patchValue(item);
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error('Something went wrong');
          console.error('Error loading data', error);
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.isButtonLoading = true;
    const item: Documents = this.form.value;
      const formData: FormData = new FormData();
      formData.append('name', item.name);
      formData.append('description', item.description || '');
      formData.append('path', item.path);
      formData.append('size', item.size || '');
      formData.append('type', item.type || '');
      formData.append('id', item.id.toString());

    if (this.itemId) {
      this._service.update(formData).subscribe({
        next: () => {
          this.toastr.success('Data updated successfully');
          this.router.navigate(['/document']);
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
