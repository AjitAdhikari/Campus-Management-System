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
  id?: number;
  title: string;
  description?: string;
  notice_date: string;
  url?: string; // For university notices
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
  /**
   * Fetch university notices from backend (Laravel API).
   */
  fetchUniversityNoticesBackend(): Observable<NoticeListResponse> {
    return this.http.get<NoticeListResponse>(`${environment.ApiUrl}/university-notices`);
  }

  /**
   * Fetch and parse university notices directly from the university site (client-side).
   * Note: This may fail due to CORS restrictions.
   */
  fetchUniversityNoticesDirect(): Observable<NoticeListResponse> {
    return new Observable<NoticeListResponse>((observer) => {
      fetch('https://exam.pu.edu.np/ViewAllNotice')
        .then(async (response) => {
          if (!response.ok) throw new Error('Failed to fetch university notices');
          const html = await response.text();
          // Parse HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const links = Array.from(doc.querySelectorAll('a'));
          const notices: Notice[] = links
            .filter(a => a.href.includes('/Show/Notice/'))
            .map(a => {
              const title = a.textContent?.trim() || '';
              const url = a.href;
              let notice_date = '';
              const dateMatch = title.match(/^(\d{4} \w{3} \d{2})/);
              if (dateMatch) notice_date = dateMatch[1];
              return {
                title,
                url,
                notice_date,
                description: '',
              };
            });
          observer.next({ items: notices });
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }
}
