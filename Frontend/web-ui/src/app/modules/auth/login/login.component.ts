import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { AuthService } from '../auth.service';
import { UserLoginRequestModel } from '../UserLoginRequestModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 isLoading: boolean = false;
  form: UntypedFormGroup;
  model: UserLoginRequestModel = {
    email : "",
    password : ""
  };
  constructor(private authService: AuthService,   private fb: UntypedFormBuilder, private router: Router){
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

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

  ngAfterViewInit(): void {
    const t = StorageHelper.getToken();
    if (t) {
      const userJson = StorageHelper.getLocalStorageItem('_user_details');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          const role = (user && user.role) ? String(user.role).toLowerCase() : '';
          if (role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (role === 'faculty') {
            this.router.navigate(['/faculty/dashboard']);
          } else if (role === 'student') {
            this.router.navigate(['/student/dashboard']);
          } else {
            StorageHelper.removeToken();
          }
        } catch (e) {
          StorageHelper.removeToken();
        }
      } else {
        StorageHelper.removeToken();
      }
    }
  }

}
