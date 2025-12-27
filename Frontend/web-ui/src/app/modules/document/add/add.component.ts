import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Documents } from '../document.model';
import { DocumentService } from '../document.service';
import { stringify } from 'querystring';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  pageParentLink = 'Document';
  pageTitle = 'Add Item';
  form!: UntypedFormGroup;
  selectedFile: File | null = null;
  imageUrl : string | null | ArrayBuffer = '';
  isLoading: boolean = false

  constructor(
    private fb: UntypedFormBuilder,
    private _service: DocumentService,
    private _router: Router,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      file: [null]
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.form.patchValue({
        file: file
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
    if (this.form.valid) {
      this.isLoading = true;
      const item: Documents = this.form.value;
      const formData: FormData = new FormData();
      formData.append('name', item.name);
      formData.append('description', item.description || '');
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this._service.create(formData).subscribe({
        next: (response) => {
          this.toastr.success('Item added successfully');
          this._router.navigate([`/document`]);
        },
        error: (error) => {
          this.isLoading = false
          this.toastr.error('Something went wrong');
          console.error('There was an error creating the document', error);
        }
      });
    } else {
      this.isLoading = false
      this.form.markAllAsTouched();
    }
  }
}
