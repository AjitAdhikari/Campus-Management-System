import { Component, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { FilterVm, ListMember } from '../member.model';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private _service: MemberService, private toastr: ToastrService) { }
  pageParentLink = 'Member';
  pageTitle = 'List Member';
  items: any[] = [];
  errorMessage: string = '';
  imageUrl : string | null  = '';
  isLoading: Boolean = false;
  members: ListMember[] = [];
  currentPage: number = 1;
  filterModel = new FilterVm();
  totalData: number = 0;
  SearchFormDisplay = "";

  ngOnInit(): void {
    this.loadData();
  }

  loadData(page: number = 0): void {
    this.isLoading = true;
    this.filterModel.offset = page * this.filterModel.limit;
    this._service.list(this.filterModel).subscribe({
      next: (res: any) => {
        this.members = res.items;
        this.members.forEach((item)=> {
          item.photo = environment.MediaUploadUrl + item.photo;
        })
        this.totalData = res.totalDataCount;
        this.isLoading = false
      },
      error: (error) => {
        this.toastr.error('Something went wrong');
        console.error('Error loading inventory data', error);
        this.isLoading = false
      }
    });
  }

  deleteMember(id: number, index: number): void {
    let res = confirm("Do you really want to delete this member?");
    if(res){
      this._service.delete(id).subscribe(() => {
        this.members = this.members.filter(member => member.id !== id);
      });
      this.deleteLine(index);
    }
  }

  deleteLine(index : number)
  {
    if(index !== -1)
    {
      this.members.splice(index, 1);
    }
  }



  get totalPages(): number {
    return Math.ceil(this.totalData / this.filterModel.limit);
  }

  getPages(): number[] {
    const totalPages = this.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  updateFilter(data: any)
  {
    this.filterModel = data;
    this.loadData();
  }

  searchFormToggle()
  {
    this.SearchFormDisplay = (this.SearchFormDisplay == "search-form-display") ? "" : "search-form-display";
  }

  onPageChange(page : number)
  {
    this.isLoading = true;
    this.currentPage = page;
    let intvalue = page - 1;
    if(intvalue > -1)
    {
      this.loadData(intvalue);
      this.isLoading = false;
    }
    if(intvalue < 0)
    {
      this.isLoading = false;
    }
  }



}
