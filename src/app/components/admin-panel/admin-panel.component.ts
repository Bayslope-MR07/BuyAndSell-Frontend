// admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { BuyerActionsComponent } from '../buyer-actions/buyer-actions.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {MatTabChangeEvent} from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    // MatSnackBar,
    FormsModule,
    CommonModule,
    MatTabsModule,
    BuyerActionsComponent,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  baseUrl = environment.apiUrl;
  sellerData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  selectedSeller: any = null;
  selectedFeedback: any = null;
  message: string = '';
  important: boolean = false;
  additionalNotes: string = '';
  entityStatus: string = 'active';
  filter: any = {
    email: '',
    verified: '',
    important: '',
  };
  selectedFile: File | null = null;
  uploadStatus: string = '';
  showFilterAndTable: boolean = false; // New property to control visibility
  loader: boolean = false;
  selectedTabIndex: any = 0;
  loader2: boolean = false;
  pageSize = 10; // Rows per page
  pageIndex = 0; // Current page index

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  confirmPassword() {
    this.router.navigateByUrl('confirm-password');
  }

  ngOnInit() {
    this.fetchSellerData();
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

  homePage() {
    this.router.navigateByUrl('/');
  }
  subAdmin() {
    this.router.navigate(['/sub-admin']);
  }

  buyerAction() {
    this.router.navigate(['./buyer-actions']);
  }

  updateUserProfile() {
    this.router.navigateByUrl('user-profile-update');
  }

  // changeTab(tabIndex: MatTabChangeEvent) {
  //   console.log(tabIndex.index);
  //   this.resetFilters()
  //   if (tabIndex.index == 1) {
  //     this.fetchSellerDataUnverified();
  //     this.selectedTabIndex=1;
  //   } else {
  //     this.fetchSellerData();
  //     this.selectedTabIndex=0;
  //   }
  // }

  changeTab(tabIndex: MatTabChangeEvent) {
    console.log(tabIndex.index);
    this.resetFilters();
    this.selectedTabIndex = tabIndex.index;

    if (tabIndex.index === 0) {
      this.fetchSellerData(); // All
    } else if (tabIndex.index === 1) {
      this.fetchSellerDataVerified(); // Verified
    } else if (tabIndex.index === 2) {
      this.fetchSellerDataUnverified(); // Unverified
    }
  }

  fetchSellerDataVerified() {
    this.loader = true;
    this.http.get(`${this.baseUrl}/seller-da/?status=2`).subscribe(
      (response: any) => {
        this.sellerData = response;
        this.filteredData = response.filter(
          (seller: any) => seller.verified === true
        );
        this.updatePaginatedData();
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        console.error('Error fetching verified sellers:', error);
      }
    );
  }

  downloadCSV() {
    this.loader2 = true;
    if (this.selectedTabIndex === 1) {
      this.http
        .get(`${this.baseUrl}/seller-da/?status=1&download=true`, {
          responseType: 'blob', // Expecting binary data (CSV file)
        })
        .subscribe(
          (response: Blob) => {
            const blob = new Blob([response], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Seller_data_pending.csv';
            a.click();
            window.URL.revokeObjectURL(url); // Clean up
            this.loader2 = false;
          },
          (error) => {
            this.loader2 = false;
            console.error('Error downloading CSV:', error);
          }
        );
    } else {
      this.http
        .get(`${this.baseUrl}/seller-da/?download=true`, {
          responseType: 'blob', // Expecting binary data (CSV file)
        })
        .subscribe(
          (response: Blob) => {
            const blob = new Blob([response], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'All_Seller_data.csv';
            a.click();
            window.URL.revokeObjectURL(url); // Clean up
            this.loader2 = false;
          },
          (error) => {
            this.loader2 = false;
            console.error('Error downloading CSV:', error);
          }
        );
    }
  }

  fetchSellerData() {
    this.loader = true;
    this.http.get(`${this.baseUrl}/seller-da/`).subscribe(
      (response: any) => {
        this.sellerData = response;
        this.filteredData = [...this.sellerData];
        this.updatePaginatedData(); // Initialize paginated data
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        console.error('Error fetching seller data:', error);
      }
    );
  }
  fetchSellerDataUnverified() {
    this.loader = true;
    this.http.get(`${this.baseUrl}/seller-da/?status=1`).subscribe(
      (response: any) => {
        this.sellerData = response;
        this.filteredData = [...this.sellerData];
        this.updatePaginatedData(); // Initialize paginated data
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        console.error('Error fetching seller data:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.uploadStatus = 'Please select a file to upload.';
      return;
    }

    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: (response: any) => {
        if (response && response.total_created > 0) {
          this.uploadStatus = 'File uploaded successfully!';
          this.selectedFile = null;
          this.snackBar.open('File uploaded successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snack-bar'],
          });
        } else {
          this.uploadStatus =
            'File not uploaded. Server response: ' +
            (response?.error || 'Unknown error');
          this.snackBar.open(
            'File not uploaded. Server response: ' +
              (response?.error || 'Unknown error'),
            'Close',
            {
              duration: 3000,
              panelClass: ['error-snack-bar'],
            }
          );
        }
      },
      error: (error) => {
        // Extract exact error message from backend response
        let errorMessage = 'Unknown error';
        if (error.error && typeof error.error === 'object') {
          errorMessage =
            error.error.error ||
            error.error.detail ||
            error.error.message ||
            'Unknown error';
        } else if (error.error) {
          errorMessage = error.error.toString();
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.uploadStatus = `File not uploaded: ${errorMessage}`; // Prefix with "File not uploaded"
        this.snackBar.open(`File not uploaded: ${errorMessage}`, 'Close', {
          duration: 3000,
          panelClass: ['error-snack-bar'],
        });
        console.log('Full error response:', error); // Debug
      },
      complete: () => {
        console.log('Upload process completed');
      },
    });
  }

  openVerificationForm(seller: any) {
    this.selectedSeller = seller;
    this.additionalNotes = seller.additional_notes || '';
    this.important = seller.important || false;
    // this.entityStatus = seller.entity_status || 'active';
    this.entityStatus =
      (seller.entity_status || 'Micro').charAt(0).toUpperCase() +
      (seller.entity_status || 'Micro').slice(1).toLowerCase();

  }

  verifySeller() {
    if (!this.selectedSeller) return;

    const payload = {
      verified: true,
      important: this.important,
      additional_notes: this.additionalNotes,
      entity_status: this.entityStatus,
    };

    this.http
      .patch(
        `${this.baseUrl}/accounts/verify-seller/${this.selectedSeller.id}/`,
        payload
      )
      .subscribe(
        (response) => {
          this.message = 'Seller data verified successfully!';
          if (this.selectedTabIndex === 1) {
            this.fetchSellerDataUnverified();
          } else {
            this.fetchSellerData(); // Refresh data
          }
          this.selectedSeller = null; // Close form
        },
        (error) => {
          console.error('Error verifying seller data:', error);
        }
      );
  }

  unverifySeller(seller: any) {
    const payload = {
      verified: false,
      important: false,
      additional_notes: '',
    };

    this.http
      .patch(`${this.baseUrl}/accounts/verify-seller/${seller.id}/`, payload)
      .subscribe(
        (response) => {
          this.message = 'Seller data unverified successfully!';
          this.fetchSellerData();
        },
        (error) => {
          console.error('Error unverifying seller data:', error);
        }
      );
  }

  applyFilters() {
    this.filteredData = this.sellerData.filter((seller) => {
      const matchesEmail = this.filter.email
        ? seller?.email?.toLowerCase().includes(this.filter.email.toLowerCase())
        : true;
      const matchesVerified =
        this.filter.verified !== ''
          ? seller.verified === (this.filter.verified === 'true')
          : true;
      const matchesImportant =
        this.filter.important !== ''
          ? seller.important === (this.filter.important === 'true')
          : true;

      return matchesEmail && matchesVerified && matchesImportant;
    });
    this.pageIndex = 0; // Reset to first page
    this.updatePaginatedData(); // Update paginated data after filtering
  }

  handleBuyerData(id: any) {
    this.router.navigate(['buyer-actions'], {
      queryParams: { sid: id },
    });
  }

  resetFilters() {
    this.filter = {
      email: '',
      verified: '',
      important: '',
    };
    this.filteredData = [...this.sellerData];
    this.pageIndex = 0; // Reset to first page
    this.updatePaginatedData(); // Update paginated data after resetting
  }

  viewFeedbackDetails(seller: any) {
    this.selectedFeedback = seller;
  }
}