import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from 'src/app/components/shared/breadcrumb/breadcrumb.component';
import { LoaderComponent } from 'src/app/components/shared/loader/loader.component';
import { FooterComponent } from 'src/app/modules/admin/components/footer/footer.component';
import { FacultySidebarComponent } from 'src/app/modules/faculty/components/faculty-sidebar/faculty-sidebar.component';



@NgModule({
  declarations: [
    FooterComponent,
    BreadcrumbComponent,
    LoaderComponent,
    FacultySidebarComponent,

  ],
  exports: [
    FooterComponent,
    BreadcrumbComponent,
    LoaderComponent,
    FacultySidebarComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,

  ]
})
export class LayoutModule { }
