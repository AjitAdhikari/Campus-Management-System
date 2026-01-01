import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Assignment {
    id: number;
    course_id: number;
    faculty_id: string;
    title: string;
    description?: string;
    due_date: string;
    attachment?: string;
    created_at?: string;
    updated_at?: string;
    course?: {
        id: number;
        course_name: string;
        course_code: string;
    };
    faculty?: {
        id: string;
        name: string;
    };
    submissions?: AssignmentSubmission[];
    submission?: AssignmentSubmission;
    is_submitted?: boolean;
}

export interface AssignmentSubmission {
    id: number;
    assignment_id: number;
    student_id: string;
    file: string;
    submitted_at: string;
    feedback?: string;
    grade?: string;
    student?: {
        id: string;
        name: string;
        profile?: {
            first_name: string;
            last_name: string;
        };
    };
}

export interface AssignmentResponse {
    success: boolean;
    data: Assignment | Assignment[];
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AssignmentService {
    private apiUrl = environment.ApiUrl;

    constructor(private http: HttpClient) { }

    getFacultyAssignments(): Observable<AssignmentResponse> {
        return this.http.get<AssignmentResponse>(`${this.apiUrl}/assignments`);
    }

    getStudentAssignments(): Observable<AssignmentResponse> {
        return this.http.get<AssignmentResponse>(`${this.apiUrl}/assignments/student`);
    }

    createAssignment(data: FormData): Observable<AssignmentResponse> {
        return this.http.post<AssignmentResponse>(`${this.apiUrl}/assignments`, data);
    }

    getAssignment(id: number): Observable<AssignmentResponse> {
        return this.http.get<AssignmentResponse>(`${this.apiUrl}/assignments/${id}`);
    }

    updateAssignment(id: number, data: FormData): Observable<AssignmentResponse> {
        return this.http.post<AssignmentResponse>(`${this.apiUrl}/assignments/${id}`, data);
    }

    deleteAssignment(id: number): Observable<AssignmentResponse> {
        return this.http.delete<AssignmentResponse>(`${this.apiUrl}/assignments/${id}`);
    }

    getSubmissions(assignmentId: number): Observable<{ success: boolean; data: AssignmentSubmission[] }> {
        return this.http.get<{ success: boolean; data: AssignmentSubmission[] }>(
            `${this.apiUrl}/assignments/${assignmentId}/submissions`
        );
    }

    submitAssignment(assignmentId: number, file: File): Observable<AssignmentResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<AssignmentResponse>(
            `${this.apiUrl}/assignments/${assignmentId}/submit`,
            formData
        );
    }

    updateSubmissionFeedback(
        submissionId: number,
        feedback: string,
        grade?: string
    ): Observable<AssignmentResponse> {
        const data = { feedback, grade };
        return this.http.post<AssignmentResponse>(
            `${this.apiUrl}/assignments/submissions/${submissionId}/feedback`,
            data
        );
    }

    getFileUrl(path: string): string {
        return `${environment.ApiUrl.replace('/api', '')}/storage/${path}`;
    }
}
