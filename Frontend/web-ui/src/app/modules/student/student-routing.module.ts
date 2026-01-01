import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../helpers/AuthGuard';

import { PageSettingComponent } from '../setting/page-setting/page-setting.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FeesComponent } from './pages/fees/fees.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { ResultsComponent } from './pages/results/results.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    data: { roles: ['student'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'schedules', component: ScheduleComponent },
      { path: 'assignments', component: AssignmentsComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'notices', component: NoticeComponent },
      { path: 'fees', component: FeesComponent },
      { path: 'setting', component: PageSettingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }