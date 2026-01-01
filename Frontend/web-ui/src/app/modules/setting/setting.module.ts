import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './page-setting/account/account.component';
import { PageSettingComponent } from './page-setting/page-setting.component';
import { PasswordComponent } from './page-setting/password/password.component';
import { SettingRoutingModule } from './setting-routing.module';


@NgModule({
  declarations: [
    PageSettingComponent,
    AccountComponent,
    PasswordComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingModule { }
