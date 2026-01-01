import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FacultyRoutingModule } from './faculty-routing.module';

import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GradesComponent } from './pages/grades/grades.component';
import { NoticesComponent } from './pages/notices/notices.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AssignmentsComponent,
    GradesComponent,
    NoticesComponent,
    ScheduleComponent,
    AttendanceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FacultyRoutingModule
  ],
  exports: []
})
export class FacultyModule { }
