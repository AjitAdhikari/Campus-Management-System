import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { LayoutModule } from '../layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './list/filter/filter.component';


@NgModule({
  declarations: [
    AddComponent,
    EditComponent,
    ListComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    LayoutModule,
    ReactiveFormsModule
  ]
})
export class InventoryModule { }
