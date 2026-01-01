import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Fee {
  id: number;
  user_id: number;
  semester: string;
  total_fee: number;
  created_at?: string;
  updated_at?: string;
}

export interface FeeDetail {
  id: number;
  user_id: number;
  semester: string;
  payment_date: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface PendingFee {
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Overdue' | 'Paid';
}

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private apiUrl = 'http://localhost:8000/api/fees';

  constructor(private http: HttpClient) { }

  // Get fees for a specific user
  getFees(userId: number): Observable<Fee> {
    return this.http.get<Fee>(`${this.apiUrl}/${userId}`);
  }

  // Get fee details for a specific user
  getFeeDetails(userId: number): Observable<FeeDetail[]> {
    return this.http.get<FeeDetail[]>(`${this.apiUrl}/details/${userId}`);
  }

  // Get all fees
  getAllFees(): Observable<Fee[]> {
    return this.http.get<Fee[]>(this.apiUrl);
  }

  // Create new fee
  createFee(fee: Omit<Fee, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, fee);
  }

  // Create fee detail (payment)
  createFeeDetail(feeDetail: Omit<FeeDetail, 'id'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/details`, feeDetail);
  }

  // Mock data for demonstration - replace with actual API calls
  getMockPendingFees(): Observable<PendingFee[]> {
    return of([
      {
        feeType: "Tuition Fee - Spring '26",
        amount: 1000.00,
        dueDate: "Jan 15, 2026",
        status: "Pending"
      },
      {
        feeType: "Library Fine",
        amount: 50.00,
        dueDate: "Immediate",
        status: "Overdue"
      }
    ]);
  }

  // Calculate total pending dues
  calculatePendingDues(fees: PendingFee[]): number {
    return fees.reduce((total, fee) => total + fee.amount, 0);
  }

  // Get last payment info
  getLastPayment(feeDetails: FeeDetail[]): { amount: number, date: string } | null {
    if (!feeDetails || feeDetails.length === 0) {
      return null;
    }
    
    const sorted = [...feeDetails].sort((a, b) => 
      new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
    );
    
    return {
      amount: sorted[0].amount,
      date: this.formatDate(sorted[0].payment_date)
    };
  }

  // Calculate total paid in current year
  calculateYearlyTotal(feeDetails: FeeDetail[]): number {
    const currentYear = new Date().getFullYear();
    return feeDetails
      .filter(detail => new Date(detail.payment_date).getFullYear() === currentYear)
      .reduce((total, detail) => total + detail.amount, 0);
  }

  // Format date helper
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
