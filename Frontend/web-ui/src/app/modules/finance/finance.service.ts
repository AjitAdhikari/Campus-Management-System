import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddExpense, AddIncome, Expense, FilterVm, Income, ListFinance } from './finance.model';
import { catchError, Observable, throwError } from 'rxjs';
import { Helpers } from 'src/app/helpers/Helpers';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private incomeBaseUrl = `${environment.ApiUrl}/income`;
  private expenseBaseUrl = `${environment.ApiUrl}/expense`;

  constructor(private http: HttpClient) { }

  // Create
  createIncome(model: any): Observable<AddIncome> {
    return this.http.post<AddIncome>(this.incomeBaseUrl, model).pipe(
      catchError(this.handleError)
    );
  }

  // Read
  listIncome(filter: FilterVm): Observable<ListFinance[]> {
    let searchQuery = Helpers.ParseFilterVmToUrl(filter);
    const url = `${this.incomeBaseUrl}/list/${searchQuery}`;
    return this.http.get<ListFinance[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getIncome(id: any): Observable<AddIncome> {
    const url = `${this.incomeBaseUrl}/${id}`;
    return this.http.get<AddIncome>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Update
  updateIncome(model: any): Observable<Income[]> {
    const url = `${this.incomeBaseUrl}`;
    return this.http.put<Income[]>(url, model).pipe(
      catchError(this.handleError)
    );
  }

  // Delete
  deleteIncome(id: any): Observable<void> {
    const url = `${this.incomeBaseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }


// Create
createExpense(model: any): Observable<AddExpense> {
  return this.http.post<AddExpense>(this.expenseBaseUrl, model).pipe(
    catchError(this.handleError)
  );
}

// Read
listExpense(filter: FilterVm): Observable<ListFinance[]> {
  let searchQuery = Helpers.ParseFilterVmToUrl(filter);
  const url = `${this.expenseBaseUrl}/list/${searchQuery}`;
  return this.http.get<ListFinance[]>(url).pipe(
    catchError(this.handleError)
  );
}

getExpense(id: any): Observable<AddExpense> {
  const url = `${this.expenseBaseUrl}/${id}`;
  return this.http.get<AddExpense>(url).pipe(
    catchError(this.handleError)
  );
}

// Update
updateExpense(model: any): Observable<Expense[]> {
  const url = `${this.expenseBaseUrl}`;
  return this.http.put<Expense[]>(url, model).pipe(
    catchError(this.handleError)
  );
}

// Delete
deleteExpense(id: any): Observable<void> {
  const url = `${this.expenseBaseUrl}/${id}`;
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
