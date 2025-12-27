import { Component } from '@angular/core';
import { UpdatePassword } from '../../setting.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from '../../setting.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  pageTitle = 'Add Item';
  model: UpdatePassword = new UpdatePassword;
  isLoading: boolean = false;
  passwordMatch: boolean = true;
  constructor(
    private _router: Router,
    private toastr: ToastrService,
    private _service: SettingService,
  ){
  }

  ngOnInit(): void {
  }


  onConfirmPasswordChange()
  {
    if(this.model.password != this.model.confirmPassword)
    {
      this.passwordMatch = false;
    } else
    {
      this.passwordMatch = true;
    }
  }

  onSubmit():any{
    this.isLoading = true;

    if(!this.passwordMatch)
    {
      this.toastr.error('Password & Confirm Password Does not match');
      return false;
    }
    this._service.updatePassword(this.model).subscribe({
      next: (data) => {
        this.toastr.success('Alert!! You will be redirected into login page.');
        localStorage.clear();
        window.location.replace("/");
      },
      error: (err) => {
        this.toastr.error('Something went wrong');
        console.error('Error creating member', err);
        this.isLoading = false;
      }
    });
  }
}
