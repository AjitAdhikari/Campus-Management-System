import { Component } from '@angular/core';

interface ScheduleItem {
  course: string;
  semester: number;
  day: string;
  startTime: string;
  endTime: string;
  remarks: string;
}
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {

  schedules: ScheduleItem[] = [
    {
      course: 'Database Systems',
      semester: 4,
      day: 'Friday',
      startTime: '10:00',
      endTime: '11:30',
      remarks: 'Bring laptop for lab prep'
    },
    {
      course: 'Algorithms',
      semester: 4,
      day: 'Tuesday',
      startTime: '09:30',
      endTime: '11:00',
      remarks: 'Room 310'
    },
    {
      course: 'Computer Networks',
      semester: 5,
      day: 'Thursday',
      startTime: '11:30',
      endTime: '13:00',
      remarks: 'Lab C - switch configs'
    },
  ];

  get filteredSchedules(): ScheduleItem[] {
    return this.schedules;
  }
}
