import { Component, EventEmitter, Output } from '@angular/core';
import { FilterVm } from '../../finance.model';

@Component({
  selector: 'expense-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})
export class ExpenseFilterModalComponent {
  filterModel = new FilterVm();
  @Output()  filterModelData = new EventEmitter<FilterVm>();

  onSubmit()
  {
    this.filterModelData.emit(this.filterModel);
  }

}
