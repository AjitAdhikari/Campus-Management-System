import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActiveMembers, AddIncome, Income } from '../finance.model';
import { FinanceService } from '../finance.service';
import { MemberService } from '../../member/member.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-income',
  templateUrl: './edit-income.component.html',
  styleUrls: ['./edit-income.component.css']
})
export class EditIncomeComponent {
  pageParentLink = 'Inventory';
  pageTitle = 'Add Item';
  model: AddIncome = new AddIncome;
  income: Income = new Income;
  categories: string[] = environment.IncomeCategory.split(',');
  tithes: Income[] = [];
  isButtonLoading : boolean = false;
  members:ActiveMembers[] = [];
  totalAmount: number= 0;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
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
    const date = this.route.snapshot.paramMap.get('id');
    this.loadActiveMembers();
    this._service.getIncome(date).subscribe((data: any) => {
      // this.model.income = data;
      this.model.income = data.filter((x : Income) => x.category != "Tithe")
      this.tithes = data.filter( (x: Income) => x.category == "Tithe");
      this.model.date = this.model.income[0].incomeDate;
      data.forEach((element : Income) => {
          this.totalAmount += element.amount
      });
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
    this._service.updateIncome(this.model).subscribe({
      next: () => {
        this.toastr.success('Data Updated Successfully');
        this.router.navigate(['/finance/income']);
      },
      error: (error) => {
        this.toastr.error('Something went wrong');
        console.error('Error updating data', error);
        this.isButtonLoading = false;
      }
    });
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

        console.log(this.members);
      }, error: (err) => {
        this.toastr.error('Something went wrong');
        console.error('Error retriving member', err);
        this.isButtonLoading = false;
      }
    })
  }
}
