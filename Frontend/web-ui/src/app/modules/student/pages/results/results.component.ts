import { Component, OnInit } from '@angular/core';
import { GradeService, StudentResult } from 'src/app/services/grade.service';

type ResultStatus = 'Pass' | 'Fail';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: Array<StudentResult & { code?: string }> = [];
  lastUpdated: string = 'Dec 2025';

  constructor(private gradeService: GradeService) { }

  ngOnInit(): void {
    this.gradeService.getStudentResults(1).subscribe(items => {
      this.results = items
        .map(i => ({ ...i, code: this.mapSubjectCode(i.subjectId) }))
        .slice(0, 1); 
    });
  }

  mapSubjectCode(subjectId: string | number | undefined): string | undefined {
    const map: Record<string, string> = {
      math: 'MTH-201',
      eng: 'ENG-110',
      sci: 'SCI-205',
      hist: 'HIS-220',
      cs: 'CSE-230',
      eco: 'ECO-150'
    };
    if (subjectId == null) return undefined;
    return map[subjectId.toString()] || undefined;
  }

  downloadReport(): void {
    // Simple print-to-PDF approach: open a printable window with the table
    const title = 'Student Result Report';
    const date = new Date().toLocaleString();

    const tableRows = this.results.map(r => `
      <tr>
        <td>${this.escape(r.subjectName)}</td>
        <td>${this.escape(r.code || '')}</td>
        <td>${this.escape(r.semester)}</td>
        <td>${r.mark} / 100</td>
        <td>${this.escape(r.grade)}</td>
        <td>${this.escape(r.status)}</td>
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
              <th>Semester</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Status</th>
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
