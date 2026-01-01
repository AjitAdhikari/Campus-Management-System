import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Course {
  id: number;
  course_name: string;
  course_code: string;
  credit: number;
  department: string;
  semester: number;
  syllabus_path?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.ApiUrl;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  addCourse(data: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, data);
  }

  updateCourse(id: number, data: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses/${id}?_method=PUT`, data);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }
}