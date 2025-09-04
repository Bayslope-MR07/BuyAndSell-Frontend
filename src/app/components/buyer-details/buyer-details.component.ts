import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-buyer-details',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ProfileHeaderComponent,
    FooterComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './buyer-details.component.html',
  styleUrls: ['./buyer-details.component.css'],
})
export class BuyerDetailsComponent implements OnInit {
  patentId: number | undefined;
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
      'Patent No.': this.patentDetails.patent_number,
      'Tech Domain': this.patentDetails.tech_domain,
      Expiry: this.patentDetails.expiry,
      'Acquisition Status': this.patentDetails.acquisition_status,
      Feedback: this.userFeedback?.action,
      'Bay Rating': this.patentDetails.bay_overall_rating,
      'Market Relevance': this.patentDetails.market_relevance,
      Enforceability: this.patentDetails.enforceability,
      Targets: this.patentDetails.target,
      'Entity Status': this.patentDetails.entity_status,
      'Upcoming Fees': this.patentDetails.upcoming_fees,
      Title: this.patentDetails.title,
      Abstract: this.patentDetails.abstract,
      'First Claim': this.patentDetails.first_claim,
      'Filing Date': this.patentDetails.filing_date,
      'Grant Date': this.patentDetails.grant_date,
      'Current Assignee': this.patentDetails.current_assignee,
      'IP Type': this.patentDetails.ip_type,
      'Technology Concepts': this.patentDetails.concepts,
      'Technology Keywords': this.patentDetails.keywords,
      'Admin Contact': this.patentDetails.admin_contact,
      'Admin Email': this.patentDetails.admin_email,
      'Spoc Company': this.patentDetails.spoc_company,
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