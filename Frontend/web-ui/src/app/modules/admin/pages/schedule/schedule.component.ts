import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface ClassSchedule {
  id: number;
  course_id: number;
  courseName?: string;
  faculty_id?: number;
  facultyName?: string;
  class_date: string; 
  start_time: string; 
  end_time: string; 
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];

  private readonly storageKey = 'app_class_schedules';
  
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
  
  // simplified form: admin picks course, faculty, class date, start/end and active state

  // Mock data for dropdowns (replace with actual API calls)
  courses = [
    { id: 101, name: 'Advanced Data Structures' },
  ];

  faculties = [
    { id: 1, name: 'Ajeet Adhikari' },
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSchedules();
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

    try {
      const cached = localStorage.getItem(this.storageKey);
      if (cached) {
        this.schedules = this.sanitizeSchedules(JSON.parse(cached));
      } else {
        this.schedules = this.sanitizeSchedules(this.getSeedSchedules());
        this.persistSchedules();
      }
    } catch (error) {
      console.error('Failed to load schedules from storage', error);
      this.schedules = this.sanitizeSchedules(this.getSeedSchedules());
    } finally {
      this.isLoading = false;
    }
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
      courseName: schedule.courseName,
      faculty_id: schedule.faculty_id,
      facultyName: schedule.facultyName,
      class_date: schedule.class_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      isActive: schedule.status === 'active'
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
    const course = this.courses.find(c => c.id == formData.course_id);
    const faculty = this.faculties.find(f => f.id == formData.faculty_id);

    const nextId = this.schedules.length > 0 ? Math.max(...this.schedules.map(s => s.id)) + 1 : 1;

    const newSchedule: ClassSchedule = {
      id: nextId,
      course_id: Number(formData.course_id),
      courseName: course?.name || '',
      faculty_id: Number(formData.faculty_id),
      facultyName: faculty?.name || '',
      class_date: formData.class_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.isActive ? 'active' : 'inactive',
    };

    this.schedules.push(newSchedule);
    this.persistSchedules();
    this.successMessage = 'Schedule created successfully!';
    this.closeAddModal();
    setTimeout(() => this.clearMessages(), 3000);
  }

  updateSchedule(): void {
    if (this.editForm.invalid || !this.selectedSchedule) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const formData = this.editForm.getRawValue();
    const faculty = this.faculties.find(f => f.id == formData.faculty_id);

    if (this.selectedSchedule.id) {
      const index = this.schedules.findIndex(s => s.id === this.selectedSchedule!.id);
        if (index !== -1) {
          this.schedules[index] = {
            ...this.schedules[index],
            faculty_id: Number(formData.faculty_id),
            facultyName: faculty?.name || this.schedules[index].facultyName,
            class_date: formData.class_date,
            start_time: formData.start_time,
            end_time: formData.end_time,
            status: formData.isActive ? 'active' : 'inactive',
          };
          this.persistSchedules();
        this.successMessage = 'Schedule updated successfully!';
        this.closeEditModal();
        setTimeout(() => this.clearMessages(), 3000);
      }
    }
  }

  deleteSchedule(schedule: ClassSchedule): void {
    if (confirm(`Are you sure you want to delete the schedule for "${schedule.courseName}"?`)) {
      const index = this.schedules.findIndex(s => s.id === schedule.id);
      if (index !== -1) {
        this.schedules.splice(index, 1);
        this.persistSchedules();
        this.successMessage = 'Schedule deleted successfully!';
        setTimeout(() => this.clearMessages(), 3000);
      }
    }
  }
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private persistSchedules(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.schedules));
    } catch (error) {
      console.error('Failed to persist schedules to storage', error);
    }
  }

  private getSeedSchedules(): ClassSchedule[] {
    return [
      {
        id: 1,
        course_id: 101,
        courseName: 'Advanced Data Structures',
        faculty_id: 1,
        facultyName: 'Ajeet Adhikari',
        class_date: '2025-12-01',
        start_time: '09:00',
        end_time: '10:30',
        status: 'active'
      },
    ];
  }

  private sanitizeSchedules(raw: any[]): ClassSchedule[] {
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.map((item, index) => {
      const id = typeof item.id === 'number' ? item.id : index + 1;
      // support both legacy keys and new DB-style keys
      const course_id = Number(item.course_id ?? item.courseId) || 0;
      const rawFaculty = item.faculty_id ?? item.facultyId;
      const faculty_id = rawFaculty !== undefined && rawFaculty !== null ? Number(rawFaculty) : undefined;
      const class_date = item.class_date ?? item.dayOfWeek ?? item.classDate ?? '';
      const start_time = item.start_time ?? item.startTime ?? '';
      const end_time = item.end_time ?? item.endTime ?? '';
      const status = item.status ?? (item.isActive ? 'active' : (item.scheduleType ? 'active' : 'inactive'));

      return {
        id,
        course_id,
        courseName: item.courseName || item.course_name || '',
        faculty_id: faculty_id,
        facultyName: item.facultyName || item.faculty_name || '',
        class_date: class_date || new Date().toISOString().split('T')[0],
        start_time,
        end_time,
        status: status === 'active' ? 'active' : 'inactive'
      };
    });
  }
}

