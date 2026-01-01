import { Component, OnInit } from '@angular/core';

interface Student {
  id: number;
  name: string;
  class?: string;
  semester?: number;
  // optional role to allow filtering out non-students (e.g. 'Faculty', 'Admin')
  role?: string;
  feeDue: number;
}

interface Payment {
  id: number;
  studentId: number;
  amount: number;
  date: string; // ISO date
  method: string;
  note?: string;
  semester?: number;
}

// Removed FeeItem — not used by the simplified students table UI

@Component({
  selector: 'app-fee-monitoring',
  templateUrl: './fee-monitoring.component.html',
  styleUrls: ['./fee-monitoring.component.css']
})
export class FeeMonitoringComponent implements OnInit {

  students: Student[] = [];
  payments: Payment[] = [];

  searchName: string = '';
  searchSemester?: number | null = null;
  // pagination
  page: number = 1;
  pageSize: number = 10;
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  // note: `payments` is used only to compute totals per student

  ngOnInit(): void {
    // sample data
    this.students = [
      { id: 1, name: 'Sara Powell', feeDue: 1200, role: 'Student', semester: 1 },
      { id: 2, name: 'David Lee', feeDue: 1500, role: 'Faculty', semester: 2 },
      { id: 3, name: 'Mark Chan', feeDue: 1800, role: 'Student', semester: 1 }
    ];

    this.payments = [
      { id: 1, studentId: 1, amount: 400, date: '2025-11-01', method: 'Cash', note: 'First installment', semester: 1 },
      { id: 2, studentId: 1, amount: 200, date: '2025-11-15', method: 'Card', semester: 1 },
      { id: 3, studentId: 2, amount: 500, date: '2025-10-20', method: 'Online', semester: 2 }
    ];
  }

  // filtered students by name and semester (shows all when filters empty)
  get filteredStudents(): Student[] {
    const name = (this.searchName || '').trim().toLowerCase();
    const sem = this.searchSemester;
    return this.studentsOnly.filter(s => {
      const byName = name ? s.name.toLowerCase().includes(name) : true;
      const bySem = (typeof sem === 'number' && sem > 0) ? (s.semester === sem) : true;
      return byName && bySem;
    });
  }

  // pagination helpers
  get totalPages(): number {
    const total = this.filteredStudents.length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  }

  get paginatedStudents(): Student[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  goToPage(n: number): void {
    if (n >= 1 && n <= this.totalPages) this.page = n;
  }

  // Only show entries that are students (case-insensitive match)
  get studentsOnly(): Student[] {
    return this.students.filter(s => (s.role || '').toLowerCase() === 'student');
  }

  // totals used by the students table
  totalPaidForStudent(studentId: number): number {
    return this.payments.filter(p => p.studentId === studentId).reduce((s, p) => s + p.amount, 0);
  }

  balanceForStudent(studentId: number): number {
    const s = this.students.find(st => st.id === studentId);
    if (!s) return 0;
    return Math.max(0, s.feeDue - this.totalPaidForStudent(studentId));
  }
}
