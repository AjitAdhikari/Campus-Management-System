import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { UserService } from 'src/app/services/user.service';
import { UserProfileView } from '../../setting.model';
import { SettingService } from '../../setting.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  loading = false;
  currentUserId: string | null = null;
  userProfile: UserProfileView | null = null;
  selectedAvatarFile: File | undefined;
  avatarPreview: string | null = null;

  constructor(
    private toastr: ToastrService,
    private settingService: SettingService
    , private userService: UserService
  ) { }

  ngOnInit(): void {
    const stored = StorageHelper.getLocalStorageItem('_user_details');
    if (!stored) {
      this.toastr.error('No user session found. Please login again.');
      return;
    }

    const user = JSON.parse(stored);
    this.currentUserId = user?.id || user?.ID || null;

    if (this.currentUserId) {
      this.loadProfile(this.currentUserId);
    }
  }

  loadProfile(userId: string) {
    this.loading = true;
    this.settingService.getUserProfile(userId).subscribe({
      next: (profile: UserProfileView) => {
        // normalize role and populate avatar preview for display
        profile.role = this.normalizeRole(profile.role);
        this.userProfile = profile;
        this.avatarPreview = profile.avatar || null;
        this.userService.setUser(profile);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err || 'Failed to load profile');
      }
    });
  }

  private normalizeRole(role: any): string {
    if (role == null) return '';
    const s = String(role).toLowerCase();
    if (s === '1' || s === 'student') return 'student';
    if (s === '2' || s === 'faculty') return 'faculty';
    if (s === '3' || s === 'admin' || s === 'administrator') return 'admin';
    return s;
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedAvatarFile = input.files[0];
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
        // update shared user state immediately so header shows preview
        const cur = this.userService.current as UserProfileView | null;
        const base = cur || this.userProfile || { id: this.currentUserId || '', name: '', email: '' } as any;
        const updated: UserProfileView = {
          ...base,
          avatar: this.avatarPreview
        } as UserProfileView;
        this.userService.setUser(updated);
      };
      reader.readAsDataURL(this.selectedAvatarFile);
    }
  }

  uploadPhoto() {
    if (!this.selectedAvatarFile || !this.currentUserId) {
      this.toastr.warning('Please select a photo first.');
      return;
    }

    this.loading = true;
    const payload: any = {
      id: this.currentUserId,
      name: this.userProfile?.name || '',
      email: this.userProfile?.email || '',
      role: this.userProfile?.role,
      subjects: this.userProfile?.subjects,
      semesters: this.userProfile?.semesters,
      // backend validation requires active_status
      active_status: (this.userProfile as any)?.active_status ?? 1
    };

    this.settingService.updateUserProfile(payload, this.selectedAvatarFile).subscribe({
      next: () => {
        this.toastr.success('Photo uploaded successfully');
        this.loading = false;
        this.selectedAvatarFile = undefined;
        this.avatarPreview = null;
        // Reload profile to show updated avatar
        if (this.currentUserId) {
          this.loadProfile(this.currentUserId);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Upload avatar error:', err);
        this.toastr.error(err || 'Failed to upload photo');
      }
    });
  }

  getAvatarSrc(): string {
    if (this.avatarPreview) return this.avatarPreview;
    const avatar = this.userProfile?.avatar;
    if (!avatar) return '/assets/images/user-avatar.png';
    // already a full URL or data URI
    if (/^(https?:)?\/\//.test(avatar) || avatar.startsWith('data:')) return avatar;
    // already an absolute path
    if (avatar.startsWith('/')) return avatar;
    // assume stored path under /storage/
    return window.location.origin + '/storage/' + avatar;
  }

  isStudent(): boolean {
    return this.userProfile?.role === 'student';
  }

  isFaculty(): boolean {
    return this.userProfile?.role === 'faculty';
  }
}
