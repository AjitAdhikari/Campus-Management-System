import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../helpers/AuthGuard';

import { PageSettingComponent } from '../setting/page-setting/page-setting.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GradesComponent } from './pages/grades/grades.component';
import { NoticesComponent } from './pages/notices/notices.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    data: { roles: ['faculty'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'assignments', component: AssignmentsComponent },
      { path: 'grades', component: GradesComponent },
      { path: 'notices', component: NoticesComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'setting', component: PageSettingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyRoutingModule { }
