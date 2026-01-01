import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notice, NoticeService } from 'src/app/services/notice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  announcements: Notice[] = [];

  constructor(private noticeService: NoticeService, private router: Router) {}

  ngOnInit() {
    this.loadAnnouncements();
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
    this.router.navigate(['/student/notices'], {
      queryParams: { noticeId: announcement.id }
    });
  }
}
