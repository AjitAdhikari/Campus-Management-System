import { Component } from '@angular/core';
import { DocumentService } from '../document.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Documents, FilterVm } from '../document.model';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [DatePipe]
})
export class ListComponent {

  pageParentLink = 'document';
  pageTitle = 'List Item';
  data: Documents[] = [];
  sortDirection = true;
  imageUrl : string | null  = '';
  isLoading: Boolean = false;
  currentPage: number = 1;
  filterModel = new FilterVm();
  totalData: number = 0;
  SearchFormDisplay = "";

  baseUrl = `${environment.ApiUrl}/document`; // replace with your API base URL

  constructor(
    private _service: DocumentService,
    private _router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe
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
          item.createdDate = this.datePipe.transform(item.createdDate, 'yyyy-MM-dd');
        })
        console.log(this.data);
        this.totalData = res.totalDataCount;
        this.isLoading = false
      },
      error: (error) => {
        this.toastr.error('Something went wrong');
        this.isLoading = false
      }
    });
  }


  editItem(id: number): void {
    // Implement the edit functionality
    this._router.navigate([`/document/edit/${id}`]);
  }

  printFile(id: number) : void{
    this._service.download(id).subscribe((blob:any) => {
      const url = window.URL.createObjectURL(blob );
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        this.toastr.error('Failed to open new window for printing.');
      }
    }, error => {
      this.toastr.error('Error fetching the file');
      console.error('Error fetching the file', error);
    });
  }


  delete(id: number, index: number): void {
    let res = confirm("Do you really want to delete this data?");
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
