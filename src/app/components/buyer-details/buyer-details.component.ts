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
import { environment } from '../../../environments/environment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-buyer-details',
  standalone: true,
  imports: [
    // autoTable,
    // jsPDF,
    FormsModule,
    CommonModule,
    ProfileHeaderComponent,
    FooterComponent,
    MatProgressSpinnerModule,

    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FooterComponent,
  ],
  templateUrl: './buyer-details.component.html',
  styleUrls: ['./buyer-details.component.css'],
})
export class BuyerDetailsComponent implements OnInit {
  apiUrl = environment.apiUrl;
  baseUrl: any = environment.apiUrl;

  patentId: number | undefined;
  showFullAbstract = false;
  showFullClaim = false;
  showFullConcepts = false;
  patentDetails: any;
  userFeedback: any;
  // apiUrl: any;

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
      .get(`${this.apiUrl}/buyer-data/${this.patentId}/`, { headers })
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

  downloadAsPDF(): void {
    if (!this.patentDetails) return;

    const p = this.patentDetails;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text('Buyer Details Report', 14, 20);

    // All sections from your HTML page
    const sections = [
      [
        'Portfolio Overview',
        [
          ['Portfolio Code', p.portfolio_code],
          ['Industry', p.industry],
          ['Tech Domain', p.tech_domain],
          ['Technology Tags', p.technology_tags],
          ['Portfolio Coverage', p.portfolio_coverage],
          ['No. of Patents', p.number_of_patents],
          ['No. of Patent Families', p.number_of_patent_families],
          ['Patent Geographies', p.patent_geographies],
          ['SEP Patent', p.sep_patent],
          ['Any Open Continuation?', p.any_ongoing_continuation],
          ['Portfolio Sold Before?', p.portfolio_sold_before],
          ['Upcoming Fees', p.upcoming_fees],
          ['Patents Status', p.patents_status],
        ],
      ],
      [
        'Seller Overview',
        [
          ['Seller Entity', p.seller_entity],
          ['Seller Entity Status', p.seller_entity_status],
          ['Seller Country', p.seller_country],
          ['Monetization Preference', p.monetization_preference],
          ['Monetization Strategy Preference', p.monetization_strategy],
          ['Willingness to Negotiate', p.willingness_to_negotiate],
          ['Encumbrances', p.encumbrances],
          ['Previous Selling/Licensing History', p.previous_history_selling],
        ],
      ],
      [
        'Diligence Overview',
        [
          ['Diligence Material', p.diligence_material],
          ['Number of Relevant Companies', p.number_of_relevant_companies],
          ['Relevant Companies', p.relevant_companies],
          ['Number of Charts', p.number_of_charts],
          ['Patent Product Matrix', p.product_matching],
          ['Standard Mapping', p.standard_mapping],
          ['Product Categories', p.product_categories],
          ['Market Size of Products', p.market_size],
          ['Landmark Litigation in Space', p.current],
        ],
      ],
      [
        'Analysis',
        [
          ['Timeline to Receive Offer', p.timeline_offer],
          ['Comments', p.comments],
          ['Acquisition Status', p.acquisition_status],
          ['Bay Rating', p.portfolio_rating],
          ['Buying Options', p.buying_options],
        ],
      ],
      [
        'SPOC Details',
        [
          ['Phone', p.phone],
          ['Email', p.email],
          ['SPOC Company', p.spoc_company],
        ],
      ],
    ];

    // Loop through each section and add as a styled table
    let y = 30;
    sections.forEach(([title, rows]) => {
      doc.setFontSize(13);
      doc.setTextColor(0, 102, 204);
      doc.text(title as string, 14, y);

      (autoTable as any)(doc, {
        startY: y + 5,
        head: [['Field', 'Value']],
        body: rows as any,
        theme: 'striped',
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 10,
          cellPadding: 2,
          overflow: 'linebreak',
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: 'bold' },
          1: { cellWidth: 110 },
        },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    });

    // Footer
    const today = new Date().toLocaleString();
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated on: ${today}`, 14, 285);
    doc.text('© BayPatents Report', 160, 285);

    // Save the PDF
    doc.save('buyer-details.pdf');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}.xlsx`);
  }
  forceDownload(url: string, filename?: string): void {
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      filename || url.split('/').pop() || 'file.xlsx'
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  downloadAllFiles(): void {
    if (!this.patentDetails?.zip_files) {
      alert('No ZIP file found!');
      return;
    }
    const url = this.patentDetails.zip_files;
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop() || 'portfolio.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  confirmDownloadAndSendEmail(analysisSheetUrl: string, portfolioId: number) {
    const fileName = decodeURIComponent(
      analysisSheetUrl.split('/').pop() || ''
    );

    const confirmed = confirm(
      'Are you sure you want to access the diligence material for this portfolio?\n\nIf yes, click OK to proceed — an invoice will be generated and sent on your email.'
    );

    if (!confirmed) {
      console.log('❌ Download cancelled.');
      return;
    }

    // --> API Call: Send Invoice Email to logged-in user
    const token = localStorage.getItem('access_token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.http
      .post(
        `${this.baseUrl}/send-analysis-email/`,
        {
          portfolio_id: portfolioId,
        },
        { headers }
      )
      .subscribe({
        next: () => {
          console.log('✅ Invoice email sent.');

          // Now open the analysis sheet in new tab
          window.open(analysisSheetUrl, '_blank');
        },
        error: (err) => {
          console.error('❌ Failed to send email:', err);
          alert('Something went wrong. Email not sent.');
        },
      });
  }
}