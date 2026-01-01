import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interface for class schedule
export interface ClassSchedule {
  id: number;
  courseId: number;
  courseName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  scheduleType: 'regular' | 'one-time' | 'lab' | 'tutorial';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];
  
  // Form controls
  editForm!: FormGroup;
  
  // UI States
  isLoading = false;
  showEditModal = false;
  selectedSchedule: ClassSchedule | null = null;
  successMessage = '';
  errorMessage = '';
  
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  scheduleTypes = [
    { value: 'regular', label: 'Regular Class' },
    { value: 'lab', label: 'Lab Session' },
    { value: 'tutorial', label: 'Tutorial' }
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSchedules();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      courseId: [{ value: '', disabled: true }, Validators.required],
      courseName: [{ value: '', disabled: true }, Validators.required],
      dayOfWeek: [{ value: '', disabled: true }, Validators.required],
      startTime: [{ value: '', disabled: true }, Validators.required],
      endTime: [{ value: '', disabled: true }, Validators.required],
      scheduleType: ['regular', Validators.required],
      isActive: [true]
    });
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.clearMessages();
    
    // Replace with actual API call
    this.schedules = [
      {
        id: 1,
        courseId: 101,
        courseName: 'Advanced Data Structures',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 101',
        scheduleType: 'regular',
        isActive: true,
        createdAt: '2025-12-01',
        updatedAt: '2025-12-20'
      },
      {
        id: 2,
        courseId: 102,
        courseName: 'Web Development',
        dayOfWeek: 'Wednesday',
        startTime: '11:00',
        endTime: '12:30',
        room: 'Room 205',
        scheduleType: 'regular',
        isActive: true,
        createdAt: '2025-12-01',
        updatedAt: '2025-12-20'
      },
      {
        id: 3,
        courseId: 103,
        courseName: 'Database Management',
        dayOfWeek: 'Friday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'Lab 01',
        scheduleType: 'lab',
        isActive: true,
        createdAt: '2025-12-01',
        updatedAt: '2025-12-20'
      }
    ];
    
    this.isLoading = false;
  }

  openEditModal(schedule: ClassSchedule): void {
    this.selectedSchedule = JSON.parse(JSON.stringify(schedule)); // Deep copy
    this.showEditModal = true;
    
    this.editForm.patchValue({
      courseId: schedule.courseId,
      courseName: schedule.courseName,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      scheduleType: schedule.scheduleType,
      isActive: schedule.isActive
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedSchedule = null;
    this.editForm.reset();
  }

  updateSchedule(): void {
    if (this.editForm.invalid || !this.selectedSchedule) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const updatedData = {
      scheduleType: this.editForm.get('scheduleType')?.value,
      isActive: this.editForm.get('isActive')?.value
    };

    if (this.selectedSchedule.id) {
      const index = this.schedules.findIndex(s => s.id === this.selectedSchedule!.id);
      if (index !== -1) {
        this.schedules[index] = {
          ...this.schedules[index],
          ...updatedData,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        this.successMessage = 'Schedule updated successfully!';
        this.closeEditModal();
        setTimeout(() => this.clearMessages(), 3000);
      }
    }
  }

  getScheduleTypeLabel(type: string): string {
    const scheduleType = this.scheduleTypes.find(st => st.value === type);
    return scheduleType ? scheduleType.label : type;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getScheduleDisplay(schedule: ClassSchedule): string {
    return `${schedule.courseName} - ${schedule.dayOfWeek} ${schedule.startTime}-${schedule.endTime}`;
  }
}
