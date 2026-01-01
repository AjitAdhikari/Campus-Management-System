import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { environment } from 'src/environments/environment';
import { UserLoginRequestModel } from './UserLoginRequestModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, private _toastr: ToastrService, private _router: Router) { } //) { }

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
      StorageHelper.setLocalStorageItem('_user_details', JSON.stringify(response.body.user));

      let userDetails = response.body.user;
      console.log(userDetails);
      const role = (userDetails && userDetails.role) ? String(userDetails.role).toLowerCase() : '';
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
