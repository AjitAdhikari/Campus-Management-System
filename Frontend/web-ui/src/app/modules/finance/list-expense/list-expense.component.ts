import { Component } from '@angular/core';
import { FinanceService } from '../finance.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FilterVm, ListFinance } from '../finance.model';
import { Helpers } from 'src/app/helpers/Helpers';

@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.css']
})
export class ListExpenseComponent {
  constructor(private _service: FinanceService, private toastr: ToastrService, private _router: Router) { }
  pageParentLink = 'Member';
  pageTitle = 'List Income Finance';
  items: any[] = [];
  errorMessage: string = '';
  isLoading: Boolean = false;
  data: ListFinance[] = [];
  filterModel = new FilterVm();
  totalAmount: number = 0;
  firstDayOfMonth: string | null = Helpers.GetFirstDayOfMonth()
  lastDayOfMonth: string | null = Helpers.GetLastDayOfMonth()

  ngOnInit(): void {
    this.loadData();
  }

  loadData(page: number = 0): void {
    this.isLoading = true;
    this.totalAmount = 0;
    this.filterModel.offset = page * this.filterModel.limit;
    this._service.listExpense(this.filterModel).subscribe({
      next: (res: any) => {
        this.data = res

        this.data.forEach((item:any) => {
            this.totalAmount += item.totalAmount
        });
        this.isLoading = false
      },
      error: (error) => {
        this.toastr.error('Something went wrong');
        console.error('Error loading inventory data', error);
        this.isLoading = false
      }
    });
  }

  updateFilter(data: any)
  {
    this.filterModel = data;
    this.firstDayOfMonth = (this.filterModel.startDate) ?  this.filterModel.startDate  : this.firstDayOfMonth
    this.lastDayOfMonth = (this.filterModel.endDate) ? this.filterModel.endDate: this.lastDayOfMonth
    this.loadData();
  }
}
