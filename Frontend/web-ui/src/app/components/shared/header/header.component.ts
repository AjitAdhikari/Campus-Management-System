import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string = "User";
  time: string = '';
  date: string = '';
  private timerId: any;
  constructor() { }

  ngOnInit(): void {
    this.updateTime();
    this.timerId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  private updateTime(): void {
    const now = new Date();
    this.time = now.toLocaleTimeString();
    this.date = now.toLocaleDateString();
  }

  logOut(){
      localStorage.clear();
      window.location.replace("/");
  }

}
