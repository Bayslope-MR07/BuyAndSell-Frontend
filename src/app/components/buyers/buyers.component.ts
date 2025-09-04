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
  import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TechDomainDialogComponent } from '../../tech-domain-dialog/tech-domain-dialog.component';
  

  declare var bootstrap: any;
  @Component({
    selector: 'app-buyers',
    standalone: true,
    imports: [
      MatDialogModule,
      MatButtonModule,
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
      FormsModule,
    ],
    templateUrl: './buyers.component.html',
    styleUrls: ['./buyers.component.css'],
  })
  export class BuyersComponent implements OnInit {
    shortlistedPatents: any[] = [];
    paginatedShortlisted: any[] = [];

    // exclusivePatents: any[] = [];
    bestMatches: any[] = [];

    // Exclusive pagination
    exclusivePageIndex: number = 0;
    exclusivePageSize: number = 10;
    exclusiveTotalCount: number = 0;
    exclusivePaginatedData: any[] = [];

    // nonExclusivePatents: any[] = [];

    decodeURIComponent = decodeURIComponent;

    baseUrl: any = environment.apiUrl;
    exclusivePatents: any[] = [];
    nonExclusivePatents: any[] = [];

    shortlistedPortfolios: any[] = [];

    shortlistedBuyers: any[] = [];

    // exclusivePatents: any[] = [];
    // nonExclusivePatents: any[] = [];
    buyerData: any[] = [];
    filteredData: any[] = [];
    paginatedData: any[] = [];
    selectedTechDomain: string = '';
    filters: any = {
      primary_technology: '',
      important: '',
      entity_status: '',
      acquisition_status: '',
      bay_overall_rating: '',
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
      private authService: AuthService,
      private dialog: MatDialog
    ) {}

    ngOnInit() {
      this.fetchBuyerData();
      this.applyFilters();
    }

    // selectedTabIndex: number = 0;
    nestedTabIndex: number = 0;
    updatePaginatedData() {
      const start = this.pageIndex * this.pageSize;
      const end = start + this.pageSize;

      if (this.nestedTabIndex === 0) {
        this.paginatedExclusive = this.filteredExclusive.slice(start, end);
      } else {
        this.paginatedNonExclusive = this.filteredNonExclusive.slice(
          start,
          end
        );
      }
      const startIndex = this.pageIndex * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    }

    handlePageEvent(event: PageEvent) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedData();
    }
    // import { MatTableDataSource } from '@angular/material/table';

    dataSource = new MatTableDataSource<any>([]);

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
    originalData: any[] = []; // For storing unfiltered data
    // filteredData: any[] = []; // For storing filtered data

    fetchBuyerData() {
      this.loader = true;
      this.filteredData = [];
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      // this.http.get(`${this.baseUrl}/buyer-data/`, { headers }).subscribe(
      //   (response: any) => {
      //     this.buyerData = response;
      //     this.exclusivePatents = this.buyerData.filter(
      //       (b) => b.exclusive === true
      //     );
      //     this.nonExclusivePatents = this.buyerData.filter(
      //       (b) => b.exclusive === false
      //     );
      //     this.applyFilters();
      //     this.filteredData = response;
      //     console.log('Fetched Buyer Data:', this.buyerData); // Log full data
      //     this.buyerData.forEach((item: any, index: number) => {
      //       console.log(`Item ${index + 1}:`, item); // Log each item
      //       if (item.uploaded_files) {
      //         console.log(
      //           `Patent ID ${item.id} Uploaded Files:`,
      //           item.uploaded_files
      //         );
      //         if (item.uploaded_files[0]?.url) {
      //           console.log(
      //             `Patent ID ${item.id} URL:`,
      //             item.uploaded_files[0].url
      //           );
      //         } else {
      //           console.log(
      //             `Patent ID ${item.id} - No valid URL in uploaded_files`
      //           );
      //         }
      //       } else {
      //         console.log(`Patent ID ${item.id} - No uploaded_files array`);
      //       }
      //     });
      //     this.updatePaginatedData();
      //     this.loader = false;
      //   },
      //   (error) => {
      //     this.loader = false;
      //     console.error('Error fetching buyer data:', error);
      //   }
      // );

      this.http.get(`${this.baseUrl}/buyer-data/`, { headers }).subscribe(
        (response: any) => {
          this.buyerData = response;
          this.originalData = [...response];

          this.exclusivePatents = this.buyerData.filter(
            (b) => b.exclusive === true
          );
          this.nonExclusivePatents = this.buyerData.filter(
            (b) => b.exclusive === false
          );
          this.exclusiveTotalCount = this.exclusivePatents.length;
          this.updateExclusivePaginatedData();


          // --- NEW: set submissionStatus map from backend user_feedback if present
          this.submissionStatus.clear();
          this.buyerData.forEach((item: any, index: number) => {
            if (item.user_feedback && item.user_feedback.action) {
              this.submissionStatus.set(item.id, item.user_feedback.action);
            } else {
              // ensure no stale entry
              this.submissionStatus.delete(item.id);
            }
          });

          this.applyFilters();
          this.filteredData = response;
          console.log('Fetched Buyer Data:', this.buyerData); // Log full data
          // existing logging code kept...
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
            this.shortlistedPatents = response;
            this.buyerData = [...response];
            this.filteredData = [...response];

            // set submission statuses
            this.submissionStatus.clear();
            this.buyerData.forEach((item: any) => {
              if (item.user_feedback) {
                this.submissionStatus.set(item.id, item.user_feedback?.action);
              }
            });

            // reset selectedActions to avoid stale selections
            this.selectedActions.clear();
            this.pageIndex = 0;
            this.pageSize = 10;

            this.updatePaginatedData();
            this.loader = false;
          },
          (error) => {
            this.loader = false;
            console.error('Error fetching buyer data:', error);
          }
        );
    }

    openDialog(fullText: string) {
      // alert('Hiiii');
      this.dialog.open(TechDomainDialogComponent, {
        width: '400px',
        data: { text: fullText },
      });
    }
    // }
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
      this.clearFilters();
      this.selectedActions.clear();
      this.submissionStatus.clear();
      this.selectedTabIndex = tabIndex.index;

      if (tabIndex.index === 3) {
        // shortlisted
        this.fetchBuyerDataShortlisted();
      } else if (tabIndex.index === 1) {
        // 👈 Best Matching Portfolios
        const buyerId = localStorage.getItem('buyer_id'); // ya jo bhi id store karte ho
        if (buyerId) {
          this.fetchBestMatches(+buyerId);
        }
      } else {
        // all patents
        this.fetchBuyerData();
      }
    }

    filteredExclusive: any[] = [];
    filteredNonExclusive: any[] = [];

    paginatedExclusive: any[] = [];
    paginatedNonExclusive: any[] = [];

    // applyFilters() {
    //   this.filteredExclusive = this.exclusivePatents.filter((buyer) =>
    //     this.passesFilters(buyer)
    //   );
    //   this.filteredNonExclusive = this.nonExclusivePatents.filter((buyer) =>
    //     this.passesFilters(buyer)
    //   );
    //   // this.updatePaginatedData();
    //   this.filteredData = this.buyerData.filter((buyer) => {
    //     return Object.keys(this.filters).every((key) => {
    //       const filterValue = this.filters[key];
    //       if (!filterValue) return true;
    //       return String(buyer[key])
    //         .toLowerCase()
    //         .includes(String(filterValue).toLowerCase());
    //     });
    //   });
    //   this.pageIndex = 0;
    //   this.updatePaginatedData();
    // }
    // applyFilters() {
    //   const keyMapping: { [key: string]: string } = {
    //     primary_technology: 'primary_technology',
    //     entity_status: 'entity_status',
    //     acquisition_status: 'acquisition_status',
    //     bay_overall_rating: 'bay_overall_rating', // fixed here
    //     target: 'target',
    //     patent_number: 'patent_number',
    //   };

    //   const filterFn = (buyer: any) => {
    //     return Object.keys(this.filters).every((key) => {
    //       const filterValue = this.filters[key];
    //       if (!filterValue) return true;
    //       const actualKey = keyMapping[key] || key;
    //       const buyerValue = buyer[actualKey] ? String(buyer[actualKey]) : '';
    //       return buyerValue
    //         .toLowerCase()
    //         .includes(String(filterValue).toLowerCase());
    //     });
    //   };

    //   this.filteredExclusive = this.exclusivePatents.filter(filterFn);
    //   this.filteredNonExclusive = this.nonExclusivePatents.filter(filterFn);
    //   this.filteredData = this.buyerData.filter(filterFn);

    //   this.pageIndex = 0;
    //   this.updatePaginatedData();
    // }

    applyFilters() {
      console.log('==== APPLY FILTERS CALLED ====');
      console.log('Current Filters Object:', this.filters);
      console.log('Bay Rating filter value:', this.filters.bay_overall_rating);

      const keyMapping: { [key: string]: string } = {
        primary_technology: 'primary_technology',
        entity_status: 'entity_status',
        acquisition_status: 'acquisition_status',
        bay_overall_rating: 'bay_overall_rating',
        target: 'target',
        patent_number: 'patent_number',
        company_name: 'company_name',
        important: 'important',
        enforceability: 'enforceability',
        expiry: 'expiry',
        keywords: 'keywords',
        tech_domain: 'tech_domain',
        relevant_companies: 'relevant_companies',
        industry: 'industry',
      };

      if (!this.originalData || this.originalData.length === 0) {
        console.warn('⚠ originalData is empty! Filtering will do nothing.');
      } else {
        console.log(
          `originalData length before filtering: ${this.originalData.length}`
        );
        console.log('Sample object keys:', Object.keys(this.originalData[0]));
        console.log('Sample bay_overall_rating values from API:');
        this.originalData.forEach((item, idx) => {
          console.log(`#${idx + 1}:`, item.bay_overall_rating);
        });
      }

      this.filteredData = this.originalData.filter((item) => {
        return Object.keys(this.filters).every((filterKey) => {
          const filterValue = this.filters[filterKey]
            ?.toString()
            .trim()
            .toLowerCase();
          if (!filterValue) return true;

          const dataKey = keyMapping[filterKey];
          const dataValue = (item[dataKey] ?? '')
            .toString()
            .trim()
            .toLowerCase();

          if (filterKey === 'bay_overall_rating') {
            console.log(
              `Checking item: "${dataValue}" against filter: "${filterValue}"`
            );
            return dataValue === filterValue; // exact match for rating
          }

          return dataValue.includes(filterValue); // partial + case-insensitive match
        });
      });

      console.log(`Filtered data length: ${this.filteredData.length}`);
      console.log('Filtered Data Sample:', this.filteredData.slice(0, 5));

      // 🔹 UI me tab ke liye exclusivePatents update karna zaroori hai
      this.exclusivePatents = this.filteredData.filter(
        (b) => b.exclusive === true
      );

      // Agar tum table ke liye dataSource use kar rahe ho
      this.dataSource.data = this.exclusivePatents;
    }

    passesFilters(buyer: any): boolean {
      return Object.keys(this.filters).every((key) => {
        const filterValue = this.filters[key];
        if (!filterValue) return true;
        return String(buyer[key] || '')
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    }

    clearFilters() {
      this.filters = {
        primary_technology: '',
        important: '',
        entity_status: '',
        acquisition_status: '',
        bay_overall_rating: '', // added here
        enforceability: '',
        keywords: '',
        patent_number: '',
        company_name: '',
        target: '',
        expiry: '',
        relevant_companies: '',
        industry: '',
      };
      this.applyFilters();
    }

    updateExclusivePaginatedData() {
      const startIndex = this.exclusivePageIndex * this.exclusivePageSize;
      const endIndex = startIndex + this.exclusivePageSize;
      this.exclusivePaginatedData = this.exclusivePatents.slice(
        startIndex,
        endIndex
      );
    }
    onExclusivePageChange(event: any) {
      this.exclusivePageIndex = event.pageIndex;
      this.exclusivePageSize = event.pageSize;
      this.updateExclusivePaginatedData();
    }

    selectAction(patentId: number, action: string) {
      this.selectedActions.set(patentId, action); // Save the selected action for the specific entry
      // console.log(`Selected action for patent ${patentId}: ${action}`);
    }
    logUrl(url: string) {
      const decoded = decodeURIComponent(url.split('/').pop() || '');
      console.log('📥 Downloading:', decoded);
    }

    getGoogleViewerUrl(fileUrl: string): string {
      return `https://docs.google.com/gview?url=${encodeURIComponent(
        fileUrl
      )}&embedded=true`;
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

    // submitAction(patentId: number, action: string) {
    //   const token = localStorage.getItem('access_token');
    //   const headers = new HttpHeaders({
    //     Authorization: `Bearer ${token}`,
    //   });

    //   const payload = { id: patentId, action: action };

    //   this.http
    //     .post(`${this.baseUrl}/buyerChoice/`, payload, { headers })
    //     .subscribe(
    //       (response) => {
    //         this.submissionStatus.set(patentId, action);
    //         if (this.selectedTabIndex === 1) {
    //           this.fetchBuyerDataShortlisted();
    //         } else {
    //           this.fetchBuyerData();
    //         }
    //       },
    //       (error) => {
    //         console.error(
    //           `Error submitting action "${action}" for patent ID ${patentId}:`,
    //           error
    //         );
    //       }
    //     );
    // }

submitAction(patentId: number, action: string) {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const payload = { id: patentId, action: action };

  this.http.post(`${this.baseUrl}/buyerChoice/`, payload, { headers })
    .subscribe(
      (response) => {
        const updatedPatent = this.buyerData.find((b) => b.id === patentId);
        if (updatedPatent) {
          updatedPatent.user_feedback = { action: action };
          this.submissionStatus.set(patentId, action);
        }

        // ✅ shortlist me add/update karo har action pe
        const alreadyShortlisted = this.shortlistedPatents.find(p => p.id === patentId);
        if (alreadyShortlisted) {
          alreadyShortlisted.user_feedback = { action: action };
        } else {
          this.shortlistedPatents.push(updatedPatent);
        }

        // Refresh UI
        if (this.selectedTabIndex === 3) {
          this.paginatedShortlisted = this.shortlistedPatents.slice(0, this.pageSize);
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


    // enableResubmit(patentId: number) {
    //   this.submissionStatus.delete(patentId);
    //   this.selectedActions.delete(patentId);
    // }

    enableResubmit(patentId: number) {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .request('delete', `${this.baseUrl}/buyerChoice/`, {
          body: { id: patentId },
          headers,
        })
        .subscribe(
          () => {
            this.submissionStatus.delete(patentId);
            this.selectedActions.delete(patentId);

            const updatedPatent = this.buyerData.find((b) => b.id === patentId);
            if (updatedPatent) {
              updatedPatent.user_feedback = null;
            }
          },
          (error) => {
            console.error(
              `Error clearing submission for patent ${patentId}:`,
              error
            );
          }
        );
    }

    viewPatentDetails(patentId: number) {
      this.router.navigate(['/buyer-details', patentId]);
    }
    gotobuyerform() {
      this.router.navigate(['/buyerform']);
    }
    fetchBestMatches(buyerId: number) {
      this.loader = true;
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .get(`${this.baseUrl}/buyer-matches/${buyerId}/`, { headers })
        .subscribe(
          (response: any) => {
            this.bestMatches = response.best_matches || []; // 👈 safe assign
            this.loader = false;
            console.log('Best Matches Fetched:', this.bestMatches);
          },
          (error) => {
            this.loader = false;
            console.error('Error fetching best matches:', error);
          }
        );
    }
  }
  
