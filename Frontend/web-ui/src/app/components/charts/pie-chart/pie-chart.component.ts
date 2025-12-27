import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnChanges {
  @Input() xValue: string[] = [];
  @Input() yValue: number[] = [];

  // Pie chart options
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true, // Set to true for better responsiveness
  };

  // Pie chart labels and datasets
  public pieChartLabels: string[] = [];
  public pieChartDatasets: ChartDataset<'pie', number[]>[] = [
    { data: [] }
  ];

  public pieChartLegend = true;
  public pieChartPlugins = [];

  // Detect changes in Input values
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xValue'] || changes['yValue']) {
      this.updateChartData();
    }
  }

  // Method to update chart data based on input changes
  private updateChartData(): void {
    this.pieChartLabels = [...this.xValue]; // Ensure labels are updated
    this.pieChartDatasets = [
      { data: [...this.yValue] } // Ensure datasets are updated
    ];
  }
}
