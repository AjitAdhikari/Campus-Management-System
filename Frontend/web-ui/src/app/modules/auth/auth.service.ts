import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { SettingService } from 'src/app/modules/setting/setting.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { UserLoginRequestModel } from './UserLoginRequestModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _http: HttpClient, 
    private _toastr: ToastrService, 
    private _router: Router,
    private userService: UserService,
    private settingService: SettingService
  ) { }

  authenticate(requestModel: UserLoginRequestModel) {
    let response = this._http.post<any>(environment.ApiUrl + "/auth/login", requestModel,
      { observe: "response" }).pipe(
        tap(
          {
            next: (data) => console.log(data),
            error: (error) => {
              this._toastr.error("Incorrect username or password", "Login Error", { progressBar: true })
              StorageHelper.removeToken()
            }
          }
        ));
    response.subscribe(response => {
      if (response.status != 200) {
        this._toastr.error("The username or passoword that you've entered doesn't match account", "Login Error", { progressBar: true })
        return;
      }
      StorageHelper.setToken(response.body.token);
      
      let userDetails = response.body.user;
      console.log(userDetails);
      const userId = userDetails?.id || userDetails?.ID;
      const role = (userDetails && userDetails.role) ? String(userDetails.role).toLowerCase() : '';
      
      // Fetch full user profile to get avatar and all details
      if (userId) {
        this.settingService.getUserProfile(userId).subscribe({
          next: (fullProfile) => {
            // Set the complete profile with avatar
            this.userService.setUser(fullProfile);
          },
          error: (err) => {
            console.error('Failed to load user profile after login:', err);
            // Fallback to basic user data from login response
            this.userService.setUser(userDetails);
          }
        });
      } else {
        // Fallback if no userId
        this.userService.setUser(userDetails);
      }
      
      if (role === 'admin') {
        this._router.navigate(['/admin/dashboard']);
      } else if (role === 'faculty') {
        this._router.navigate(['/faculty/dashboard']);
      } else if (role === 'student') {
        this._router.navigate(['/student/dashboard']);
      } else {
        this._toastr.info('Unknown user role, please login again', 'Info');
        StorageHelper.removeToken();
        this._router.navigate(['/login']);
      }
    }
    );
  }
}
