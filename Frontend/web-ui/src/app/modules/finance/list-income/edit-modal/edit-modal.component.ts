import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent {
  editDate : any = "";
  validateEditLink(editDate : string)
  {
    if(editDate == "")
    {
      alert("Edit Date is not selected");
      return false;
    }

    window.location.href = `/finance/income/edit/${editDate}`;
    return true;
  }

}
