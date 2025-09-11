import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-buyer-details',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ProfileHeaderComponent,
    FooterComponent,
    MatProgressSpinnerModule,
    
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FooterComponent
  ],
  templateUrl: './buyer-details.component.html',
  styleUrls: ['./buyer-details.component.css'],
})
export class BuyerDetailsComponent implements OnInit {
  patentId: number | undefined;
  showFullAbstract = false;
  showFullClaim = false;
  showFullConcepts = false;
  patentDetails: any;
  userFeedback: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.patentId = +params['patentId']; // Get patentId from route params
      this.fetchPatentDetails();
    });
  }

  fetchPatentDetails() {
    const token = localStorage.getItem('access_token'); // Retrieve token from local storage
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http
      .get(
        `https://buyandsell-backend.onrender.com/api/accounts/buyer-data/${this.patentId}/`,
        // `http://127.0.0.1:8000/api/accounts/buyer-data/${this.patentId}/`,

        { headers }
      )
      .subscribe(
        (response: any) => {
          this.patentDetails = response;
          this.userFeedback = response.user_feedback; // Store patent details
        },
        (error) => {
          console.error('Error fetching patent details:', error);
        }
      );
  }

  backToBuyer() {
    this.router.navigate(['/buyer']);
  }

  downloadAsExcel(): void {
    if (!this.patentDetails) return;

    const data = {
      'Portfolio Code': this.patentDetails.portfolio_code,
      // 'Patent No.': this.patentDetails.patent_number,
      'Industry': this.patentDetails.industry,
      'Tech Domain': this.patentDetails.tech_domain,
      'Priority Date': this.patentDetails.priority,
      'Expiry Date': this.patentDetails.expiry,
      // Expiry: this.patentDetails.expiry,
      'Number of Patents': this.patentDetails.number_of_patents,
      'Number of Patent Family': this.patentDetails.number_of_patent_families,
      'Acquisition Status': this.patentDetails.acquisition_status,
      'Relevant Companies': this.patentDetails.relevant_companies,
      'Market Relevance': this.patentDetails.market_relevance,
      'Bay Rating': this.patentDetails.bay_overall_rating,
      'Enforceability': this.patentDetails.enforceability,
      'Patent No.': this.patentDetails.parent_patent_number,
      'Title': this.patentDetails.title,
      'Entity Status': this.patentDetails.entity_status,
      'Upcoming Fees': this.patentDetails.upcoming_fees_uspto,

      'Abstract': this.patentDetails.abstract,
      'First Claim': this.patentDetails.first_claim,
      'Filing Date': this.patentDetails.filing_date,
      'Grant Date': this.patentDetails.grant_date,
      'Current Assignee': this.patentDetails.current_assignee,
      'IP Type': this.patentDetails.ip_type,
      'Technology Concepts': this.patentDetails.concepts,
      'Technology Keywords': this.patentDetails.keywords,
      'Contact': this.patentDetails.phone,
      'Email': this.patentDetails.email,
      'Spoc Company': this.patentDetails.spoc_company,
      'Selling Interest': this.patentDetails.seller_interest,
      'Encumbrances': this.patentDetails.encumbrances,
      'Seller Jurisdiction': this.patentDetails.seller_jurisdiction,
      'Reason of Selling': this.patentDetails.reason_of_selling,
    };

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([data]);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Buyer Details': worksheet },
      SheetNames: ['Buyer Details'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'buyer-details');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}.xlsx`);
  }
}