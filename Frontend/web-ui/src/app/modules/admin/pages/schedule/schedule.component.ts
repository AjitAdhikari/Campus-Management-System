import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course, CourseService } from '../../../../services/course.service';
import { ClassSchedule, CreateScheduleRequest, ScheduleService, UpdateScheduleRequest } from '../../../../services/schedule.service';
import { User, UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];
  
  // Form controls
  scheduleForm!: FormGroup;
  editForm!: FormGroup;
  
  // UI States
  isLoading = false;
  showAddModal = false;
  showEditModal = false;
  selectedSchedule: ClassSchedule | null = null;
  successMessage = '';
  errorMessage = '';
  
  // Data for dropdowns
  courses: Course[] = [];
  faculties: User[] = [];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private courseService: CourseService,
    private userService: UserService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSchedules();
    this.loadCourses();
    this.loadFaculties();
  }

  initializeForms(): void {
    this.scheduleForm = this.fb.group({
      course_id: ['', Validators.required],
      faculty_id: ['', Validators.required],
      class_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      isActive: [true]
    });

    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      course_id: [{ value: '', disabled: true }, Validators.required],
      courseName: [{ value: '', disabled: true }],
      faculty_id: ['', Validators.required],
      facultyName: [{ value: '', disabled: true }],
      class_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      isActive: [true]
    });
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.clearMessages();

    this.scheduleService.getSchedules().subscribe({
      next: (data) => {
        this.schedules = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load schedules', error);
        this.errorMessage = 'Failed to load schedules. Please try again.';
        this.schedules = [];
        this.isLoading = false;
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Failed to load courses', error);
      }
    });
  }

  loadFaculties(): void {
    this.userService.list().subscribe({
      next: (data: User[]) => {
        // Filter only faculty users
        this.faculties = data.filter((user: User) => 
          user.roles.includes('Faculty') || user.roles.includes('faculty')
        );
      },
      error: (error: any) => {
        console.error('Failed to load faculties', error);
      }
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.scheduleForm.reset({ isActive: true });
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.scheduleForm.reset();
  }

  openEditModal(schedule: ClassSchedule): void {
    this.selectedSchedule = JSON.parse(JSON.stringify(schedule)); // Deep copy
    this.showEditModal = true;
    
    this.editForm.patchValue({
      id: schedule.id,
      course_id: schedule.course_id,
      courseName: schedule.course?.course_name || '',
      faculty_id: schedule.faculty_id,
      facultyName: schedule.faculty?.name || '',
      class_date: schedule.class_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      isActive: schedule.status === 'scheduled'
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedSchedule = null;
    this.editForm.reset();
  }

  createSchedule(): void {
    if (this.scheduleForm.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const formData = this.scheduleForm.value;
    const scheduleData: CreateScheduleRequest = {
      course_id: Number(formData.course_id),
      faculty_id: formData.faculty_id,
      class_date: formData.class_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.isActive ? 'scheduled' : 'cancelled'
    };

    this.scheduleService.createSchedule(scheduleData).subscribe({
      next: (response) => {
        this.successMessage = 'Schedule created successfully!';
        this.closeAddModal();
        this.loadSchedules();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (error) => {
        console.error('Failed to create schedule', error);
        let errorMsg = 'Failed to create schedule. Please try again.';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        this.errorMessage = errorMsg;
      }
    });
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
      status: formData.isActive ? 'scheduled' : 'cancelled'
    };

    this.scheduleService.updateSchedule(this.selectedSchedule.id, updateData).subscribe({
      next: (response) => {
        this.successMessage = 'Schedule updated successfully!';
        this.closeEditModal();
        this.loadSchedules();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (error) => {
        console.error('Failed to update schedule', error);
        this.errorMessage = 'Failed to update schedule. Please try again.';
      }
    });
  }

  deleteSchedule(schedule: ClassSchedule): void {
    const courseName = schedule.course?.course_name || 'this schedule';
    if (confirm(`Are you sure you want to delete the schedule for "${courseName}"?`)) {
      this.scheduleService.deleteSchedule(schedule.id).subscribe({
        next: () => {
          this.successMessage = 'Schedule deleted successfully!';
          this.loadSchedules();
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (error) => {
          console.error('Failed to delete schedule', error);
          this.errorMessage = 'Failed to delete schedule. Please try again.';
        }
      });
    }
  }
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}

