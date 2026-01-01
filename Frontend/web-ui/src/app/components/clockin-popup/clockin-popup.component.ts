import { Component, OnInit } from '@angular/core';
import StorageHelper from 'src/app/helpers/StorageHelper';

@Component({
  selector: 'app-clockin-popup',
  templateUrl: './clockin-popup.component.html',
  styleUrls: ['./clockin-popup.component.css']
})
export class ClockinPopupComponent implements OnInit {
  showModal: boolean = false;
  facultyId: string | number | null = null;

  ngOnInit(): void {
    this.checkAndShow();
  }

  private checkAndShow(): void {
    const userDetails = StorageHelper.getLocalStorageItem('_user_details');
    let user: any = null;
    try {
      if (userDetails) user = JSON.parse(userDetails);
    } catch { user = null; }
    if (!user || !user.id || (user.role && user.role.toLowerCase() !== 'faculty')) return;
    this.facultyId = user.id;
    const lastKey = `faculty_last_clockin_${this.facultyId}`;
    const last = StorageHelper.getLocalStorageItem(lastKey);
    if (!last) {
      this.showModal = true;
      return;
    }
    const lastTs = Date.parse(last as string);
    if (isNaN(lastTs)) { this.showModal = true; return; }
    const diff = Date.now() - lastTs;
    const twelveHours = 12 * 60 * 60 * 1000;
    this.showModal = diff >= twelveHours;
  }

  close(): void { this.showModal = false; }

  clockIn(): void {
    if (!this.facultyId) return;
    const key = `faculty_attendance_${this.facultyId}`;
    const lastKey = `faculty_last_clockin_${this.facultyId}`;
    const now = new Date();
    const raw = StorageHelper.getLocalStorageItem(key);
    let arr: any[] = [];
    try { if (raw) arr = JSON.parse(raw as string); } catch { arr = []; }
    // include faculty name for display
    let name = '';
    try {
      const ud = StorageHelper.getLocalStorageItem('_user_details');
      if (ud) {
        const u = JSON.parse(ud as string);
        name = u?.name || u?.full_name || u?.username || '';
      }
    } catch { name = ''; }
    arr.unshift({ timestamp: now.toISOString(), name, note: 'Clock In' });
    StorageHelper.setLocalStorageItem(key, JSON.stringify(arr));
    StorageHelper.setLocalStorageItem(lastKey, now.toISOString());
    this.showModal = false;
  }
}
