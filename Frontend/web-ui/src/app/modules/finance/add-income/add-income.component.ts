import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActiveMembers, AddIncome, Income } from '../finance.model';
import { FinanceService } from '../finance.service';
import { MemberService } from '../../member/member.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.css']
})
export class AddIncomeComponent {
  pageParentLink = 'Inventory';
  pageTitle = 'Add Item';
  model: AddIncome = new AddIncome;
  income: Income = new Income;
  categories: string[] = environment.IncomeCategory.split(',');
  tithes: Income[] = [];
  isLoading: boolean = false;
  members:ActiveMembers[] = [];
  constructor(
    private _router: Router,
    private toastr: ToastrService,
    private _service: FinanceService,
    private _memberService: MemberService
  ){

    for(let i = 0; i< this.categories.length; i++)
    {
      let income = new Income;
      income.category = this.categories[i];
      this.model.income.push(income);
    }
    this.addTithe();
  }

  addTithe():void
  {
    let titheIncome = new Income;
    titheIncome.category = "Tithe"
    this.tithes.push(titheIncome);
  }

  removeTithe(index:number):void
  {
    if(index > 0){
      this.tithes.splice(index, 1)
    }
  }

  ngOnInit(): void {
    this.loadActiveMembers();
  }

  loadActiveMembers(): void{
    this._memberService.listActiveMember().subscribe({
      next: (data) => {
        this.members = data.map((member: any) => {
          let activeMember = new ActiveMembers();
          activeMember.id = member.id;
          activeMember.firstname = member.firstName;
          activeMember.middlename = member.middleName;
          activeMember.lastname = member.lastName;
          return activeMember;
        });

     }, error: (err) => {
        this.toastr.error('Something went wrong');
        console.error('Error retriving member', err);
        this.isLoading = false;
      }
    })
  }

  onSubmit():void{
    for(let i = 0; i< this.tithes.length; i++)
    {
      if(this.tithes[i].amount > 0)
      {
        this.model.income.push(this.tithes[i])
      }
    }
    this.isLoading = true;

    this._service.createIncome(this.model).subscribe({
      next: (data) => {
        this.toastr.success('Income Added Successfully');
        this._router.navigate(['/finance/income']);
      },
      error: (err) => {
        this.toastr.error('Something went wrong');
        console.error('Error creating member', err);
        this.isLoading = false;
      }
    });
  }
}
