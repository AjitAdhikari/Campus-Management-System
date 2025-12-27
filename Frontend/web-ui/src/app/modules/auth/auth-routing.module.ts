import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LogoutComponent } from './logout/logout.component';
import { NewPasswordComponent } from './new-password/new-password.component';

const routes: Routes = [
  {"path":"login", component: LoginComponent},
  {"path": "reset-password", component: ResetPasswordComponent},
  {"path": "logout", component: LogoutComponent},
  {"path": "new-password", component: NewPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
