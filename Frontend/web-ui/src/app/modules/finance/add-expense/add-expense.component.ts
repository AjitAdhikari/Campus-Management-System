import { Component } from '@angular/core';
import { AddIncome, Income } from '../finance.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FinanceService } from '../finance.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent {
  pageParentLink = 'Inventory';
  pageTitle = 'Add Item';
  model: AddIncome = new AddIncome;
  income: Income = new Income;
  categories: string[] = environment.ExpenseCategory.split(',');
  tithes: Income[] = [];
  isLoading: boolean = false;

  constructor(
    private _router: Router,
    private toastr: ToastrService,
    private _service: FinanceService
  ){
    for(let i = 0; i< this.categories.length; i++)
    {
      let income = new Income;
      income.category = this.categories[i];
      this.model.income.push(income);
    }
  }



  ngOnInit(): void {
    // this.incomeForm = this.fb.group
  }

  onSubmit():void{
    for(let i = 0; i< this.tithes.length; i++)
    {
      this.model.income.push(this.tithes[i])
    }
    this.isLoading = true;

    this._service.createExpense(this.model).subscribe({
      next: (data) => {
        this.toastr.success('Expense Added Successfully');
        this._router.navigate(['/finance/expense']);
      },
      error: (err) => {
        this.toastr.error('Something went wrong');
        console.error('Error creating data', err);
        this.isLoading = false;
      }
    });
  }
}
