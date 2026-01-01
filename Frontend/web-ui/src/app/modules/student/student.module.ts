import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FeesComponent } from './pages/fees/fees.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { ResultsComponent } from './pages/results/results.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { StudentRoutingModule } from './student-routing.module';


@NgModule({
  declarations: [
    DashboardComponent,
    ScheduleComponent,
    NoticeComponent,
    FeesComponent,
    AssignmentsComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
