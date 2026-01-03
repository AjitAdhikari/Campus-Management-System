import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notice, NoticeService } from 'src/app/services/notice.service';
import { CourseService } from '../../../../services/course.service';
import { DepartmentService } from '../../../../services/department.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  announcements: Notice[] = [];
  stats = {
    students: 0,
    teachers: 0,
    courses: 0,
    fees: 0,
    notices: 0,
    departments: 0
  };

  constructor(
    private courseService: CourseService,
    private noticeService: NoticeService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStatistics();
    this.loadAnnouncements();
  }

  loadStatistics() {
    // Load courses count
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.stats.courses = courses.length;
      },
      error: (error) => console.error('Error loading courses:', error)
    });

    // Load notices count
    this.noticeService.list({ limit: 1000 }).subscribe({
      next: (response) => {
        this.stats.notices = response.items?.length || 0;
      },
      error: (error) => console.error('Error loading notices:', error)
    });

    // Load users and count students and teachers
    this.userService.list().subscribe({
      next: (users) => {
        this.stats.students = users.filter(u => u.roles.includes('Student')).length;
        this.stats.teachers = users.filter(u => u.roles.includes('Faculty')).length;
      },
      error: (error) => console.error('Error loading users:', error)
    });

    // Load departments count
    this.departmentService.list().subscribe({
      next: (departments) => {
        this.stats.departments = departments.length;
      },
      error: (error) => console.error('Error loading departments:', error)
    });

    // Note: Fee collections count requires fee API endpoint
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
}
