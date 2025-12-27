import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FilterVm, Inventory } from './inventory.model';
import { Helpers } from 'src/app/helpers/Helpers';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private baseUrl = `${environment.ApiUrl}/inventories`; // replace with your API base URL

  constructor(private http: HttpClient) { }

  // Create
  create(model: FormData): Observable<Inventory> {
    return this.http.post<Inventory>(this.baseUrl, model).pipe(
      catchError(this.handleError)
    );
  }

  // Read
  list(filter: FilterVm): Observable<Inventory[]> {
    let searchQuery = Helpers.ParseFilterVmToUrl(filter);
    const url = `${this.baseUrl}/${searchQuery}`;
    return this.http.get<Inventory[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  get(id: number): Observable<Inventory> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Inventory>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Update
  update(model: FormData): Observable<Inventory> {
    const url = `${this.baseUrl}/${model.get('id')}`;
    return this.http.post<Inventory>(url, model).pipe(
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
