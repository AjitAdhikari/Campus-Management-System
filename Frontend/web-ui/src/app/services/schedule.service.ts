import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClassSchedule {
  id: number;
  course_id: number;
  faculty_id: string | number;
  class_date: string;
  start_time: string;
  end_time: string;
  room?: string;
  status: 'scheduled' | 'cancelled' | 'rescheduled';
  course?: {
    id: number;
    course_name: string;
    course_code: string;
    semester?: number;
    department?: string;
  };
  faculty?: {
    id: string | number;
    name: string;
    email: string;
  };
}

export interface CreateScheduleRequest {
  course_id: number;
  faculty_id: string | number;
  class_date: string;
  start_time: string;
  end_time: string;
  room?: string;
  status: 'scheduled' | 'cancelled' | 'rescheduled';
}

export interface UpdateScheduleRequest {
  faculty_id: string | number;
  class_date: string;
  start_time: string;
  end_time: string;
  room?: string;
  status: 'scheduled' | 'cancelled' | 'rescheduled';
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = `${environment.ApiUrl}/class-schedules`;

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<ClassSchedule[]> {
    return this.http.get<ClassSchedule[]>(this.apiUrl);
  }

  getSchedule(id: number): Observable<ClassSchedule> {
    return this.http.get<ClassSchedule>(`${this.apiUrl}/${id}`);
  }

  createSchedule(data: CreateScheduleRequest): Observable<ClassSchedule> {
    return this.http.post<ClassSchedule>(this.apiUrl, data);
  }

  updateSchedule(id: number, data: UpdateScheduleRequest): Observable<ClassSchedule> {
    return this.http.put<ClassSchedule>(`${this.apiUrl}/${id}`, data);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
