import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { UserProfileView } from 'src/app/modules/setting/setting.model';
import { environment } from 'src/environments/environment';

export type UserRole = 'Admin' | 'Student' | 'Faculty';
export type UserStatus = 'Active' | 'Inactive';

// API response shape (backend currently returns these fields)
export interface ApiUser {
  id: number | string;
  name: string;
  email: string;
  active_status?: number;
  role?: string;
  subjects?: string | null;
  semesters?: string | number | null;
  department?: string | null;
  fees?: number | string | null;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  roles: string[];
  status: UserStatus;
  password?: string;
  semester?: number;
  subjects?: string;
  activity?: string;
  department?: string;
  fees?: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user$ = new BehaviorSubject<UserProfileView | null>(null);
  private readonly baseUrl = `${environment.ApiUrl}/users`;

  constructor(private http: HttpClient) {
    const raw = StorageHelper.getLocalStorageItem('_user_details');
    if (raw) {
      try {
        this._user$.next(JSON.parse(raw));
      } catch (e) { }
    }
  }

  // reactive user state
  get user$() {
    return this._user$.asObservable();
  }

  get current() {
    return this._user$.getValue();
  }

  setUser(user: UserProfileView | null) {
    if (user) {
      StorageHelper.setLocalStorageItem('_user_details', JSON.stringify(user));
    } else {
      StorageHelper.removeStorageItem('_user_details');
    }
    this._user$.next(user);
  }

  // CRUD for admin user-management
  list(): Observable<User[]> {
    return this.http.get<ApiUser[]>(this.baseUrl).pipe(map(users => users.map(u => this.toUser(u))));
  }

  create(user: Partial<User> & { roles: string[] }): Observable<any> {
    const payload = this.toApiPayload(user);
    return this.http.post(`${this.baseUrl}`, payload);
  }

  update(id: number | string, user: Partial<User> & { roles: string[] }): Observable<any> {
    const payload = this.toApiPayload({ ...user, id });
    return this.http.post(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  private toUser(api: ApiUser): User {
    const role = this.normalizeRole(api.role);
    return {
      id: api.id,
      name: api.name,
      email: api.email,
      roles: role ? [role] : [],
      status: api.active_status === 0 ? 'Inactive' : 'Active',
      semester: api.semesters ? Number(api.semesters) : undefined,
      subjects: api.subjects || undefined,
      department: api.department || undefined,
      fees: api.fees !== undefined && api.fees !== null ? Number(api.fees) : undefined
    };
  }

  private normalizeRole(role?: string): UserRole | '' {
    if (!role) return '';
    const r = role.toLowerCase();
    if (r === 'admin') return 'Admin';
    if (r === 'student') return 'Student';
    if (r === 'faculty') return 'Faculty';
    return '';
  }

  private toApiPayload(user: Partial<User> & { roles?: string[] }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      active_status: user.status === 'Inactive' ? 0 : 1,
      role: user.roles && user.roles.length ? user.roles[0] : user.roles,
      semesters: user.semester !== undefined ? String(user.semester) : null,
      subjects: user.subjects || null,
      department: user.department || null,
      fees: user.fees !== undefined && user.fees !== null ? Number(user.fees) : null
    };
  }
}
