import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterVm } from '../../inventory.model';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  filterModel = new FilterVm();
  filterForm!: UntypedFormGroup;
  @Output()  filterModelData = new EventEmitter<FilterVm>();
  @Input() iSearchFormDisplay : string = ""

  constructor( private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [''],
      code: [''],
    });
  }

  onClear()
  {
    this.filterModel = new FilterVm();
  }

  onSubmit()
  {
    const data = this.filterForm.value;
    this.filterModel.code = data.code;
    this.filterModel.name = data.name;
    this.filterModelData.emit(this.filterModel);
  }


}
