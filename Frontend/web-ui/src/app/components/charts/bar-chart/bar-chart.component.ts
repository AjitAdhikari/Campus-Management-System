import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges {
  public barChartLegend = true;
  public barChartPlugins = [];

  @Input() xValue: number[] = [];
  @Input() yValue: string[] = [];
  @Input() label: string = "";

  // Bar chart data
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  // Lifecycle hook to detect changes in inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xValue'] || changes['yValue'] || changes['label']) {
      this.updateChartData();
    }
  }

  // Method to update chart data
  private updateChartData(): void {
    // Generate transformed array
    const transformedArray = this.xValue.map((item, index) => ({
      data: [item],
      label: this.yValue[index] || `Type ${index + 1}` // Fallback if label is missing
    }));

    // Update bar chart data
    this.barChartData = {
      labels: [this.label], // Use yValue for chart labels
      datasets: transformedArray
    };
  }
}
