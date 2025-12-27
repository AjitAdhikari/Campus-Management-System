import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import { ChartData, SummaryData } from '../dashboard.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  isLoading: boolean = false;
  summaryData =  new SummaryData();
  financeXData : number[] = [];
  financeYData : string[] = [];
  genderXData : string[] = [];
  genderYData : number[] = [];

  constructor(
    private _service: DashboardService,
  ) { }

  ngOnInit(): void {
    this.loadSummaryData();
    this.loadFinaceData();
    this.loadGenderData();
  }



  loadSummaryData(): void {
    this.isLoading = true;
      this._service.getSummaryData().subscribe({
        next: (data: SummaryData) => {
          this.summaryData.totalExpense = data.totalExpense;
          this.summaryData.totalIncome = data.totalIncome;
          this.summaryData.totalItems = data.totalItems;
          this.summaryData.totalMembers = data.totalMembers;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading inventory data', error);
          this.isLoading = false;
        }
      });
  }


  loadFinaceData(): void {
    this.isLoading = true;
    this._service.getFinaceChartData().subscribe({
      next: (res: Array<any>) => {
        res.forEach( (element: ChartData) =>{
          this.financeXData.push(element.value);
          this.financeYData.push(element.key);
        });
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
      }
    });
  }


  loadGenderData(): void {
    this.isLoading = true;
    this._service.getGenderChartData().subscribe({
      next: (res: Array<any>) => {
        res.forEach( (element: ChartData) =>{
          this.genderXData.push(element.key);
          this.genderYData.push(element.value);
        });
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
      }
    });
  }

}
