import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  allCourses: Course[] = [];
  faculties: User[] = [];
  facultyCourses: Course[] = [];
  minDate: string = '';

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private courseService: CourseService,
    private userService: UserService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.setMinDate();
    this.loadSchedules();
    this.loadCourses();
    this.loadFaculties();
  }

  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  initializeForms(): void {
    this.scheduleForm = this.fb.group({
      course_id: ['', Validators.required],
      faculty_id: ['', Validators.required],
      class_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      isActive: [true]
    }, { validators: [this.timeRangeValidator(), this.dateValidator(), this.dateTimeValidator()] });

    this.editForm = this.fb.group({
      course_id: [{ value: '', disabled: true }, Validators.required],
      faculty_id: ['', Validators.required],
      class_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      isActive: [true]
    }, { validators: [this.timeRangeValidator(), this.dateValidator(), this.dateTimeValidator()] });
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
        this.allCourses = data;
      },
      error: (error) => {
        // handle error
      }
    });
  }

  loadFaculties(): void {
    this.userService.list().subscribe({
      next: (data: User[]) => {
        this.faculties = data.filter((user: User) =>
          user.roles.includes('Faculty') || user.roles.includes('faculty')
        );
      },
      error: (error: any) => {
        // handle error
      }
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.scheduleForm.reset({ isActive: true });
    this.courses = this.allCourses;
    this.setupFacultyChangeListener();
  }

  setupFacultyChangeListener(): void {
    this.scheduleForm.get('faculty_id')?.valueChanges.subscribe((facultyId) => {
      if (facultyId) {
        this.courseService.getFacultyCourses(facultyId).subscribe({
          next: (courses: Course[]) => {
            this.courses = courses.length > 0 ? courses : this.allCourses;
            if (courses.length === 1) {
              this.scheduleForm.patchValue({ course_id: courses[0].id });
            } else {
              this.scheduleForm.patchValue({ course_id: '' });
            }
          },
          error: () => {
            this.courses = this.allCourses;
            this.scheduleForm.patchValue({ course_id: '' });
          }
        });
      } else {
        this.courses = this.allCourses;
        this.scheduleForm.patchValue({ course_id: '' });
      }
    });
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.scheduleForm.reset();
    this.courses = this.allCourses;
  }

  openEditModal(schedule: ClassSchedule): void {
    this.selectedSchedule = schedule;
    this.showEditModal = true;
    this.editForm.patchValue({
      course_id: schedule.course_id,
      faculty_id: schedule.faculty_id,
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
      if (this.scheduleForm.errors?.['invalidTimeRange']) {
        this.errorMessage = 'End time must be after start time.';
      } else if (this.scheduleForm.errors?.['pastDate']) {
        this.errorMessage = 'Class date cannot be in the past.';
      } else if (this.scheduleForm.errors?.['pastDateTime']) {
        this.errorMessage = 'Cannot schedule for a time that has already passed.';
      } else {
        this.errorMessage = 'Please fill all required fields';
      }
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
        let errorMsg = 'Failed to create schedule. Please try again.';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.error?.errors?.faculty_id) {
          errorMsg = error.error.errors.faculty_id[0];
        } else if (error.error?.errors?.start_time) {
          errorMsg = error.error.errors.start_time[0];
        } else if (error.message) {
          errorMsg = error.message;
        }
        this.errorMessage = errorMsg;
      }
    });
  }

  updateSchedule(): void {
    if (this.editForm.invalid || !this.selectedSchedule) {
      if (this.editForm.errors?.['invalidTimeRange']) {
        this.errorMessage = 'End time must be after start time.';
      } else if (this.editForm.errors?.['pastDate']) {
        this.errorMessage = 'Class date cannot be in the past.';
      } else if (this.editForm.errors?.['pastDateTime']) {
        this.errorMessage = 'Cannot schedule for a time that has already passed.';
      } else {
        this.errorMessage = 'Please fill all required fields';
      }
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
        let errorMsg = 'Failed to update schedule. Please try again.';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.error?.errors?.faculty_id) {
          errorMsg = error.error.errors.faculty_id[0];
        } else if (error.error?.errors?.start_time) {
          errorMsg = error.error.errors.start_time[0];
        }
        this.errorMessage = errorMsg;
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
          this.errorMessage = 'Failed to delete schedule. Please try again.';
        }
      });
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Custom validator to ensure end_time is after start_time
  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startTime = control.get('start_time')?.value;
      const endTime = control.get('end_time')?.value;

      if (!startTime || !endTime) {
        return null; // Don't validate if either field is empty
      }

      // Convert time strings to comparable format (HH:MM)
      const start = this.timeToMinutes(startTime);
      const end = this.timeToMinutes(endTime);

      if (end <= start) {
        return { invalidTimeRange: true };
      }

      return null;
    };
  }

  // Helper function to convert time string to minutes for comparison
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Custom validator to ensure class_date is not in the past
  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const classDate = control.get('class_date')?.value;

      if (!classDate) {
        return null; // Don't validate if field is empty
      }

      const selectedDate = new Date(classDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

      if (selectedDate < today) {
        return { pastDate: true };
      }

      return null;
    };
  }

  // Custom validator to ensure the combined date and time is in the future
  dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const classDate = control.get('class_date')?.value;
      const startTime = control.get('start_time')?.value;

      if (!classDate || !startTime) {
        return null; // Don't validate if either field is empty
      }

      // Combine date and time
      const [hours, minutes] = startTime.split(':').map(Number);
      const scheduleDateTime = new Date(classDate);
      scheduleDateTime.setHours(hours, minutes, 0, 0);

      const now = new Date();

      if (scheduleDateTime <= now) {
        return { pastDateTime: true };
      }

      return null;
    };
  }
}