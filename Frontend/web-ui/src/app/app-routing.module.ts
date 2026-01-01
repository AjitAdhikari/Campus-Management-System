import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/AuthGuard';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'student', loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule), canLoad: [AuthGuard], data: { roles: ['student'] } },
  { path: 'faculty', loadChildren: () => import('./modules/faculty/faculty.module').then(m => m.FacultyModule), canLoad: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule), canLoad: [AuthGuard], data: { roles: ['admin'] } },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
