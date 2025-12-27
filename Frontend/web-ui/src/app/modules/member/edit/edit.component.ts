import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Member } from '../member.model';
import { MemberService } from '../member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  pageParentLink = 'Member';
  pageTitle = 'Edit Member';
  editMemberForm!: UntypedFormGroup;
  member!: Member; // added ! to make ensure about it it not undefined
  selectedFile: File | null = null;
  imageUrl : string | null | ArrayBuffer = '';
  isLoading: boolean = false;
  isButtonLoading: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const memberId = this.route.snapshot.paramMap.get('id');
    if(memberId){
      this.isLoading = true;
      this.createForm(memberId);
      this.memberService.get(memberId).subscribe((data: Member) => {
        this.member = data;
        this.populateForm();
        this.isLoading  = false;
      });
    }
  }

  createForm(id: string): void {
    this.editMemberForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      secondary_phone_number: [''],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      occupation: ['', Validators.required],
      permanent_address: ['', Validators.required],
      temporary_address: ['', Validators.required],
      baptized_date: ['', Validators.required],
      membership_date: [''],
      id: [id],
      photo : ['']
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.editMemberForm.patchValue({
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

  populateForm(): void {

    this.editMemberForm.patchValue(this.member);
    if(this.member.photo)
      {
        this.imageUrl = environment.MediaUploadUrl + this.member.photo;
      }
  }

  onSubmit(): void {
    if (this.editMemberForm.valid) {
      this.isButtonLoading = true;
      const member: Member = this.editMemberForm.value;
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
      formData.append('id', member.id)
      formData.append('photo', member.photo || '')
      if (this.selectedFile) {
        formData.append('photo_file', this.selectedFile);
      }

      this.memberService.update(this.member.id, formData).subscribe({
        next: () => {
          this.toastr.success('Data Updated Successfully');
          this.router.navigate(['/member']);
        },
        error: (error) => {
          this.toastr.error('Something went wrong');
          console.error('Error updating inventory', error);
          this.isButtonLoading = false;
        }
        // this.router.navigate(['/member']);
      });

    }
  }

}
