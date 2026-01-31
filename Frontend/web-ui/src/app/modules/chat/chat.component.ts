import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ChatContact, ChatMessage, ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

    contacts: ChatContact[] = [];
    selectedContact: ChatContact | null = null;
    messages: ChatMessage[] = [];
    newMessage: string = '';
    currentUser: any = null;
    selectedFile: File | null = null;
    filePreview: string | null = null;

    private pollingSubscription!: Subscription;

    constructor(
        private chatService: ChatService,
        private userService: UserService
    ) {
        this.currentUser = this.userService.current;
    }

    get totalUnread(): number {
        return this.contacts.reduce((sum, c) => sum + (c.unread_count || 0), 0);
    }

    ngOnInit(): void {
        this.loadContacts();
        // Near real-time polling every 5 seconds
        this.pollingSubscription = interval(5000)
            .pipe(
                startWith(0),
                switchMap(() => this.chatService.getContacts())
            )
            .subscribe(res => {
                this.contacts = res.contacts;
                if (this.selectedContact) {
                    this.loadMessages(this.selectedContact.id, false);
                }
            });
    }

    ngOnDestroy(): void {
        if (this.pollingSubscription) {
            this.pollingSubscription.unsubscribe();
        }
    }

    loadContacts(): void {
        this.chatService.getContacts().subscribe(res => {
            this.contacts = res.contacts;
        });
    }

    selectContact(contact: ChatContact): void {
        this.selectedContact = contact;
        contact.unread_count = 0; // Clear unread locally for immediate feedback
        this.loadMessages(contact.id);
    }

    loadMessages(contactId: string, scroll: boolean = true): void {
        this.chatService.getMessages(contactId).subscribe(res => {
            // Only update if message count changed to avoid flickering
            if (res.messages.length !== this.messages.length) {
                this.messages = res.messages;
                if (scroll) {
                    this.scrollToBottom();
                }
            }
        });
    }

    sendMessage(): void {
        if ((!this.newMessage.trim() && !this.selectedFile) || !this.selectedContact) return;

        this.chatService.sendMessage(this.selectedContact.id, this.newMessage, this.selectedFile || undefined).subscribe(res => {
            this.messages.push(res.message);
            this.newMessage = '';
            this.removeFile();
            this.scrollToBottom();
            this.loadContacts(); // Update last message in sidebar
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.filePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                this.filePreview = null; // No preview for PDF
            }
        }
    }

    removeFile(): void {
        this.selectedFile = null;
        this.filePreview = null;
    }

    scrollToBottom(): void {
        try {
            setTimeout(() => {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }, 100);
        } catch (err) { }
    }

    getAvatar(user: any): string | null {
        if (!user) return null;
        const avatar = user.profile?.avatar || user.avatar;
        return avatar || null;
    }

    hasAvatar(user: any): boolean {
        return !!(user?.profile?.avatar || user?.avatar);
    }

    openFile(url: string | undefined): void {
        if (url) {
            window.open(url, '_blank');
        }
    }
}
