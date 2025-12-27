import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FilterVm, ListMember, Member } from './member.model';
import { Helpers } from 'src/app/helpers/Helpers';
@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private baseUrl = `${environment.ApiUrl}/members`; // replace with your API base URL

  constructor(private http: HttpClient) { }

  // Create
  create(member: FormData): Observable<Member> {
    return this.http.post<Member>(this.baseUrl, member).pipe(
      catchError(this.handleError)
    );
  }

  // Read
  list(filter: FilterVm): Observable<ListMember[]> {
    let searchQuery = Helpers.ParseFilterVmToUrl(filter);
    const url = `${this.baseUrl}/${searchQuery}`;
    return this.http.get<ListMember[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  get(id: string): Observable<Member> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Member>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Update
  update(id: string, member: FormData): Observable<Member> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.post<Member>(url, member).pipe(
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

  listActiveMember(): Observable<any[]>{
    const url = `${this.baseUrl}/active-member`;
    return this.http.get<any[]>(url).pipe(
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
