import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdatePassword } from './setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {


  private baseUrl = `${environment.ApiUrl}/user`; // replace with your API base URL

  constructor(private http: HttpClient) { }

  // Update
  updatePassword(model: any): Observable<UpdatePassword> {
    const url = `${this.baseUrl}/update-password`;
    return this.http.put<UpdatePassword>(url, model).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
