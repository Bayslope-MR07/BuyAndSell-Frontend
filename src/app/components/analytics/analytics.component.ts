import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartType, ChartOptions, registerables } from 'chart.js';
import {
  ChartConfiguration,
  ChartData,
  ChartEvent,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { PieChartComponent } from '../../pie-chart/pie-chart.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Register all Chart.js components
Chart.register(ChartDataLabels, ...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [FormsModule, CommonModule, ProfileHeaderComponent, FooterComponent, PieChartComponent, BaseChartDirective, MatProgressSpinnerModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  baseUrl:any= environment.apiUrl;
  private listedPatentsChart: Chart | undefined;
  private patentsByCategoryChart: Chart | undefined;
  private patentsByLifeChart: Chart | undefined;
  private patentsByBayRatingChart: Chart | undefined;
  public Statusdata: any[] = []; // DataPoints Array
  public CategoryData: any[] = []; // DataPoints Array
  public barChartTypeTechCategory: 'bar' = 'bar';
  loader: boolean=false;
  public barChartDataTechCategory: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [], // Update with your actual data
        backgroundColor: [
          'rgba(9, 120, 6, 0.8)', // Adjust colors as needed
        ],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y', // 
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { beginAtZero: true },
      y: { ticks: { font: { size: 12 } } }
    }
  };
  constructor(private router: Router,private http: HttpClient) {}

  

  ngOnInit(): void {
    this.fetchPatentData()
    this.createCharts();
  }
  buyer(){
    this.router.navigateByUrl('buyer');
  }

  private fetchPatentData(): void {
    this.loader=true;
    this.http.get<any>(`${this.baseUrl}/analytics/`).subscribe({
      next: (response) => {
        if(response && response?.user_type){
          this.Statusdata = Object.entries(response?.user_type).map(([region, qty]) => ({
            region,
            qty
          }));
          this.CategoryData=Object.entries(response?.feedback_analytics).map(([region, qty]) => ({
            region,
            qty
          }));
          // console.log(this.CategoryData)
          const categories = response?.unique_patents_by_primary_technology.map((item: any) => item.lower_field);
          const categoryCounts = response?.unique_patents_by_primary_technology.map((item: any) => item.count);
          this.barChartDataTechCategory.labels=categories
          this.barChartDataTechCategory.datasets[0].data=categoryCounts
        }
        this.loader=false;
      },
      error: (error) =>{
        this.loader=false;
        console.error('Error fetching patent data:', error)
      } ,
    });
  }

  private createCharts(): void {
    // Chart 1: Total Number of Listed Patents (Pie Chart)
    this.Statusdata=[]
    const listedPatentsData = {
      labels: ['Active Patents', 'Expired Patents', 'Pending Patents'],
      datasets: [{
        data: [60, 20, 20],
        backgroundColor: ['#2ecc71', '#e74c3c', '#3498db'],
        borderWidth: 1
      }]
    };

    const listedPatentsOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Total Number of Listed Patents' }
      }
    };

    this.listedPatentsChart = new Chart('listedPatentsChart', {
      type: 'pie' as ChartType,
      data: listedPatentsData,
      options: listedPatentsOptions
    });

    // Chart 2: Total Number of Patents by Category (Pie Chart)
    const patentsByCategoryData = {
      labels: ['Automobile', 'AI', 'Blockchain', 'UAV'],
      datasets: [{
        data: [30, 25, 25, 20],
        backgroundColor: ['#9b59b6', '#e67e22', '#1abc9c', '#f1c40f'],
        borderWidth: 1
      }]
    };

    const patentsByCategoryOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Total Number of Patents by Category' }
      }
    };

    this.patentsByCategoryChart = new Chart('patentsByCategoryChart', {
      type: 'pie' as ChartType,
      data: patentsByCategoryData,
      options: patentsByCategoryOptions
    });

    // Chart 3: Total Number of Patents by Life (Bar Chart)
    const patentsByLifeData = {
      labels: ['More than 5 Years', 'Less than 5 Years'],
      datasets: [{
        label: 'Patents',
        data: [70, 30],
        backgroundColor: ['#3498db', '#2980b9'],
        borderWidth: 1
      }]
    };

    const patentsByLifeOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Number of Patents' } }
      },
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Total Number of Patents by Life' }
      }
    };

    this.patentsByLifeChart = new Chart('patentsByLifeChart', {
      type: 'bar' as ChartType,
      data: patentsByLifeData,
      options: patentsByLifeOptions
    });

    // Chart 4: Total Number of Patents by Bay Rating (Pie Chart)
    const patentsByBayRatingData = {
      labels: ['High-Potential', 'Mid-Potential', 'Low-Potential'],
      datasets: [{
        data: [50, 30, 20],
        backgroundColor: ['#e74c3c', '#f1c40f', '#e67e22'],
        borderWidth: 1
      }]
    };

    const patentsByBayRatingOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Total Number of Patents by Bay Rating' }
      }
    };

    this.patentsByBayRatingChart = new Chart('patentsByBayRatingChart', {
      type: 'pie' as ChartType,
      data: patentsByBayRatingData,
      options: patentsByBayRatingOptions
    });
  }

  ngOnDestroy(): void {
    // Destroy charts to prevent memory leaks
    [this.listedPatentsChart, this.patentsByCategoryChart, this.patentsByLifeChart, this.patentsByBayRatingChart]
      .forEach(chart => chart?.destroy());
  }
}