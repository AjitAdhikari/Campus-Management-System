import { Component, OnInit } from '@angular/core';
import { ClassSchedule, ScheduleService } from '../../../../services/schedule.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];
  isLoading = false;
  errorMessage = '';
  currentUserSemester: number | null = null;
  currentUserDepartment: string | null = null;

  constructor(
    private scheduleService: ScheduleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get current student's semester and department
    const currentUser = this.userService.current;
    if (currentUser) {
      this.currentUserSemester = currentUser.semesters ? parseInt(currentUser.semesters) : null;
      this.currentUserDepartment = currentUser.subjects || null; // Assuming subjects field might contain department info
      console.log('Student Semester:', this.currentUserSemester);
      console.log('Student Department:', this.currentUserDepartment);
    }
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.scheduleService.getSchedules().subscribe({
      next: (data: ClassSchedule[]) => {
        // Filter by status first (only scheduled classes)
        let filtered = data.filter(s => s.status === 'scheduled');
        
        // Filter by student's semester - only show courses from their semester
        if (this.currentUserSemester !== null) {
          filtered = filtered.filter(s => {
            const courseSemester = s.course?.semester;
            // Only show schedules where course semester matches student's semester
            return courseSemester !== undefined && courseSemester === this.currentUserSemester;
          });
          console.log(`Student Semester: ${this.currentUserSemester}`);
          console.log(`Schedules for semester ${this.currentUserSemester}:`, filtered.length);
        }
        
        this.schedules = filtered;
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

  get filteredSchedules(): ClassSchedule[] {
    return this.schedules;
  }
}
