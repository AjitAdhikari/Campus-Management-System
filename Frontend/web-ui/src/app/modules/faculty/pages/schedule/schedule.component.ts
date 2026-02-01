import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassSchedule, ScheduleService, UpdateScheduleRequest } from '../../../../services/schedule.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];
  currentUserId: string | number | null = null;
  
  // Form controls
  editForm!: FormGroup;
  
  // UI States
  isLoading = false;
  showEditModal = false;
  selectedSchedule: ClassSchedule | null = null;
  successMessage = '';
  errorMessage = '';
  
  scheduleTypes = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rescheduled', label: 'Rescheduled' },
    // { value: 'lab', label: 'Lab' }
  ];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private userService: UserService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.currentUserId = this.userService.current?.id || null;
    this.loadSchedules();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      course_id: [{ value: '', disabled: true }, Validators.required],
      courseName: [{ value: '', disabled: true }],
      faculty_id: [{ value: '', disabled: true }, Validators.required],
      class_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      status: ['scheduled', Validators.required]
    });
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.clearMessages();
    
    this.scheduleService.getSchedules().subscribe({
      next: (data: ClassSchedule[]) => {
        // Filter to show only schedules assigned to this faculty
        if (this.currentUserId) {
          // Handle both string and number comparison for faculty_id
          this.schedules = data.filter(s => {
            const schedFacultyId = String(s.faculty_id);
            const currentId = String(this.currentUserId);
            return schedFacultyId === currentId;
          });
          console.log('Current User ID:', this.currentUserId);
          console.log('Filtered schedules for faculty:', this.schedules);
        } else {
          this.schedules = data;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Failed to load schedules', error);
        this.errorMessage = 'Failed to load schedules. Please try again.';
        this.schedules = [];
        this.isLoading = false;
      }
    });
  }

  openEditModal(schedule: ClassSchedule): void {
    this.selectedSchedule = JSON.parse(JSON.stringify(schedule));
    this.showEditModal = true;
    
    this.editForm.patchValue({
      id: schedule.id,
      course_id: schedule.course_id,
      courseName: schedule.course?.course_name || '',
      faculty_id: schedule.faculty_id,
      class_date: schedule.class_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      status: schedule.status
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

    const formData = this.editForm.getRawValue();
    const updateData: UpdateScheduleRequest = {
      faculty_id: formData.faculty_id,
      class_date: formData.class_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.status
    };

    this.scheduleService.updateSchedule(this.selectedSchedule.id, updateData).subscribe({
      next: (response: any) => {
        this.successMessage = 'Schedule updated successfully!';
        this.closeEditModal();
        this.loadSchedules();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (error: any) => {
        console.error('Failed to update schedule', error);
        this.errorMessage = 'Failed to update schedule. Please try again.';
      }
    });
  }

  getScheduleTypeLabel(type: string): string {
    const scheduleType = this.scheduleTypes.find((st: any) => st.value === type);
    return scheduleType ? scheduleType.label : type;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getScheduleDisplay(schedule: ClassSchedule): string {
    const courseName = schedule.course?.course_name || 'Unknown Course';
    return `${courseName} - ${schedule.class_date} ${schedule.start_time}-${schedule.end_time}`;
  }
}
