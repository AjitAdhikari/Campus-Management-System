import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Student {
  id: number | string;
  name: string;
  regNo?: string;
}

interface Subject {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  form: FormGroup;
  students: Student[] = [];
  subjects: Subject[] = [];
  semesters: string[] = [];

  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      semester: ['', Validators.required],
      subject: ['', Validators.required],
      marks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.students = [
      { id: 1, name: 'Alice Johnson', regNo: 'S001' },
      { id: 2, name: 'Bob Smith', regNo: 'S002' },
      { id: 3, name: 'Carla Gomez', regNo: 'S003' }
    ];

    this.subjects = [
      { id: 'math', name: 'Mathematics' },
      { id: 'eng', name: 'English' },
      { id: 'sci', name: 'Science' }
    ];

    this.semesters = [
      'Semester 1',
      'Semester 2',
      'Semester 3',
      'Semester 4',
      'Semester 5',
      'Semester 6',
      'Semester 7',
      'Semester 8'
    ];

    // initialize form array for students
    const marksArray = this.form.get('marks') as FormArray;
    this.students.forEach(s => {
      marksArray.push(this.fb.group({
        studentId: [s.id],
        name: [s.name],
        regNo: [s.regNo || ''],
        mark: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
      }));
    });
  }

  get marks(): FormArray {
    return this.form.get('marks') as FormArray;
  }

  get markGroups(): FormGroup[] {
    return this.marks.controls as FormGroup[];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result || '') as string;
      this.parseCsvAndFill(text);
    };
    reader.readAsText(file);
  }

  parseCsvAndFill(csv: string) {
    this.errorMessage = '';
    const lines = csv.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      this.errorMessage = 'CSV file is empty';
      return;
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const hasId = header.includes('id') || header.includes('studentid') || header.includes('student_id');
    const hasReg = header.includes('regno') || header.includes('reg_no');
    const hasName = header.includes('name');
    const hasMark = header.includes('mark') || header.includes('marks') || header.includes('score');

    if (!hasMark || !(hasId || hasReg || hasName)) {
      this.errorMessage = 'CSV must include a student identifier (id, regNo, or name) and a mark column';
      return;
    }

    const idxId = header.findIndex(h => h === 'id' || h === 'studentid' || h === 'student_id');
    const idxReg = header.findIndex(h => h === 'regno' || h === 'reg_no');
    const idxName = header.findIndex(h => h === 'name');
    const idxMark = header.findIndex(h => h === 'mark' || h === 'marks' || h === 'score');

    const marksArray = this.marks;

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      const identifier = (idxId !== -1 ? cols[idxId] : idxReg !== -1 ? cols[idxReg] : cols[idxName] || '').toString();
      const markRaw = cols[idxMark] || '';
      const markVal = markRaw === '' ? '' : Number(markRaw);

      // try find student by id, regNo, or name
      const studentIndex = this.students.findIndex(s => {
        if (idxId !== -1 && s.id != null) return s.id.toString() === identifier;
        if (idxReg !== -1 && s.regNo) return s.regNo.toLowerCase() === identifier.toLowerCase();
        if (idxName !== -1) return s.name.toLowerCase() === identifier.toLowerCase();
        return false;
      });

      if (studentIndex === -1) {
        // skip unknown student rows
        continue;
      }

      const control = marksArray.at(studentIndex);
      if (control) {
        control.get('mark')?.setValue(isNaN(markVal as number) ? '' : markVal);
      }
    }

    this.successMessage = 'CSV imported. Please review marks before submitting.';
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.errorMessage = 'Please fill semester, subject and ensure all marks are valid (0-100).';
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      semester: this.form.value.semester,
      subject: this.form.value.subject,
      marks: this.form.value.marks.map((m: any) => ({ studentId: m.studentId, mark: m.mark }))
    };

    console.log('Grade submission payload:', payload);
    this.successMessage = 'Marks submitted (see console).';
  }

  resetForm() {
    this.form.get('semester')?.reset('');
    this.form.get('subject')?.reset('');
    this.marks.controls.forEach((c, idx) => c.get('mark')?.reset(''));
    this.successMessage = '';
    this.errorMessage = '';
  }
}
