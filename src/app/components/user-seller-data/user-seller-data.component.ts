import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-user-seller-data',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ProfileHeaderComponent,
    MatProgressSpinnerModule,
    FooterComponent,
    MatPaginatorModule // Added MatPaginatorModule
  ],
  templateUrl: './user-seller-data.component.html',
  styleUrls: ['./user-seller-data.component.css'],
})
export class UserSellerDataComponent implements OnInit {
  baseUrl = environment.apiUrl;
  sellerData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = []; // Added for pagination
  selectedSeller: any = null;
  selectedFeedback: any = null;
  message: string = '';
  important: boolean = false;
  additionalNotes: string = '';
  entityStatus: string = 'active';
  acquisitionStatus: string = 'open';
  bayRating: string = 'medium';
  enforceability: string = 'medium';
  target: string = '';
  companyName: string = '';
  adminContact: string = '';
  adminEmail: string = '';
  upcomingFees: string = '';
  title: string = '';
  abstract: string = '';
  firstClaim: string = '';
  filingDate: Date | null = null;
  grantDate: Date | null = null;
  currentAssignee: string = '';
  ipType: string = '';
  familyMembers: string = 'single';
  concepts: string = '';
  keywords: string = '';
  technologies: string = '';
  patent_number: string = '';
  filter: any = {
    email: '',
    verified: '',
    important: '',
  };
  selectedFile: File | null = null;
  uploadStatus: string = '';
  showFilterAndTable: boolean = false;
  loader: boolean = true;
  pageSize = 10; // Added for pagination
  pageIndex = 0; // Added for pagination

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchSellerData();
  }

  // Added method to update paginated data
  updatePaginatedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  // Added method to handle page events
  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  logout() {
    this.router.navigateByUrl('login');
  }

  sellerForm() {
    this.router.navigateByUrl('seller');
  }

  buyer() {
    this.router.navigate(['/buyer']);
  }

  fetchSellerData() {
    this.loader = true;
    this.http.get(`${this.baseUrl}/user-seller-data/`).subscribe(
      (response: any) => {
        this.sellerData = response.data;
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

  openVerificationForm(seller: any) {
    this.selectedSeller = seller;
    this.additionalNotes = seller.additional_notes || '';
    this.important = seller.important || false;
    this.entityStatus = seller.entity_status || 'active';
    this.acquisitionStatus = seller.acquisition_status || 'open';
    this.bayRating = seller.bay_rating || 'medium';
    this.enforceability = seller.enforceability || 'medium';
    this.target = seller.target || '';
    this.companyName = seller.company_name || '';
    this.adminContact = seller.admin_contact || '';
    this.adminEmail = seller.admin_email || '';
    this.upcomingFees = seller.upcoming_fees || '';
    this.title = seller.title || '';
    this.abstract = seller.abstract || '';
    this.firstClaim = seller.first_claim || '';
    this.filingDate = seller.filing_date || null;
    this.grantDate = seller.grant_date || null;
    this.currentAssignee = seller.current_assignee || '';
    this.ipType = seller.ip_type || '';
    this.familyMembers = seller.family_members || 'single';
    this.concepts = seller.concepts || '';
    this.keywords = seller.keywords || '';
    this.technologies = seller.technologies || '';
  }

  verifySeller() {
    if (!this.selectedSeller) return;

    const payload = {
      verified: true,
      important: this.important,
      additional_notes: this.additionalNotes,
      entity_status: this.entityStatus,
      acquisition_status: this.acquisitionStatus,
      bay_rating: this.bayRating,
      enforceability: this.enforceability,
      target: this.target,
      company_name: this.companyName,
      admin_contact: this.adminContact,
      admin_email: this.adminEmail,
      upcoming_fees: this.upcomingFees,
      title: this.title,
      abstract: this.abstract,
      first_claim: this.firstClaim,
      filing_date: this.filingDate,
      grant_date: this.grantDate,
      current_assignee: this.currentAssignee,
      ip_type: this.ipType,
      family_members: this.familyMembers,
      concepts: this.concepts,
      keywords: this.keywords,
      technologies: this.technologies,
    };

    this.http
      .patch(
        // `http://127.0.0.1:8000/api/accounts/user-seller-data/${this.selectedSeller.id}/`,
        `https://api.sellbuypatent.com/api/accounts/user-seller-data/${this.selectedSeller.id}/`,
        // `https://buyandsell-backend.onrender.com/api/accounts/user-seller-data/${this.selectedSeller.id}/`,

        payload
      )
      .subscribe(
        (response) => {
          this.message = 'Seller data verified successfully!';
          this.fetchSellerData();
          this.selectedSeller = null;
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
      .patch(
        // `http://127.0.0.1:8000/api/accounts/user-seller-data/${seller.id}/`,
        `https://api.sellbuypatent.com/api/accounts/user-seller-data/${seller.id}/`,
        // `https://buyandsell-backend.onrender.com/api/accounts/user-seller-data/${seller.id}/`,
        payload
      )
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
    console.log(this.filter.email, "sdfg");
    this.filteredData = this.sellerData.filter((seller) => {
      const matchesEmail = this.filter.email.trim()
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
    this.pageIndex = 0; // Reset to first page after filtering
    this.updatePaginatedData(); // Update paginated data
  }

  resetFilters() {
    this.filter = {
      email: '',
      verified: '',
      important: '',
    };
    this.filteredData = [...this.sellerData];
    this.pageIndex = 0; // Reset to first page
    this.updatePaginatedData(); // Update paginated data
  }

  viewFeedbackDetails(seller: any) {
    this.selectedFeedback = seller;
  }

  toggleFilterAndTable() {
    this.showFilterAndTable = !this.showFilterAndTable;
  }
}