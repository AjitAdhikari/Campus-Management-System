import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DepartmentPayload {
  id?: number | string;
  name: string;
  code?: string | null;
  description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private base = `${environment.ApiUrl}/departments`;

  constructor(private http: HttpClient) {}

  list(): Observable<DepartmentPayload[]> {
    return this.http.get<DepartmentPayload[]>(this.base);
  }

  create(payload: Partial<DepartmentPayload>) {
    return this.http.post(this.base, payload);
  }

  update(id: number | string, payload: Partial<DepartmentPayload>) {
    return this.http.put(`${this.base}/${id}`, payload);
  }

  delete(id: number | string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
