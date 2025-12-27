import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MemberModule } from './modules/member/member.module';
import { LayoutModule } from './modules/layout/layout.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppConfigInitService } from './appconfig.init';
import { JwtInterceptor } from './JwtInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { DocumentModule } from './modules/document/document.module';
import { FinanceModule } from './modules/finance/finance.module';
import { SettingModule } from './modules/setting/setting.module';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';



export function init_app(appLoadService: AppConfigInitService) {
  return () => appLoadService.init();
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    InventoryModule,
    MemberModule,
    LayoutModule,
    DashboardModule,
    DocumentModule,
    FinanceModule,
    SettingModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    AppConfigInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppConfigInitService],
      multi: true
    },
    {
      provide : HTTP_INTERCEPTORS, useClass : JwtInterceptor, multi : true
    },
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
