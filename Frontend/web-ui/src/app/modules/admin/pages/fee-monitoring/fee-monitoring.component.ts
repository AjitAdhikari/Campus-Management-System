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

@Component({
  selector: 'app-fee-monitoring',
  templateUrl: './fee-monitoring.component.html',
  styleUrls: ['./fee-monitoring.component.css']
})
export class FeeMonitoringComponent implements OnInit {

  studentFees: StudentFeeSummary[] = [];
  filteredStudents: StudentFeeSummary[] = [];

  searchName: string = '';
  searchSemester: string = '';
  
  semesterOptions: string[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    // Don't load data initially - require search criteria
  }

  loadStudentFees(): void {
    // Require BOTH name and semester
    if (!this.searchName || !this.searchSemester) {
      this.studentFees = [];
      this.filterStudents();
      return;
    }

    this.feeService.getStudentFeeSummary(this.searchName, this.searchSemester).subscribe({
      next: (response: any) => {
        this.studentFees = response.data || [];
        this.filterStudents();
      },
      error: (error) => {
        console.error('Error loading student fees:', error);
      }
    });
  }

  filterStudents(): void {
    this.filteredStudents = this.studentFees;
  }

  search(): void {
    this.loadStudentFees();
  }

  clearFilters(): void {
    this.searchName = '';
    this.searchSemester = '';
    this.studentFees = [];
    this.filteredStudents = [];
  }
}
