import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-faculty-sidebar',
  templateUrl: './faculty-sidebar.component.html',
  styleUrls: ['./faculty-sidebar.component.css']
})
export class FacultySidebarComponent {
  unreadCount$ = this.chatService.unreadCount$;

  constructor(private chatService: ChatService) { }
}
