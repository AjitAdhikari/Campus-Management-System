import { Component, EventEmitter, Output } from '@angular/core';
import { FilterVm } from '../../finance.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  filterModel = new FilterVm();
  @Output()  filterModelData = new EventEmitter<FilterVm>();

  onSubmit()
  {
    this.filterModelData.emit(this.filterModel);
  }

}
