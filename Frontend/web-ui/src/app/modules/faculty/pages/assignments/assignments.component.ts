import { Component, OnInit } from '@angular/core';
import { Assignment, AssignmentService, AssignmentSubmission } from '../../../../services/assignment.service';
import { Course, CourseService } from '../../../../services/course.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  selectedFiles: File[] = [];
  assignments: Assignment[] = [];
  courses: Course[] = [];
  showForm = false;
  submissionsTarget: Assignment | null = null;
  selectedSubmission: AssignmentSubmission | null = null;
  loading = false;

  constructor(
    private assignmentService: AssignmentService,
    private courseService: CourseService
  ) { }

  ngOnInit() {
    this.loadAssignments();
    this.loadCourses();
  }

  loadAssignments() {
    this.loading = true;
    this.assignmentService.getFacultyAssignments().subscribe({
      next: (response) => {
        if (response.success) {
          this.assignments = Array.isArray(response.data) ? response.data : [response.data];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load assignments', error);
        alert('Failed to load assignments');
        this.loading = false;
      }
    });
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        console.error('Failed to load courses', error);
      }
    });
  }

  clearForm() {
    this.selectedFiles = [];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = [input.files[0]];
    }
  }

  submitAssignment(title: string, description: string, due: string, courseId: string) {
    if (!title || !due || !courseId) {
      alert('Please provide title, due date, and course');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('due_date', due);
    formData.append('course_id', courseId);

    if (this.selectedFiles.length > 0) {
      formData.append('attachment', this.selectedFiles[0]);
    }

    this.loading = true;
    this.assignmentService.createAssignment(formData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Assignment created successfully');
          this.loadAssignments();
          this.clearForm();
          this.showForm = false;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to create assignment', error);
        alert('Failed to create assignment: ' + (error.error?.message || 'Unknown error'));
        this.loading = false;
      }
    });
  }

  openCreate() {
    console.log('openCreate called');
    this.showForm = true;
  }

  openSubmissions(a: Assignment) {
    this.loading = true;
    this.assignmentService.getSubmissions(a.id).subscribe({
      next: (response) => {
        if (response.success) {
          a.submissions = response.data;
          this.submissionsTarget = a;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load submissions', error);
        alert('Failed to load submissions');
        this.loading = false;
      }
    });
  }

  saveSubmissionFeedback(s: AssignmentSubmission) {
    if (!s.feedback && !s.grade) {
      alert('Please provide feedback or grade');
      return;
    }

    this.loading = true;
    this.assignmentService.updateSubmissionFeedback(s.id, s.feedback || '', s.grade).subscribe({
      next: (response) => {
        if (response.success) {
          let studentName = 'student';
          if (s.student) {
            if (s.student.profile && s.student.profile.first_name) {
              studentName = `${s.student.profile.first_name} ${s.student.profile.last_name || ''}`;
            } else if (s.student.name) {
              studentName = s.student.name;
            }
          }
          alert('Feedback saved for ' + studentName.trim());
          this.closeFeedbackForm();
          this.openSubmissions(this.submissionsTarget!);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to save feedback', error);
        alert('Failed to save feedback');
        this.loading = false;
      }
    });
  }

  closeSubmissions() {
    this.submissionsTarget = null;
    this.selectedSubmission = null;
  }

  openFeedbackForm(submission: AssignmentSubmission) {
    this.selectedSubmission = submission;
  }

  closeFeedbackForm() {
    this.selectedSubmission = null;
  }

  downloadAttachment(file: string) {
    if (!file) {
      alert('No attachment available');
      return;
    }
    const url = this.assignmentService.getFileUrl(file);
    window.open(url, '_blank');
  }

  deleteAssignment(id: number) {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    this.loading = true;
    this.assignmentService.deleteAssignment(id).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Assignment deleted successfully');
          this.loadAssignments();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to delete assignment', error);
        alert('Failed to delete assignment');
        this.loading = false;
      }
    });
  }

  getSubmissionCount(assignment: Assignment): number {
    return assignment.submissions?.length || 0;
  }
}
