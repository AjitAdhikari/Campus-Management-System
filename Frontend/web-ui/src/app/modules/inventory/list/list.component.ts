import { Component, OnInit } from '@angular/core';
import { FilterVm, Inventory } from '../inventory.model';
import { InventoryService } from '../inventory.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  pageParentLink = 'Inventory';
  pageTitle = 'List Item';
  data: Inventory[] = [];
  sortDirection = true;
  imageUrl : string | null  = '';
  isLoading: Boolean = false;
  currentPage: number = 1;
  filterModel = new FilterVm();
  totalData: number = 0;
  SearchFormDisplay = "";

  constructor(
    private _service: InventoryService,
    private _router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(page: number = 0): void {
    this.isLoading = true;
    this.filterModel.offset = page * this.filterModel.limit;
    this._service.list(this.filterModel).subscribe({
      next: (res:any) => {
        this.data = res.items;
        this.data.forEach((item)=> {
          item.image = environment.MediaUploadUrl + item.image;
        })
        this.totalData = res.total_data_count;
        this.isLoading = false
      },
      error: (error) => {
        this.toastr.error('Something went wrong');
        console.error('Error loading inventory data', error);
        this.isLoading = false
      }
    });
  }

  sortTable(column: string): void {
    this.sortDirection = !this.sortDirection;
    this.data.sort((a:any, b:any) => {
      if (a[column] < b[column]) return this.sortDirection ? -1 : 1;
      if (a[column] > b[column]) return this.sortDirection ? 1 : -1;
      return 0;
    });
  }

  editItem(id: number): void {
    // Implement the edit functionality
    this._router.navigate([`/inventory/edit/${id}`]);
  }

  delete(id: number, index: number): void {
    let res = confirm("Do you really want to delete this member?");
    if(res){
      this._service.delete(id).subscribe(() => {
        this.data = this.data.filter(member => member.id !== id);
      });
      this.deleteLine(index);
    }
  }

  deleteLine(index : number)
  {
    if(index !== -1)
    {
      this.data.splice(index, 1);
    }
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



}
