import { Component, OnInit } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { UserLoginRequestModel } from '../UserLoginRequestModel';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 isLoading: boolean = false;
  form: UntypedFormGroup;
  model: UserLoginRequestModel = {
    username : "",
    password : ""
  };
  constructor(private authService: AuthService,   private fb: UntypedFormBuilder){
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  //private _toastr:ToastrService) { }
  ngOnInit(): void {

  }
  onSubmit(): void{
    if (this.form.valid) {
      this.isLoading = true;
      this.model  = this.form.value;
      this.authService.authenticate(this.model);
      this.isLoading = false;
    }
  }

}
