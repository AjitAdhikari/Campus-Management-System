import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notice, NoticeService } from 'src/app/services/notice.service';
import { Course, CourseService } from '../../../../services/course.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentCourses: Course[] = [];
  announcements: Notice[] = [];

  constructor(
    private courseService: CourseService,
    private noticeService: NoticeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadAnnouncements();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.recentCourses = courses.slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
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

  openAnnouncementDetail(announcement: Notice) {
    this.router.navigate(['/admin/notice-control'], {
      queryParams: { noticeId: announcement.id }
    });
  }
}
