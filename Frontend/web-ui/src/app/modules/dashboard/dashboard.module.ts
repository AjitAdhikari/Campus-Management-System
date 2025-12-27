import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { LayoutModule } from '../layout/layout.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BaseChartDirective  } from 'ng2-charts';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LayoutModule,
    BaseChartDirective
  ]
})
export class DashboardModule { }
