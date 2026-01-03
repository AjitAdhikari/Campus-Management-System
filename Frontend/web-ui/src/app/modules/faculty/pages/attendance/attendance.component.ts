import { Component, OnInit } from '@angular/core';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { AttendanceRecord, AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  attendance: AttendanceRecord[] = [];
  facultyId: string | number | null = null;
  loading = false;
  error: string | null = null;

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.loadAttendance();
  }

  getUserDetails(): void {
    const userDetails = StorageHelper.getLocalStorageItem('_user_details');
    try {
      if (userDetails) {
        const u = JSON.parse(userDetails);
        this.facultyId = u?.id ?? null;
      }
    } catch (e) {
      this.facultyId = null;
    }
  }

  loadAttendance(): void {
    if (!this.facultyId) {
      console.warn('No faculty ID found');
      return;
    }
    
    this.loading = true;
    this.error = null;

    console.log('Loading attendance for faculty:', this.facultyId);
    this.attendanceService.getAttendance(this.facultyId).subscribe({
      next: (response: any) => {
        console.log('Attendance response:', response);
        if (response.success) {
          this.attendance = Array.isArray(response.data) ? response.data : [];
        } else {
          this.error = response.message || 'Failed to load attendance';
          this.attendance = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading attendance:', error);
        const errorMsg = error?.error?.message || error?.message || 'Failed to load attendance records';
        this.error = errorMsg;
        this.attendance = [];
        this.loading = false;
      }
    });
  }

  clearAll(): void {
    if (!this.facultyId) return;
    
    if (!confirm('Are you sure you want to clear all attendance records?')) {
      return;
    }

    this.loading = true;
    this.attendanceService.clearAttendance(this.facultyId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.attendance = [];
          alert('All attendance records cleared successfully');
        } else {
          alert(response.message || 'Failed to clear attendance');
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error clearing attendance:', error);
        alert('Failed to clear attendance records');
        this.loading = false;
      }
    });
  }
}
