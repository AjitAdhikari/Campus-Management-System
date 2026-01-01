import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Assignment, AssignmentService } from '../../../../services/assignment.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssignmentsComponent implements OnInit {
  assignments: Assignment[] = [];
  loading = false;
  selectedAssignment: Assignment | null = null;
  selectedFile: File | null = null;
  showSubmitModal = false;
  viewingSubmission: Assignment | null = null;

  constructor(private assignmentService: AssignmentService) { }

  ngOnInit() {
    this.loadAssignments();
  }

  loadAssignments() {
    this.loading = true;
    this.assignmentService.getStudentAssignments().subscribe({
      next: (response) => {
        if (response.success) {
          this.assignments = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          console.error('API returned unsuccessful response:', response);
          alert(response.message || 'Failed to load assignments');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load assignments', error);
        const errorMsg = error.error?.message || error.error?.error || error.message || 'Unknown error';
        alert('Failed to load assignments: ' + errorMsg);
        this.loading = false;
      }
    });
  }

  getStatus(assignment: Assignment): string {
    if (assignment.is_submitted) {
      return 'Submitted';
    }
    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    if (dueDate < now) {
      return 'Overdue';
    }
    return 'Pending';
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }

  openSubmitModal(assignment: Assignment) {
    if (assignment.is_submitted) {
      this.viewSubmission(assignment);
      return;
    }
    this.selectedAssignment = assignment;
    this.showSubmitModal = true;
  }

  closeSubmitModal() {
    this.selectedAssignment = null;
    this.selectedFile = null;
    this.showSubmitModal = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitAssignment() {
    if (!this.selectedAssignment || !this.selectedFile) {
      alert('Please select a file to submit');
      return;
    }

    this.loading = true;
    this.assignmentService.submitAssignment(this.selectedAssignment.id, this.selectedFile).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Assignment submitted successfully');
          this.loadAssignments();
          this.closeSubmitModal();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to submit assignment', error);
        alert('Failed to submit assignment: ' + (error.error?.message || 'Unknown error'));
        this.loading = false;
      }
    });
  }

  viewSubmission(assignment: Assignment) {
    this.viewingSubmission = assignment;
  }

  closeViewSubmission() {
    this.viewingSubmission = null;
  }

  downloadAttachment(file: string) {
    if (!file) {
      alert('No attachment available');
      return;
    }
    const url = this.assignmentService.getFileUrl(file);
    window.open(url, '_blank');
  }
}
