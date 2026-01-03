import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AttendanceRecord {
  id?: number;
  faculty_id: string | number;
  clock_in_time?: string;
  created_at?: string;
  updated_at?: string;
  faculty?: {
    id: string;
    name: string;
  };
}

export interface AttendanceResponse {
  success: boolean;
  data?: AttendanceRecord | AttendanceRecord[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = environment.ApiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Clock in - record faculty attendance
   */
  clockIn(facultyId: string | number): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(
      `${this.apiUrl}/attendance`,
      { faculty_id: facultyId }
    );
  }

  /**
   * Get attendance records for a faculty member
   */
  getAttendance(facultyId: string | number): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(
      `${this.apiUrl}/attendance/${facultyId}`
    );
  }

  /**
   * Get all attendance records (admin)
   */
  getAllAttendance(): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(
      `${this.apiUrl}/attendance`
    );
  }

  /**
   * Delete all attendance records for a faculty member
   */
  clearAttendance(facultyId: string | number): Observable<AttendanceResponse> {
    return this.http.delete<AttendanceResponse>(
      `${this.apiUrl}/attendance/${facultyId}`
    );
  }
}
