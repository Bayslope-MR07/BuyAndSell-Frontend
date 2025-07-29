/* 
  import { Component, OnInit } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  
  @Component({
    selector: 'app-buyers',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './buyers.component.html',
    styleUrls: ['./buyers.component.css']
  })
  export class BuyersComponent implements OnInit {
    buyerData: any[] = [];
    selectedActions: Map<number, string> = new Map(); // Tracks selected actions
    submissionStatus: Map<number, boolean> = new Map(); // Tracks submission status
  
    constructor(private http: HttpClient) {}
  
    ngOnInit() {
      this.fetchBuyerData();
    }
  
    fetchBuyerData() {
      this.http.get('${this.baseUrl}/buyer-data/').subscribe(
        (response: any) => {
          this.buyerData = response;
        },
        (error) => {
          console.error('Error fetching buyer data:', error);
        }
      );
    }
  
    selectAction(patentId: number, action: string) {
      this.selectedActions.set(patentId, action); // Save the selected action for the specific entry
      console.log(`Selected action for patent ${patentId}: ${action}`);
    }
  
    confirmSubmit(patentId: number) {
      const action = this.selectedActions.get(patentId);
      if (!action) {
        alert('Please select an action before submitting.');
        return;
      }
      if (confirm(`Are you sure you want to submit "${action}" for patent ID ${patentId}?`)) {
        this.submitAction(patentId, action);
      }
    }
  
    submitAction(patentId: number, action: string) {
      const token = localStorage.getItem('access_token'); // Retrieve token from storage
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}` // Use Bearer for JWT
      });
  
      const payload = { id: patentId, action: action };
  
      this.http.post('${this.baseUrl}/buyerChoice/', payload, { headers }).subscribe(
        (response) => {
          console.log(`Action "${action}" for patent ID ${patentId} submitted successfully:`, response);
          this.submissionStatus.set(patentId, true); // Mark this entry as submitted
        },
        (error) => {
          console.error(`Error submitting action "${action}" for patent ID ${patentId}:`, error);
        }
      );
    }
  
    enableResubmit(patentId: number) {
      this.submissionStatus.set(patentId, false); // Allow resubmission for the specific patent
      this.selectedActions.delete(patentId); // Clear the previously selected action
    }
  }

 */

  import { Component, OnInit } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { FooterComponent } from '../footer/footer.component';
  import { environment } from '../../../environments/environment';
  import { AuthService } from '../../services/auth.service';
  import { MatTabsModule } from '@angular/material/tabs';
  import { MatTabChangeEvent } from '@angular/material/tabs';
  import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatSelectModule } from '@angular/material/select';
  import { MatOptionModule } from '@angular/material/core';
  
  @Component({
    selector: 'app-buyers',
    standalone: true,
    imports: [
      MatOptionModule,
      MatSelectModule,
      MatFormFieldModule,
      FormsModule,
      CommonModule,
      FooterComponent,
      MatTabsModule,
      ProfileHeaderComponent,
      MatProgressSpinnerModule,
      MatPaginatorModule,
    ],
    templateUrl: './buyers.component.html',
    styleUrls: ['./buyers.component.css'],
  })
  export class BuyersComponent implements OnInit {
    baseUrl: any = environment.apiUrl;
    buyerData: any[] = [];
    filteredData: any[] = [];
    paginatedData: any[] = [];
    filters: any = {
      primary_technology: '',
      important: '',
      entity_status: '',
      acquisition_status: '',
      bay_rating: '',
      enforceability: '',
      keywords: '',
      patent_number: '',
      company_name: '',
      target: '',
      expiry: '',
    };
    selectedActions: Map<number, string> = new Map();
    submissionStatus: Map<number, string> = new Map();
    loader: boolean = false;
    selectedTabIndex: any = 0;
    pageSize = 10;
    pageIndex = 0;

    constructor(
      private http: HttpClient,
      private router: Router,
      private authService: AuthService
    ) {}

    ngOnInit() {
      this.fetchBuyerData();
    }

    updatePaginatedData() {
      const startIndex = this.pageIndex * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    }

    handlePageEvent(event: PageEvent) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedData();
    }

    logout() {
      this.router.navigateByUrl('login');
    }

    analytics() {
      this.router.navigateByUrl('analytics');
    }

    showDetails() {
      this.router.navigateByUrl('buyer');
    }

    seller() {
      this.router.navigateByUrl('user-seller-data');
    }

    fetchBuyerData() {
      this.loader = true;
      this.filteredData = [];
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      this.http.get(`${this.baseUrl}/buyer-data/`, { headers }).subscribe(
        (response: any) => {
          this.buyerData = response;
          this.filteredData = response;
          this.buyerData.forEach((item: any) => {
            if (item.user_feedback) {
              this.submissionStatus.set(item.id, item.user_feedback?.action);
            }
          });
          this.updatePaginatedData();
          this.loader = false;
        },
        (error) => {
          this.loader = false;
          console.error('Error fetching buyer data:', error);
        }
      );
    }

    fetchBuyerDataShortlisted() {
      this.loader = true;
      this.filteredData = [];
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      this.http
        .get(`${this.baseUrl}/buyer-data/?status=1`, { headers })
        .subscribe(
          (response: any) => {
            this.buyerData = response;
            this.filteredData = response;
            this.buyerData.forEach((item: any) => {
              if (item.user_feedback) {
                this.submissionStatus.set(item.id, item.user_feedback?.action);
              }
            });
            this.updatePaginatedData();
            this.loader = false;
          },
          (error) => {
            this.loader = false;
            console.error('Error fetching buyer data:', error);
          }
        );
    }

    downloadCSV() {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      if (this.selectedTabIndex === 1) {
        this.http
          .get(`${this.baseUrl}/buyer-data/?status=1&download=true`, {
            headers,
            responseType: 'blob',
          })
          .subscribe(
            (response: Blob) => {
              const blob = new Blob([response], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'shortlisted_patents_data.csv';
              a.click();
              window.URL.revokeObjectURL(url);
            },
            (error) => {
              console.error('Error downloading CSV:', error);
            }
          );
      } else {
        this.http
          .get(`${this.baseUrl}/buyer-data/?download=true`, {
            headers,
            responseType: 'blob',
          })
          .subscribe(
            (response: Blob) => {
              const blob = new Blob([response], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'all_patents_data.csv';
              a.click();
              window.URL.revokeObjectURL(url);
            },
            (error) => {
              console.error('Error downloading CSV:', error);
            }
          );
      }
    }

    changeTab(tabIndex: MatTabChangeEvent) {
      // console.log(tabIndex.index);
      this.clearFilters();
      if (tabIndex.index == 1) {
        this.fetchBuyerDataShortlisted();
        this.selectedTabIndex = 1;
      } else {
        this.fetchBuyerData();
        this.selectedTabIndex = 0;
      }
    }

    applyFilters() {
      this.filteredData = this.buyerData.filter((buyer) => {
        return Object.keys(this.filters).every((key) => {
          const filterValue = this.filters[key];
          if (!filterValue) return true;
          return String(buyer[key])
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        });
      });
      this.pageIndex = 0;
      this.updatePaginatedData();
    }

    clearFilters() {
      this.filters = {
        primary_technology: '',
        important: '',
        entity_status: '',
        acquisition_status: '',
        bay_rating: '',
        enforceability: '',
        keywords: '',
        patent_number: '',
        company_name: '',
        target: '',
        expiry: '',
      };
      this.applyFilters();
    }

    selectAction(patentId: number, action: string) {
      this.selectedActions.set(patentId, action); // Save the selected action for the specific entry
      // console.log(`Selected action for patent ${patentId}: ${action}`);
    }
    logUrl(url: string) {
      console.log('Download URL:', url);
    }

    confirmSubmit(patentId: number) {
      const action = this.selectedActions.get(patentId);
      if (!action) {
        alert('Please select an action before submitting.');
        return;
      }
      if (
        confirm(
          `Are you sure you want to submit "${action}" for patent ID ${patentId}?`
        )
      ) {
        this.submitAction(patentId, action);
      }
    }

    submitAction(patentId: number, action: string) {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const payload = { id: patentId, action: action };

      this.http
        .post(`${this.baseUrl}/buyerChoice/`, payload, { headers })
        .subscribe(
          (response) => {
            this.submissionStatus.set(patentId, action);
            if (this.selectedTabIndex === 1) {
              this.fetchBuyerDataShortlisted();
            } else {
              this.fetchBuyerData();
            }
          },
          (error) => {
            console.error(
              `Error submitting action "${action}" for patent ID ${patentId}:`,
              error
            );
          }
        );
    }

    enableResubmit(patentId: number) {
      this.submissionStatus.delete(patentId);
      this.selectedActions.delete(patentId);
    }

    viewPatentDetails(patentId: number) {
      this.router.navigate(['/buyer-details', patentId]);
    }

  }
  

  // import { Component, OnInit } from '@angular/core';
  // import { HttpClient, HttpHeaders } from '@angular/common/http';
  // import { FormsModule } from '@angular/forms';
  // import { CommonModule } from '@angular/common';
  // import { Router } from '@angular/router';
  // import { HeaderComponent } from '../header/header.component';
  // import { FooterComponent } from '../footer/footer.component';

  
  // @Component({
  //   selector: 'app-buyers',
  //   standalone: true,
  //   imports: [HeaderComponent,FooterComponent,FormsModule, CommonModule],
  //   templateUrl: './buyers.component.html',
  //   styleUrls: ['./buyers.component.css']
  // })
  // export class BuyersComponent implements OnInit {
  //   buyerData: any[] = [ // Manually inserted 10 data entries
  //     { id: 1, patent_number: 'US10789892', primary_technology: 'Automobile', entity_status: 'Micro', expiry: '2029-01-10', file: 'path/to/file1.pdf', acquisition_status: 'Open', bay_rating: 'High-Potential' },
  //     { id: 2, patent_number: 'US10278952', primary_technology: 'Virtual Reality', entity_status: 'Micro', expiry: '2028-05-29', file: 'path/to/file2.pdf', acquisition_status: 'Open', bay_rating: 'Mid-Potential' },
  //     { id: 3, patent_number: 'US98710282', primary_technology: 'Identity Verification', entity_status: 'Micro', expiry: '2030-06-02', file: 'path/to/file3.pdf', acquisition_status: 'Open', bay_rating: 'Low-Potential' },
  //     { id: 4, patent_number: 'US10298382', primary_technology: 'Multimedia', entity_status: 'Micro', expiry: '2027-07-17', file: 'path/to/file4.pdf', acquisition_status: 'Open', bay_rating: 'Mid-Potential' },
  //     { id: 5, patent_number: 'US04689782', primary_technology: 'UAV', entity_status: 'Micro', expiry: '2028-08-13', file: 'path/to/file5.pdf', acquisition_status: 'Open', bay_rating: 'High-Potential' },
  //     { id: 6, patent_number: 'US89569802', primary_technology: 'Advertising', entity_status: 'Micro', expiry: '2029-08-20', file: 'path/to/file6.pdf', acquisition_status: 'Open', bay_rating: 'Low-Potential' },
  //     { id: 7, patent_number: 'US10787892', primary_technology: 'Authentication', entity_status: 'Micro', expiry: '2030-11-01', file: 'path/to/file7.pdf', acquisition_status: 'Open', bay_rating: 'Mid-Potential' },
  //     { id: 8, patent_number: 'US10278982', primary_technology: 'Networking', entity_status: 'Micro', expiry: '2029-03-15', file: 'path/to/file8.pdf', acquisition_status: 'Open', bay_rating: 'High-Potential' },
  //     { id: 9, patent_number: 'US98765432', primary_technology: 'AI', entity_status: 'Micro', expiry: '2028-12-25', file: 'path/to/file9.pdf', acquisition_status: 'Open', bay_rating: 'Mid-Potential' },
  //     { id: 10, patent_number: 'US12345678', primary_technology: 'Blockchain', entity_status: 'Micro', expiry: '2031-04-30', file: 'path/to/file10.pdf', acquisition_status: 'Open', bay_rating: 'Low-Potential' }
  //   ];
  //   filteredData: any[] = []; // Data to display after filtering
  //   filters: any = {
  //     primary_technology: '',
  //     entity_status: '',
  //     acquisition_status: '',
  //     bay_rating: '',
  //     target: '',
  //     patent_number: ''
  //   };
  //   expiryYears: number = 1;
  //   selectedActions: Map<number, string> = new Map(); // Tracks selected actions
  //   submissionStatus: Map<number, boolean> = new Map(); // Tracks submission status
  
  //   constructor(private http: HttpClient, private router: Router) {}
  //   buyerDetails(){
  //     this.router.navigateByUrl('buyer');
  //   }
  //   analyticsFunction(){
  //     this.router.navigateByUrl('analytics');
  //   }
  
  //   ngOnInit() {
  //     this.filteredData = [...this.buyerData]; // Initialize filteredData with all data
  //   }
  
  //   // Apply filters to buyer data
  //   applyFilters() {
  //     this.filteredData = this.buyerData.filter((buyer) => {
  //       const expiryDate = buyer.expiry ? new Date(buyer.expiry) : null;
  //       const maxExpiryDate = new Date();
  //       maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + this.expiryYears);
    
  //       return (
  //         (this.filters.primary_technology === '' || 
  //           buyer.primary_technology.toLowerCase().includes(this.filters.primary_technology.toLowerCase())) &&
  //         (this.filters.entity_status === '' || 
  //           buyer.entity_status === this.filters.entity_status) &&
  //         (this.filters.acquisition_status === '' || 
  //           buyer.acquisition_status === this.filters.acquisition_status) &&
  //         (this.filters.bay_rating === '' || 
  //           buyer.bay_rating === this.filters.bay_rating) &&
  //         (this.filters.target === '' || 
  //           buyer.target.toLowerCase().includes(this.filters.target.toLowerCase())) &&
  //         (this.filters.patent_number === '' || 
  //           buyer.patent_number.toLowerCase().includes(this.filters.patent_number.toLowerCase())) &&
  //         (!expiryDate || expiryDate <= maxExpiryDate) // Compare Date objects directly
  //       );
  //     });
  //   }
  
  //   // Clear all filters
  //   clearFilters() {
  //     this.filters = {
  //       primary_technology: '',
  //       entity_status: '',
  //       acquisition_status: '',
  //       bay_rating: '',
  //       target: '',
  //       patent_number: ''
  //     };
  //     this.expiryYears = 1; // Reset expiry filter to default
  //     this.applyFilters();
  //   }
  
  //   selectAction(patentId: number, action: string) {
  //     this.selectedActions.set(patentId, action); // Save the selected action for the specific entry
  //     console.log(`Selected action for patent ${patentId}: ${action}`);
  //   }
  
  //   confirmSubmit(patentId: number) {
  //     const action = this.selectedActions.get(patentId);
  //     if (!action) {
  //       alert('Please select an action before submitting.');
  //       return;
  //     }
  //     if (confirm(`Are you sure you want to submit "${action}" for patent ID ${patentId}?`)) {
  //       this.submitAction(patentId, action);
  //     }
  //   }
  
  //   submitAction(patentId: number, action: string) {
  //     const token = localStorage.getItem('access_token'); // Retrieve token from storage
  //     const headers = new HttpHeaders({
  //       Authorization: `Bearer ${token}` // Use Bearer for JWT
  //     });
  
  //     const payload = { id: patentId, action: action };
      
  //     this.http.post('${this.baseUrl}/buyerChoice/', payload, { headers }).subscribe(
  //       (response) => {
  //         console.log(`Action "${action}" for patent ID ${patentId} submitted successfully:`, response);
  //         this.submissionStatus.set(patentId, true); // Mark this entry as submitted
  //       },
  //       (error) => {
  //         console.error(`Error submitting action "${action}" for patent ID ${patentId}:`, error);
  //       }
  //     );
  //   }
  
  //   adjustExpiryYears(value: number) {
  //     this.expiryYears += value;
  //     if (this.expiryYears < 1) {
  //       this.expiryYears = 1; // Ensure expiry filter doesn't go below 1 year
  //     }
  //     this.applyFilters();
  //   }
  
  //   enableResubmit(patentId: number) {
  //     this.submissionStatus.set(patentId, false); // Allow resubmission for the specific patent
  //     this.selectedActions.delete(patentId); // Clear the previously selected action
  //   }
  
  //   viewPatentDetails(patentId: number) {
  //     this.router.navigate(['/buyer-details', patentId]); // Pass patentId in the route
  //   }
  // }

