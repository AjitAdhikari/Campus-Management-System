import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Notice, NoticeService } from 'src/app/services/notice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  announcements: Notice[] = [];
  showClockInModal = false;
  facultyId: string | number | null = null;
  facultyName: string = '';
  clockingIn = false;
  hasCheckedClockIn = false;
  currentDate = new Date();
  isCheckingAttendance = true;

  constructor(
    private noticeService: NoticeService, 
    private router: Router,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.loadAnnouncements();
    this.checkAndShowClockInModal();
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

  checkAndShowClockInModal() {
    if (this.hasCheckedClockIn) return; 
    this.hasCheckedClockIn = true;
    this.isCheckingAttendance = true;
    this.showClockInModal = false; 

    const userDetails = StorageHelper.getLocalStorageItem('_user_details');
    if (!userDetails) {
      this.isCheckingAttendance = false;
      return;
    }

    try {
      const user = JSON.parse(userDetails);
      this.facultyId = user?.id ?? null;
      this.facultyName = user?.name || 'Faculty';

      if (!this.facultyId) {
        this.isCheckingAttendance = false;
        return;
      }

      
      this.attendanceService.getAttendance(this.facultyId).subscribe({
        next: (response: any) => {
          this.isCheckingAttendance = false;
          let shouldShowPopup = true;
          
          if (response.success && response.data && response.data.length > 0) {
            const lastAttendance = response.data[0];
            const lastClockInTime = new Date(lastAttendance.clock_in_time || lastAttendance.created_at).getTime();
            const currentTime = new Date().getTime();
            const hoursDifference = (currentTime - lastClockInTime) / (1000 * 60 * 60);
            
            console.log('Last clock-in:', new Date(lastClockInTime));
            console.log('Current time:', new Date(currentTime));
            console.log('Hours since last clock-in:', hoursDifference.toFixed(2));
            
            // If less than 12 hours have passed, DON'T show the modal
            if (hoursDifference < 12) {
              console.log('✓ Popup hidden - Only', hoursDifference.toFixed(2), 'hours since last clock-in. Will show after', (12 - hoursDifference).toFixed(2), 'more hours.');
              shouldShowPopup = false;
              
              // Save to localStorage for quick future checks
              StorageHelper.setLocalStorageItem(
                `last_clock_in_${this.facultyId}`, 
                lastAttendance.clock_in_time || lastAttendance.created_at
              );
            } else {
              console.log('Popup will show - More than 12 hours since last clock-in');
            }
          } else {
            console.log('Popup will show - No attendance records found');
          }
          
          // Only show modal if criteria met
          if (shouldShowPopup) {
            this.showClockInModal = true;
          }
        },
        error: (error: any) => {
          this.isCheckingAttendance = false;
          console.error('Error checking attendance:', error);
          // Don't show popup on error - safer to not interrupt user
          console.log('✗ Popup hidden due to API error');
        }
      });
    } catch (e) {
      this.isCheckingAttendance = false;
      console.error('Error checking clock-in status:', e);
    }
  }

  clockIn() {
    if (!this.facultyId) return;

    this.clockingIn = true;
    this.attendanceService.clockIn(this.facultyId).subscribe({
      next: (response: any) => {
        console.log('Clock-in response:', response);
        if (response.success) {
          // Save clock-in timestamp to localStorage to prevent showing modal again for 12 hours
          const clockInTime = new Date().toISOString();
          StorageHelper.setLocalStorageItem(
            `last_clock_in_${this.facultyId}`, 
            clockInTime
          );
          console.log('Saved clock-in time:', clockInTime);
          
          this.showClockInModal = false;
          alert('Clocked in successfully!');
        } else {
          console.error('Clock-in failed:', response);
          alert(response.message || 'Failed to clock in');
        }
        this.clockingIn = false;
      },
      error: (error: any) => {
        console.error('Error clocking in:', error);
        const errorMsg = error?.error?.message || error?.message || 'Failed to clock in. Please try again.';
        alert(errorMsg);
        this.clockingIn = false;
      }
    });
  }

  closeModal() {
    this.showClockInModal = false;
  }

  openAnnouncementDetail(announcement: Notice) {
    this.router.navigate(['/faculty/notices'], {
      queryParams: { noticeId: announcement.id }
    });
  }
}
