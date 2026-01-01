import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface StudentResult {
  subjectId: string | number;
  subjectName: string;
  semester: string;
  mark: number; // 0-100
  grade: string; // A, B+, etc.
  status: 'Pass' | 'Fail';
}

@Injectable({ providedIn: 'root' })
export class GradeService {
  constructor() {}

  // Mocked results for a single student; replace with HTTP call when backend is ready
  getStudentResults(studentId: number): Observable<StudentResult[]> {
    return of([
      { subjectId: 'math', subjectName: 'Mathematics', semester: 'Semester 5', mark: 92, grade: 'A', status: 'Pass' }
    ]);
  }
}
