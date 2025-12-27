import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChartData, SummaryData } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.ApiUrl}/widget`; // replace with your API base URL
  constructor(private http: HttpClient) { }

  getSummaryData(): Observable<SummaryData> {
    const url = `${this.baseUrl}/summary`;
    return this.http.get<SummaryData>(url).pipe(
      catchError(this.handleError)
    );
  }

  getGenderChartData(): Observable<ChartData[]> {
    const url = `${this.baseUrl}/gender-chart`;
    return this.http.get<ChartData[]>(url).pipe(
      catchError(this.handleError)
    );
  }


  getFinaceChartData(): Observable<ChartData[]> {
    const url = `${this.baseUrl}/finance-chart`;
    return this.http.get<ChartData[]>(url).pipe(
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
