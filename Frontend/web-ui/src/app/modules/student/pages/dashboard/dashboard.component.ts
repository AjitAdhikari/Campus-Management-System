import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { Assignment, AssignmentService } from 'src/app/services/assignment.service';
import { Course, CourseService } from 'src/app/services/course.service';
import { Notice, NoticeService } from 'src/app/services/notice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  announcements: Notice[] = [];
  courses: Course[] = [];
  assignments: Assignment[] = [];
  selectedCourse: Course | null = null;
  showSyllabusModal = false;

  constructor(
    private noticeService: NoticeService, 
    private courseService: CourseService,
    private assignmentService: AssignmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAnnouncements();
    this.loadStudentCourses();
    this.loadAssignments();
  }

  loadAnnouncements() {
    this.noticeService.list({ limit: 5 }).subscribe({
      next: (response) => {
        this.announcements = response.items || [];
      },
      error: (error) => {
        console.error('Error loading announcements:', error);
      }
    });
  }

  loadStudentCourses() {
    const userDetailsStr = StorageHelper.getLocalStorageItem('_user_details');
    
    if (!userDetailsStr) {
      return;
    }
    
    try {
      const userDetails = JSON.parse(userDetailsStr);
      
      if (userDetails && userDetails.id) {
        this.courseService.getStudentCourses(userDetails.id).subscribe({
          next: (courses) => {
            this.courses = courses;
          },
          error: (error) => {
            console.error('Error loading student courses:', error);
          }
        });
      }
    } catch (e) {
      console.error('Error parsing user details:', e);
    }
  }

  loadAssignments() {
    this.assignmentService.getStudentAssignments().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          const now = new Date();
          this.assignments = response.data
            .filter(assignment => {
              const dueDate = new Date(assignment.due_date);
              return dueDate >= now && !assignment.is_submitted;
            })
            .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
            .slice(0, 5);
        }
      },
      error: (error) => {
        console.error('Error loading assignments:', error);
      }
    });
  }

  openAnnouncementDetail(announcement: Notice) {
    this.router.navigate(['/student/notices'], {
      queryParams: { noticeId: announcement.id }
    });
  }

  openSyllabus(course: Course) {
    this.selectedCourse = course;
    this.showSyllabusModal = true;
  }

  closeSyllabus() {
    this.showSyllabusModal = false;
    this.selectedCourse = null;
  }

  getSyllabusUrl(path: string | undefined): string {
    if (!path) return '';
    return `http://localhost:8000/storage/${path}`;
  }

  downloadSyllabus() {
    if (!this.selectedCourse || !this.selectedCourse.syllabus_path) return;
    const url = this.getSyllabusUrl(this.selectedCourse.syllabus_path);
    window.open(url, '_blank');
  }

  isDueSoon(dueDate: string): boolean {
    const due = new Date(dueDate);
    const now = new Date();
    const hoursDiff = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 48;
  }
}
