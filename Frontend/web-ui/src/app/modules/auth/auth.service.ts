import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLoginRequestModel } from './UserLoginRequestModel';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http : HttpClient, private _toastr: ToastrService){} //) { }

  authenticate( requestModel:UserLoginRequestModel)
  {
     let response = this._http.post<any>(environment.ApiUrl+"/auth/login",requestModel,
     {observe:"response"}).pipe(
       tap( // Log the result or error
     {
       next: (data) => console.log( data),
       error: (error) => {
        this._toastr.error("Incorrect username or password", "Login Error", {progressBar:true})
         StorageHelper.removeToken()
       }
     }
     ));
     response.subscribe(response =>{
       if(response.status != 200)
       {
        this._toastr.error("The username or passoword that you've entered doesn't match account", "Login Error", {progressBar:true})
         return;
       }
       StorageHelper.setToken(response.body.token);
       window.location.href = "/";
      }
     );
  }
}
