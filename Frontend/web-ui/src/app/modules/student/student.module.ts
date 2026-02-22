import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FeesComponent } from './pages/fees/fees.component';
import { GpaCalculatorComponent } from './pages/gpa-calculator/gpa-calculator.component';
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
    ResultsComponent,
    GpaCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StudentRoutingModule,
    SharedModule
  ]
})
export class StudentModule { }
