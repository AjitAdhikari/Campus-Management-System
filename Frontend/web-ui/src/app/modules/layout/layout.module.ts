import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/shared/header/header.component';
import { FooterComponent } from 'src/app/components/shared/footer/footer.component';
import { BreadcrumbComponent } from 'src/app/components/shared/breadcrumb/breadcrumb.component';
import { SidebarComponent } from 'src/app/components/shared/sidebar/sidebar.component';
import { LoaderComponent } from 'src/app/components/shared/loader/loader.component';
import { BaseChartDirective } from 'ng2-charts';
import { LineChartComponent } from 'src/app/components/charts/line-chart/line-chart.component';
import { PieChartComponent } from 'src/app/components/charts/pie-chart/pie-chart.component';
import { BarChartComponent } from 'src/app/components/charts/bar-chart/bar-chart.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    SidebarComponent,
    LoaderComponent,
    LineChartComponent,
    PieChartComponent,
    BarChartComponent
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    SidebarComponent,
    LoaderComponent,
    LineChartComponent,
    PieChartComponent,
    BarChartComponent
  ],
  imports: [
    CommonModule,
    BaseChartDirective
  ]
})
export class LayoutModule { }
