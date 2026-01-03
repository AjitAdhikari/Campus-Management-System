import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { Course, CourseService } from 'src/app/services/course.service';

interface Student {
  id: string;
  name: string;
}

interface SubmittedGrade {
  id: number;
  student_name: string;
  course_name: string;
  course_code: string;
  marks: number;
  grade: string;
  status: string;
  uploaded_at: string;
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  form: FormGroup;
  students: Student[] = [];
  courses: Course[] = [];
  facultyId: string | null = null;
  submittedGrades: SubmittedGrade[] = [];
  showSubmittedGrades = false;

  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    this.form = this.fb.group({
      course: ['', Validators.required],
      marks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadFacultyCourses();
    this.loadSubmittedGrades();
    
    // Watch for course changes to load students
    this.form.get('course')?.valueChanges.subscribe(courseId => {
      if (courseId) {
        this.loadCourseStudents(courseId);
      } else {
        this.students = [];
        this.clearMarksArray();
      }
    });
  }

  loadFacultyCourses(): void {
    const userDetails = StorageHelper.getLocalStorageItem('_user_details');
    if (!userDetails) {
      this.errorMessage = 'User not logged in. Please login again.';
      return;
    }

    try {
      const user = JSON.parse(userDetails);
      this.facultyId = user?.id;
      
      if (!this.facultyId) {
        this.errorMessage = 'Faculty ID not found. Please login again.';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      
      this.courseService.getFacultyCourses(this.facultyId).subscribe({
        next: (courses) => {
          this.courses = courses || [];
          this.isLoading = false;
          
          if (this.courses.length === 0) {
            this.errorMessage = 'No courses assigned to you. Please contact admin.';
          }
        },
        error: (err) => {
          console.error('Error loading courses:', err);
          this.errorMessage = 'Failed to load courses. Please try again.';
          this.isLoading = false;
        }
      });
    } catch (e) {
      console.error('Error parsing user details:', e);
      this.errorMessage = 'Error loading user information. Please login again.';
    }
  }

  loadCourseStudents(courseId: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.courseService.getCourseStudents(courseId).subscribe({
      next: (students) => {
        this.students = students;
        this.initializeMarksArray();
        this.isLoading = false;
        
        if (this.students.length === 0) {
          this.errorMessage = 'No students enrolled in this course.';
        }
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.errorMessage = 'Failed to load students. Please try again.';
        this.isLoading = false;
      }
    });
  }

  initializeMarksArray(): void {
    const marksArray = this.form.get('marks') as FormArray;
    marksArray.clear();
    
    this.students.forEach(student => {
      marksArray.push(this.fb.group({
        studentId: [student.id],
        name: [student.name],
        mark: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
      }));
    });
  }

  clearMarksArray(): void {
    const marksArray = this.form.get('marks') as FormArray;
    marksArray.clear();
  }

  get marks(): FormArray {
    return this.form.get('marks') as FormArray;
  }

  get markGroups(): FormGroup[] {
    return this.marks.controls as FormGroup[];
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.form.invalid) {
      this.errorMessage = 'Please fill all required fields and ensure all marks are valid (0-100).';
      this.form.markAllAsTouched();
      return;
    }

    if (!this.facultyId) {
      this.errorMessage = 'Faculty ID not found. Please login again.';
      return;
    }

    const payload = {
      course_id: this.form.value.course,
      faculty_id: this.facultyId,
      marks: this.form.value.marks.map((m: any) => ({ 
        studentId: m.studentId, 
        mark: m.mark 
      }))
    };

    this.isLoading = true;
    
    this.courseService.submitGrades(payload).subscribe({
      next: (response) => {
        this.successMessage = 'Marks submitted successfully!';
        this.isLoading = false;
        this.loadSubmittedGrades();
        setTimeout(() => this.resetForm(), 2000);
      },
      error: (err) => {
        console.error('Error submitting grades:', err);
        this.errorMessage = err.error?.message || 'Failed to submit marks. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadSubmittedGrades(): void {
    if (!this.facultyId) {
      const userDetails = StorageHelper.getLocalStorageItem('_user_details');
      if (!userDetails) return;
      
      try {
        const user = JSON.parse(userDetails);
        this.facultyId = user?.id;
      } catch (e) {
        return;
      }
    }

    if (!this.facultyId) return;

    this.courseService.getFacultyGrades(this.facultyId).subscribe({
      next: (grades) => {
        this.submittedGrades = grades;
      },
      error: (err) => {
        console.error('Error loading submitted grades:', err);
      }
    });
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }

  toggleSubmittedGrades(): void {
    this.showSubmittedGrades = !this.showSubmittedGrades;
  }

  resetForm(): void {
    this.form.get('course')?.reset('');
    this.clearMarksArray();
    this.students = [];
    this.successMessage = '';
    this.errorMessage = '';
  }
}
