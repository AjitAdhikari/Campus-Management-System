import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ListIncomeComponent } from './list-income/list-income.component';
import { AddIncomeComponent } from './add-income/add-income.component';
import { EditIncomeComponent } from './edit-income/edit-income.component';
import { ListExpenseComponent } from './list-expense/list-expense.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';

const routes: Routes = [{
  "path" : "finance",
  "children" :
  [
      {"path" : "income" , component:ListIncomeComponent},
      {"path" : "income/add" , component:AddIncomeComponent},
      {"path" : "income/edit/:id" , component:EditIncomeComponent},
      {"path" : "expense" , component:ListExpenseComponent},
      {"path" : "expense/add" , component:AddExpenseComponent},
      {"path" : "expense/edit/:id" , component:EditExpenseComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
