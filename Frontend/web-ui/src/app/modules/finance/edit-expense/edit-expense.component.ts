import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddExpense, AddIncome, Expense, Income } from '../finance.model';
import { FinanceService } from '../finance.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.css']
})
export class EditExpenseComponent {
  pageParentLink = 'Inventory';
  pageTitle = 'Add Item';
  model: AddExpense = new AddExpense;
  expense: Expense = new Expense;
  categories: string[] = environment.ExpenseCategory.split(',');
  tithes: Income[] = [];
  totalAmount: number= 0;

  constructor(
    private _router: Router,
    private toastr: ToastrService,
    private _service: FinanceService,
    private route: ActivatedRoute
  ){
    for(let i = 0; i< this.categories.length; i++)
    {
      let expense = new Expense;
      expense.category = this.categories[i];
      this.model.expense.push(expense);
    }
  }
  ngOnInit(): void {
    const date = this.route.snapshot.paramMap.get('id');
    this._service.getExpense(date).subscribe((data: any) => {
      // this.model.income = data;
      this.model.expense = data
      this.model.date = this.model.expense[0].expenseDate;
      data.forEach((element : Expense) => {
        this.totalAmount += element.amount
    });
    })
  }

  onSubmit():void{
    this._service.updateExpense(this.model).subscribe({
      next: () => {
        this.toastr.success('Data Updated Successfully');
        this._router.navigate(['/finance/expense']);
      },
      error: (error) => {
        this.toastr.error('Something went wrong');
        console.error('Error updating data', error);
        // this.isButtonLoading = false;
      }
    });
  }


}
