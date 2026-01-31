import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ChatContact {
    id: string;
    name: string;
    email: string;
    profile?: {
        avatar?: string;
        role?: string;
    };
    subject?: string;
    last_message?: string;
    last_message_at?: string;
    unread_count: number;
    status: string;
}

export interface ChatMessage {
    id: number;
    sender_id: string;
    receiver_id: string;
    message: string;
    file_path?: string;
    file_type?: 'image' | 'pdf';
    is_read: boolean;
    created_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private readonly baseUrl = `${environment.ApiUrl}/chat`;
    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();
    private pollingSub?: Subscription;

    constructor(private http: HttpClient) {
        this.startPolling();
    }

    startPolling() {
        if (this.pollingSub) return;
        this.pollingSub = interval(10000).subscribe(() => {
            this.getContacts().subscribe();
        });
    }

    stopPolling() {
        if (this.pollingSub) {
            this.pollingSub.unsubscribe();
            this.pollingSub = undefined;
        }
    }

    getContacts(): Observable<{ contacts: ChatContact[] }> {
        return this.http.get<{ contacts: ChatContact[] }>(`${this.baseUrl}/contacts`).pipe(
            tap(res => {
                const total = res.contacts.reduce((sum, c) => sum + (c.unread_count || 0), 0);
                this.unreadCountSubject.next(total);
            })
        );
    }

    getMessages(contactId: string): Observable<{ messages: ChatMessage[] }> {
        return this.http.get<{ messages: ChatMessage[] }>(`${this.baseUrl}/messages/${contactId}`);
    }

    sendMessage(receiverId: string, message: string, file?: File): Observable<{ message: ChatMessage }> {
        const formData = new FormData();
        formData.append('receiver_id', receiverId);
        if (message) {
            formData.append('message', message);
        }
        if (file) {
            formData.append('file', file);
        }
        return this.http.post<{ message: ChatMessage }>(`${this.baseUrl}/send`, formData);
    }
}
