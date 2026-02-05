import { Component, OnInit } from '@angular/core';
import { FeeService } from 'src/app/services/fee.service';

interface StudentFeeSummary {
  user_id: string;
  user_name: string;
  semester: string;
  total_amount: number;
  amount_paid: number;
  due_payment: number;
}

interface PaymentHistory {
  id: number;
  user_name: string;
  semester: string;
  amount: number;
  payment_date: string;
}

@Component({
  selector: 'app-fee-monitoring',
  templateUrl: './fee-monitoring.component.html',
  styleUrls: ['./fee-monitoring.component.css']
})
export class FeeMonitoringComponent implements OnInit {

  studentFees: StudentFeeSummary[] = [];
  filteredStudents: StudentFeeSummary[] = [];
  paymentHistory: PaymentHistory[] = [];
  filteredHistory: PaymentHistory[] = [];

  viewMode: 'summary' | 'history' = 'summary';

  searchName: string = '';
  searchSemester: string = '';

  semesterOptions: string[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    // Load data initially
    this.refreshData();
  }

  refreshData(): void {
    this.loadAllStudentFees();
    this.loadPaymentHistory();
  }

  loadAllStudentFees(): void {
    this.feeService.getAllStudentFeeSummary().subscribe({
      next: (response: any) => {
        this.studentFees = response.data || [];
        this.filterData();
      },
      error: (error) => {
        console.error('Error loading student fees:', error);
        this.studentFees = [];
        this.filteredStudents = [];
      }
    });
  }

  loadPaymentHistory(): void {
    this.feeService.getPaymentHistory().subscribe({
      next: (response: any) => {
        this.paymentHistory = response.data || [];
        this.filterData();
      },
      error: (error) => {
        console.error('Error loading payment history:', error);
        this.paymentHistory = [];
        this.filteredHistory = [];
      }
    });
  }

  filterData(): void {
    this.filterStudents();
    this.filterHistory();
  }

  filterHistory(): void {
    let result = this.paymentHistory;

    if (this.searchSemester) {
      result = result.filter(item => item.semester === this.searchSemester);
    }

    if (this.searchName && this.searchName.trim()) {
      const searchTerm = this.searchName.toLowerCase().trim();
      result = result.filter(item => item.user_name.toLowerCase().includes(searchTerm));
    }

    this.filteredHistory = result;
  }

  filterStudents(): void {
    let result = this.studentFees;

    // First filter by semester if selected
    if (this.searchSemester) {
      result = result.filter(student =>
        student.semester === this.searchSemester
      );
    }

    // Then filter by name if entered
    if (this.searchName && this.searchName.trim()) {
      const searchTerm = this.searchName.toLowerCase().trim();
      result = result.filter(student =>
        student.user_name.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredStudents = result;
  }

  search(): void {
    this.filterStudents();
  }

  clearFilters(): void {
    this.searchName = '';
    this.searchSemester = '';
    this.filterData();
  }

  toggleView(mode: 'summary' | 'history'): void {
    this.viewMode = mode;
  }
}
