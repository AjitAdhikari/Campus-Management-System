import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Course, CourseService, Department } from '../../../../services/course.service';

@Component({
  selector: 'app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.css']
})
export class AddCoursesComponent implements OnInit {
  model = { title: '', code: '', credit: 0, department: '', semester: 1, syllabus: null as File | null };

  courses: Course[] = [];
  departments: Department[] = [];
  editingId: number | null = null;

  showForm = false;

  // Filter properties
  filterDepartment: string = '';
  filterSemester: number | '' = '';

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
    this.loadDepartments();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        alert('Failed to load courses. Please try again.');
      }
    });
  }

  loadDepartments() {
    this.courseService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        alert('Failed to load departments. Please try again.');
      }
    });
  }

  // Filtering logic
  filteredCourses() {
    return this.courses.filter(c => {
      const matchesDept = !this.filterDepartment || c.department === this.filterDepartment;
      const matchesSem = !this.filterSemester || c.semester === this.filterSemester;
      return matchesDept && matchesSem;
    });
  }

  submit(form: NgForm) {
    if (!form.valid) return;
    if (!this.model.syllabus && this.editingId === null) {
      alert('Please attach a syllabus file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.model.title);
    formData.append('code', this.model.code);
    formData.append('credit', this.model.credit.toString());
    formData.append('department', this.model.department);
    formData.append('semester', this.model.semester.toString());
    if (this.model.syllabus) {
      formData.append('syllabus', this.model.syllabus);
    }

    if (this.editingId !== null) {
      this.courseService.updateCourse(this.editingId, formData).subscribe({
        next: () => {
          this.loadCourses();
          this.resetForm(form);
          alert('Course updated successfully!');
        },
        error: (err) => {
          console.error('Error updating course:', err);
          if (err.error?.errors) {
            const errors = Object.values(err.error.errors).flat();
            alert('Validation errors:\n' + errors.join('\n'));
          } else {
            alert('Failed to update course. Please try again.');
          }
        }
      });
    } else {
      this.courseService.addCourse(formData).subscribe({
        next: () => {
          this.loadCourses();
          this.resetForm(form);
          alert('Course added successfully!');
        },
        error: (err) => {
          console.error('Error adding course:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.message);
          console.error('Error details:', err.error);
          
          if (err.error?.errors) {
            const errors = Object.values(err.error.errors).flat();
            alert('Validation errors:\n' + errors.join('\n'));
          } else if (err.error?.message) {
            alert('Error: ' + err.error.message);
          } else if (err.message) {
            alert('Error: ' + err.message + '\nStatus: ' + err.status);
          } else {
            alert('Failed to add course. Please try again.');
          }
        }
      });
    }
  }

  edit(course: Course) {
    this.model = {
      title: course.course_name,
      code: course.course_code,
      credit: course.credit || 0,
      department: course.department || '',
      semester: course.semester || 1,
      syllabus: null
    };
    this.editingId = course.id;
    this.showForm = true;
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses();
          alert('Course deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          alert('Failed to delete course. Please try again.');
        }
      });
    }
  }

  cancel() {
    this.editingId = null;
    this.model = { title: '', code: '', credit: 0, department: '', semester: 1, syllabus: null };
    this.showForm = false;
  }

  resetForm(form: NgForm) {
    this.editingId = null;
    this.model = { title: '', code: '', credit: 0, department: '', semester: 1, syllabus: null };
    form.resetForm();
    this.showForm = false;
  }

  onSyllabusSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (validTypes.includes(file.type)) {
        this.model.syllabus = file;
      } else {
        alert('Please upload a valid file (PDF, DOC, DOCX)');
        input.value = '';
      }
    }
  }
}