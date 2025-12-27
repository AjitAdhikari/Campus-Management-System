import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MemberService } from '../member.service';
import { Member } from '../member.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  pageParentLink = 'Member';
  pageTitle = 'Add Member';
  memberForm: UntypedFormGroup;
  selectedFile: File | null = null;
  imageUrl : string | null | ArrayBuffer = '';
  isLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private memberService: MemberService,
    private _router: Router,
    private toastr: ToastrService
  ) {
    this.memberForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      secondary_phone_number: [''],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      occupation: ['', Validators.required],
      permanent_address: ['', Validators.required],
      temporary_address: ['', Validators.required],
      baptized_date: [''],
      membership_date: [''],
      photo_file: [null]
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.memberForm.patchValue({
        photoFile: file
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
    if (this.memberForm.valid) {
      this.isLoading = true;
      const member: Member = this.memberForm.value;
      const formData: FormData = new FormData();
      formData.append('first_name', member.first_name);
      formData.append('middle_name', member.middle_name || '');
      formData.append('last_name', member.last_name);
      formData.append('email', member.email);
      formData.append('phone_number', member.phone_number || '');
      formData.append('secondary_phone_number', member.secondary_phone_number || '');
      formData.append('birth_date', member.birth_date);
      formData.append('gender', member.gender);
      formData.append('occupation', member.occupation);
      formData.append('permanent_address', member.permanent_address);
      formData.append('temporary_address', member.temporary_address);
      formData.append('baptized_date', member.baptized_date);
      formData.append('membership_date', member.membership_date || '');
      if (this.selectedFile) {
        formData.append('photo_file', this.selectedFile);
      }

      this.memberService.create(formData).subscribe({
        next: (data) => {
          this.toastr.success('Member Created Successfully');
          this._router.navigate(['/member']);
        },
        error: (err) => {
          this.toastr.error('Something went wrong');
          console.error('Error creating member', err);
          this.isLoading = false;
        }
      });
    } else {
      this.memberForm.markAllAsTouched();
      this.isLoading = false;
    }
  }
}
