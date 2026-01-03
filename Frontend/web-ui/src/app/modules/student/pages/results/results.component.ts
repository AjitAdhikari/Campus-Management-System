import { Component, OnInit } from '@angular/core';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { CourseService } from 'src/app/services/course.service';

type ResultStatus = 'Pass' | 'Fail';

interface Result {
  id: number;
  course_name: string;
  course_code: string;
  marks: number;
  grade: string;
  status: ResultStatus;
  faculty_name: string;
  uploaded_at: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: Result[] = [];
  isLoading = false;
  errorMessage = '';
  studentId: string | null = null;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    const userDetails = StorageHelper.getLocalStorageItem('_user_details');
    if (!userDetails) {
      this.errorMessage = 'User not logged in. Please login again.';
      return;
    }

    try {
      const user = JSON.parse(userDetails);
      this.studentId = user?.id;
      
      if (!this.studentId) {
        this.errorMessage = 'Student ID not found. Please login again.';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      
      this.courseService.getStudentResults(this.studentId).subscribe({
        next: (results) => {
          this.results = results;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading results:', err);
          this.errorMessage = 'Failed to load results. Please try again.';
          this.isLoading = false;
        }
      });
    } catch (e) {
      console.error('Error parsing user details:', e);
      this.errorMessage = 'Error loading user information. Please login again.';
    }
  }

  downloadReport(): void {
    const title = 'Student Result Report';
    const date = new Date().toLocaleString();

    const tableRows = this.results.map(r => `
      <tr>
        <td>${this.escape(r.course_name)}</td>
        <td>${this.escape(r.course_code)}</td>
        <td>${r.marks} / 100</td>
        <td>${this.escape(r.grade)}</td>
        <td>${this.escape(r.status)}</td>
        <td>${this.escape(r.faculty_name)}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { margin: 0 0 6px 0; font-size: 20px; }
          .muted { color: #6b7280; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f9fafb; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="muted">Generated: ${this.escape(date)}</div>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="6">No results</td></tr>'}
          </tbody>
        </table>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  statusClass(status: ResultStatus): string {
    return status.toLowerCase();
  }

  private escape(value: string | number | undefined): string {
    return (value == null ? '' : String(value))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
