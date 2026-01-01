import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Notice, NoticeService } from 'src/app/services/notice.service';

type NoticeSource = 'University' | 'Admin';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css']
})
export class NoticesComponent implements OnInit {
  selectedSource: NoticeSource = 'Admin';
  selectedNotice: Notice | null = null;
  notices: Notice[] = [];
  loading = false;

  constructor(private noticeService: NoticeService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadNotices();
  }

  setSource(source: NoticeSource) {
    this.selectedSource = source;
    this.selectedNotice = null;
    if (source === 'University') {
      this.notices = [];
      this.loading = false;
    } else {
      this.loadNotices();
    }
  }

  viewNotice(n: Notice) {
    this.selectedNotice = n;
  }

  closeNotice() {
    this.selectedNotice = null;
  }

  loadNotices() {
    this.loading = true;
    this.noticeService.list({ source: this.selectedSource }).subscribe({
      next: (response) => {
        this.notices = (response?.items || []).sort((a, b) => 
          new Date(b.notice_date).getTime() - new Date(a.notice_date).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const message = err?.error?.error || 'Failed to load notices';
        this.toastr.error(message);
      }
    });
  }

  get filteredNotices(): Notice[] {
    return this.notices;
  }
}
