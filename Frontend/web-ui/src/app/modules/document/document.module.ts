import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { FilterComponent } from './list/filter/filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';
import { DocumentRoutingModule } from './document-routing.module';



@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    DocumentRoutingModule,
    ReactiveFormsModule
  ]
})
export class DocumentModule { }
