import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-faculty-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName = 'User';
  avatarSrc: string | null = null;
  hasAvatar = false;
  time: string = '';
  date: string = '';
  userRole: string = 'faculty';
  greeting: string = 'Hello';
  private timerId: any;
  private sub?: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private sidebarService: SidebarService,
    private sessionService: SessionService
  ) { }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  ngOnInit(): void {
    this.updateTime();
    this.timerId = setInterval(() => this.updateTime(), 1000);
    this.getUserRole();
    this.sub = this.userService.user$.subscribe(u => {
      if (u) {
        this.userName = u.name || this.userName;
        this.avatarSrc = this.resolveAvatar(u.avatar);
        this.hasAvatar = !!u.avatar;
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
    this.sub?.unsubscribe();
  }

  private updateTime(): void {
    const now = new Date();
    this.time = now.toLocaleTimeString();
    this.date = now.toLocaleDateString();
    try {
      const nep = this.getNepalTime(now);
      const h = nep.getHours();
      if (h >= 5 && h < 12) this.greeting = 'Good morning';
      else if (h >= 12 && h < 17) this.greeting = 'Good afternoon';
      else if (h >= 17 && h < 21) this.greeting = 'Good evening';
      else this.greeting = 'Good night';
    } catch (e) { this.greeting = 'Hello'; }
  }

  private getNepalTime(base: Date): Date {
    const utc = base.getTime() + (base.getTimezoneOffset() * 60000);
    const nepOffsetMin = 5 * 60 + 45;
    return new Date(utc + nepOffsetMin * 60000);
  }

  private getUserRole(): void {
    const urlPath = this.router.url;
    if (urlPath.includes('/admin')) {
      this.userRole = 'admin';
    } else if (urlPath.includes('/student')) {
      this.userRole = 'student';
    } else if (urlPath.includes('/faculty')) {
      this.userRole = 'faculty';
    }
  }

  private resolveAvatar(avatar: string | undefined | null): string | null {
    if (!avatar) return null;
    if (/^(https?:)?\/\//.test(avatar) || avatar.startsWith('data:')) return avatar;
    if (avatar.startsWith('/')) return avatar;
    return window.location.origin + '/storage/' + avatar;
  }

  getSettingsRoute(): string {
    if (this.userRole === 'student') {
      return '/student/setting';
    } else if (this.userRole === 'faculty') {
      return '/faculty/setting';
    }
    return '/admin/setting';
  }

  logOut() {
    this.sessionService.destroySession();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
