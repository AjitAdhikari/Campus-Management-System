import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdatePassword, UpdateUserProfilePayload, UserProfileView } from './setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {


  private baseUrl = `${environment.ApiUrl}/users`;

  constructor(private http: HttpClient) { }

  // Update
  updatePassword(model: any): Observable<UpdatePassword> {
    const url = `${this.baseUrl}/update-password`;
    return this.http.put<UpdatePassword>(url, model).pipe(
      catchError(this.handleError)
    );
  }

  // Get full user profile by id (joins users + user_profiles)
  getUserProfile(userId: string): Observable<UserProfileView> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.get<UserProfileView>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Update user profile (multipart/form-data)
  updateUserProfile(payload: UpdateUserProfilePayload, avatarFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', payload.id);
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    if ((payload as any).active_status !== undefined) formData.append('active_status', String((payload as any).active_status));
    if (payload.role) formData.append('role', payload.role);
    if (payload.subjects) formData.append('subjects', payload.subjects);
    if (payload.semesters) formData.append('semesters', payload.semesters);
    if (avatarFile) formData.append('avatar', avatarFile);

    const url = `${this.baseUrl}/${payload.id}`;
    // Backend expects POST for update at /users/{id}
    return this.http.post(url, formData).pipe(
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
      const backendMessage = (error.error && (error.error.error || error.error.message)) || error.message;
      errorMessage = `Error Code: ${error.status}\nMessage: ${backendMessage}`;
    }
    return throwError(errorMessage);
  }
}
