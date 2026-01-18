import { Component, OnInit } from '@angular/core';
import StorageHelper from 'src/app/helpers/StorageHelper';
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
  facultyId: string | number | null = null;
  todayString: string = '';

  constructor(
    private assignmentService: AssignmentService,
    private courseService: CourseService
  ) { }

  ngOnInit() {
    const today = new Date();
    this.todayString = today.toISOString().split('T')[0];
    const userDetails = StorageHelper.getLocalStorageItem('_user_details');
    if (userDetails) {
      try {
        const user = JSON.parse(userDetails);
        this.facultyId = user?.id;
      } catch (e) {
        console.error('Error parsing user details:', e);
      }
    }
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
    if (!this.facultyId) {
      console.error('No faculty ID available');
      return;
    }

    this.courseService.getFacultyCourses(this.facultyId).subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        console.error('Failed to load faculty courses', error);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = [input.files[0]];
    }
  }

  submitAssignment(title: string, description: string, due: string) {
    if (!title || !due) {
      alert('Please provide title and due date');
      return;
    }
    const dueDate = new Date(due);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (dueDate < today) {
      alert('Due date cannot be in the past. Please write valid due date.');
      return;
    }

    if (this.courses.length === 0) {
      alert('No course assigned to you. Please contact administrator.');
      return;
    }

    const courseId = this.courses[0].id;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('due_date', due);
    formData.append('course_id', String(courseId));

    if (this.selectedFiles.length > 0) {
      formData.append('attachment', this.selectedFiles[0]);
    }

    this.loading = true;
    this.assignmentService.createAssignment(formData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Assignment created successfully');
          this.loadAssignments();
          this.selectedFiles = [];
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
    this.selectedFiles = [];
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
          const studentName = s.student?.profile?.first_name 
            ? `${s.student.profile.first_name} ${s.student.profile.last_name || ''}`.trim()
            : s.student?.name || 'student';
          alert('Feedback saved for ' + studentName);
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
