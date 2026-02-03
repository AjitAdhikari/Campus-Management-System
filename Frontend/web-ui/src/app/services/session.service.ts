import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import StorageHelper from '../helpers/StorageHelper';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private sessionId: string = '';
    private readonly SESSION_KEY = '_session_id';
    private readonly LOGOUT_EVENT = '_logout_event';
    private logoutSubject = new Subject<void>();

    logout$ = this.logoutSubject.asObservable();

    constructor(private router: Router) {
        this.initSessionMonitoring();
    }

    /**
     * Initialize session monitoring across tabs
     */
    private initSessionMonitoring(): void {
        // Listen for storage events from other tabs
        window.addEventListener('storage', (event: StorageEvent) => {
            // Check if logout event was triggered from another tab
            if (event.key === this.LOGOUT_EVENT && event.newValue) {
                this.handleLogoutFromOtherTab();
            }

            // Check if session ID changed (new login from another tab)
            if (event.key === this.SESSION_KEY && event.newValue !== this.sessionId) {
                if (this.sessionId && event.newValue) {
                    // Session changed - another login occurred
                    this.handleSessionChange();
                }
            }
        });

        // Load current session ID
        this.sessionId = StorageHelper.getStorageItem(this.SESSION_KEY) || '';
    }

    /**
     * Create a new session when user logs in
     */
    createSession(): void {
        this.sessionId = this.generateSessionId();
        StorageHelper.setLocalStorageItem(this.SESSION_KEY, this.sessionId);
    }

    /**
     * Destroy current session and notify other tabs
     */
    destroySession(): void {
        this.sessionId = '';
        StorageHelper.removeStorageItem(this.SESSION_KEY);

        // Trigger logout event for other tabs
        const logoutTimestamp = Date.now().toString();
        StorageHelper.setLocalStorageItem(this.LOGOUT_EVENT, logoutTimestamp);

        // Clean up logout event after a short delay
        setTimeout(() => {
            StorageHelper.removeStorageItem(this.LOGOUT_EVENT);
        }, 1000);
    }

    /**
     * Get current session ID
     */
    getSessionId(): string {
        return this.sessionId;
    }

    /**
     * Check if session is valid
     */
    isSessionValid(): boolean {
        const storedSessionId = StorageHelper.getStorageItem(this.SESSION_KEY);
        return !!storedSessionId && storedSessionId === this.sessionId;
    }

    /**
     * Handle logout triggered from another tab
     */
    private handleLogoutFromOtherTab(): void {
        console.log('Logout detected from another tab');
        this.sessionId = '';
        StorageHelper.removeToken();
        StorageHelper.removeStorageItem('_user_details');
        this.logoutSubject.next();
        this.router.navigate(['/login']);
    }

    /**
     * Handle session change (new login from another tab)
     */
    private handleSessionChange(): void {
        console.log('New login detected from another tab - logging out current session');
        this.sessionId = '';
        StorageHelper.removeToken();
        StorageHelper.removeStorageItem('_user_details');
        this.logoutSubject.next();
        this.router.navigate(['/login']);
    }

    /**
     * Generate unique session ID
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
