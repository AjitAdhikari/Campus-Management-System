import { Component, OnInit } from '@angular/core';
import StorageHelper from 'src/app/helpers/StorageHelper';

interface AttendanceRecord { timestamp: string; name?: string; note?: string }

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  attendance: AttendanceRecord[] = [];
  facultyId: string | number | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance(): void {
    const userDetails = StorageHelper.getLocalStorageItem('_user_details');
    try {
      if (userDetails) {
        const u = JSON.parse(userDetails);
        this.facultyId = u?.id ?? null;
      }
    } catch (e) {
      this.facultyId = null;
    }
    if (!this.facultyId) return;
    const key = `faculty_attendance_${this.facultyId}`;
    const raw = StorageHelper.getLocalStorageItem(key);
    if (!raw) {
      this.attendance = [];
      return;
    }
    try {
      const parsed = JSON.parse(raw as string) as AttendanceRecord[];
      // ensure each record has a name; fallback to logged in user name
      let currentName = '';
      try {
        const ud = StorageHelper.getLocalStorageItem('_user_details');
        if (ud) {
          const u = JSON.parse(ud as string);
          currentName = u?.name || u?.full_name || u?.username || '';
        }
      } catch { }
      this.attendance = parsed.map(r => ({ timestamp: r.timestamp, name: r.name || currentName, note: r.note }));
    } catch (e) {
      this.attendance = [];
    }
  }

  clearAll(): void {
    if (!this.facultyId) return;
    const key = `faculty_attendance_${this.facultyId}`;
    StorageHelper.removeStorageItem(key);
    StorageHelper.removeStorageItem(`faculty_last_clockin_${this.facultyId}`);
    this.attendance = [];
  }
}
