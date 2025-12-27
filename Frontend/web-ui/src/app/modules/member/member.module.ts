import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { LayoutModule } from '../layout/layout.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './list/filter/filter.component';
// import { HeaderComponent } from 'src/app/components/shared/header/header.component';
// import { SidebarComponent } from 'src/app/components/shared/sidebar/sidebar.component';
// import { BreadcrumbComponent } from 'src/app/components/shared/breadcrumb/breadcrumb.component';
// import { FooterComponent } from 'src/app/components/shared/footer/footer.component';


@NgModule({ declarations: [
        AddComponent,
        EditComponent,
        ListComponent,
        FilterComponent
    ],
    imports: [CommonModule,
        MemberRoutingModule,
        LayoutModule,
        ReactiveFormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class MemberModule { }
