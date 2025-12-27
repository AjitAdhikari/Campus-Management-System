import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterVm } from '../../member.model';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  filterModel = new FilterVm();
  filterForm!: UntypedFormGroup;
  @Output()  filterModelData = new EventEmitter<FilterVm>();
  @Input() iSearchFormDisplay : string = ""

  constructor( private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [''],
      phone_number: [''],
      gender: [''],
    });
  }

  onClear()
  {
    this.filterModel = new FilterVm();
  }

  onSubmit()
  {
    const data = this.filterForm.value;
    this.filterModel.phone_number = data.phone_number;
    this.filterModel.name = data.name;
    this.filterModel.gender = data.gender;
    this.filterModelData.emit(this.filterModel);
  }

}
