import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddIncomeComponent } from './add-income/add-income.component';
import { EditIncomeComponent } from './edit-income/edit-income.component';
import { ListIncomeComponent } from './list-income/list-income.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { ListExpenseComponent } from './list-expense/list-expense.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './list-income/filter/filter.component';
import { EditModalComponent } from './list-income/edit-modal/edit-modal.component';
import { DeleteModalComponent } from './list-income/delete-modal/delete-modal.component';
import { ExpenseEditModalComponent } from './list-expense/edit-modal/edit-modal.component';
import {ExpenseFilterModalComponent } from './list-expense/filter-modal/filter-modal.component';
import {ExpenseDeleteModalComponent} from './list-expense/delete-modal/delete-modal.component';


@NgModule({
  declarations: [
    AddIncomeComponent,
    EditIncomeComponent,
    ListIncomeComponent,
    AddExpenseComponent,
    EditExpenseComponent,
    ListExpenseComponent,
    FilterComponent,
    EditModalComponent,
    DeleteModalComponent,
    ExpenseEditModalComponent,
    ExpenseFilterModalComponent,
    ExpenseDeleteModalComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    LayoutModule,
    FormsModule
  ]
})
export class FinanceModule { }
