import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Notice, NoticePayload, NoticeService } from 'src/app/services/notice.service';

@Component({
  selector: 'app-notice-control',
  templateUrl: './notice-control.component.html',
  styleUrls: ['./notice-control.component.css']
})
export class NoticeControlComponent implements OnInit {
  currentView: 'admin' | 'university' = 'admin';
  adminNotice: { title: string; description: string; noticeDate: string } = {
    title: '',
    description: '',
    noticeDate: ''
  };

  showForm = false;

  openCreate(event?: Event) {
    if (event) event.preventDefault();
    this.showForm = true;
  }

  notices: Notice[] = [];
  loading = false;

  constructor(private noticeService: NoticeService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadNotices();
  }

  selectView(view: 'admin' | 'university') {
    this.currentView = view;
  }

  uploadAdminNotice() { 
    if (!this.adminNotice.title || !this.adminNotice.description || !this.adminNotice.noticeDate) {
      this.toastr.warning('Title, description, and date are required.');
      return;
    }

    const payload: NoticePayload = {
      title: this.adminNotice.title.trim(),
      description: this.adminNotice.description.trim(),
      notice_date: this.adminNotice.noticeDate
    };

    this.loading = true;
    this.noticeService.create(payload).subscribe({
      next: () => {
        this.toastr.success('Notice created');
        this.adminNotice = { title: '', description: '', noticeDate: '' };
        // close modal and refresh list
        this.showForm = false;
        this.loadNotices(false);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const message = err?.error?.error || 'Failed to create notice';
        this.toastr.error(message);
      }
    });
  }

  loadNotices(showLoader: boolean = true) {
    if (showLoader) {
      this.loading = true;
    }

    this.noticeService.list().subscribe({
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
}
