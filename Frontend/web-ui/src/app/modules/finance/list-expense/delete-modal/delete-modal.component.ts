import { Component } from '@angular/core';
import { FinanceService } from '../../finance.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'expense-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class ExpenseDeleteModalComponent {
  deleteDate: any = "";
  constructor(private _service: FinanceService, private toastr: ToastrService, private router: Router ){}

  deleteData(date: string)
  {
    if(date == "")
      {
        alert("Date is not selected");
        return false;
      }
    let res = confirm("Do you really want to delete this date expense data?");
    if(res){
      this._service.deleteExpense(date).subscribe(() => {
        this.reloadCurrentRoute();
       this.toastr.success(`${date} Data deleted successfully`);
       return true;
      });
    }
    return true;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
}
}
