import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FilterVm, Documents } from './document.model';
import { Helpers } from 'src/app/helpers/Helpers';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private baseUrl = `${environment.ApiUrl}/document`; // replace with your API base URL

  constructor(private http: HttpClient) { }

  // Create
  create(model: FormData): Observable<Documents> {
    return this.http.post<Documents>(this.baseUrl, model).pipe(
      catchError(this.handleError)
    );
  }

  // Read
  list(filter: FilterVm): Observable<Documents[]> {
    let searchQuery = Helpers.ParseFilterVmToUrl(filter);
    const url = `${this.baseUrl}/list/${searchQuery}`;
    return this.http.get<Documents[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  get(id: number): Observable<Documents> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Documents>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Update
  update(model: FormData): Observable<Documents> {
    const url = `${this.baseUrl}`;
    return this.http.put<Documents>(url, model).pipe(
      catchError(this.handleError)
    );
  }

  // Delete
  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }


  download(id: number): Observable<Object> {
    const url = `${this.baseUrl}/download/${id}`;
    return this.http.get(url, {
      responseType: 'blob' as 'json'
    });
  }
  // Error Handling
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
