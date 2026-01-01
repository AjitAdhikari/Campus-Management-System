import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface NoticePayload {
  title: string;
  description: string;
  notice_date: string;
}

export interface Notice {
  id: number;
  title: string;
  description: string;
  notice_date: string;
  source?: string;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface NoticeListResponse {
  items: Notice[];
}

@Injectable({ providedIn: 'root' })
export class NoticeService {
  private readonly baseUrl = `${environment.ApiUrl}/notices`;

  constructor(private http: HttpClient) {}

  create(payload: NoticePayload): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  list(params?: { offset?: number; limit?: number; source?: string }): Observable<NoticeListResponse> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 10;
    const source = params?.source ?? '';
    const sourceParam = source ? `&source=${source}` : '';
    return this.http.get<NoticeListResponse>(`${this.baseUrl}?offset=${offset}&limit=${limit}${sourceParam}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
