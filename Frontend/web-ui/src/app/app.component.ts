import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenValidator } from './helpers/TokenValidator';
import { SessionService } from './services/session.service';
import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adminpanel';
  sidebarVisible$ = this.sidebarService.sidebarVisible$;

  constructor(
    private router: Router,
    public sidebarService: SidebarService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.reloadToLogin();
    this.router.events.subscribe(() => {
      this.sidebarService.closeSidebar();
    });

    // Listen for logout events from other tabs
    this.sessionService.logout$.subscribe(() => {
      console.log('Session terminated - redirecting to login');
    });
  }

  reloadToLogin(): any {
    let isValidate = TokenValidator.validateToken();
    if (!isValidate) {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    // return true;
    return TokenValidator.validateToken();
  }

  isAdminRoute(): boolean {
    try {
      return this.router.url.startsWith('/admin');
    } catch {
      return false;
    }
  }

  isFacultyRoute(): boolean {
    try {
      return this.router.url.startsWith('/faculty');
    } catch {
      return false;
    }
  }

  isStudentRoute(): boolean {
    try {
      return this.router.url.startsWith('/student');
    } catch {
      return false;
    }
  }

  isLoginRoute(): boolean {
    try {
      return this.router.url === '/login';
    } catch {
      return false;
    }
  }
}
