import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Import MatPaginatorModule

interface BuyerAction {
  buyer_email: string;
  first_name: string;
  last_name: string;
  patent_number: string;
  action: string;
  timestamp: string;
}

@Component({
  selector: 'app-buyer-actions',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatPaginatorModule, // Add MatPaginatorModule
  ],
  templateUrl: './buyer-actions.component.html',
  styleUrls: ['./buyer-actions.component.css'],
})
export class BuyerActionsComponent implements OnInit {
  buyerActions: BuyerAction[] = [];
  uniquePatents: string[] = [];

  uniqueEmails: string[] = [];
  filteredActions: BuyerAction[] = [];
  paginatedActions: BuyerAction[] = []; // New property for paginated data

  // Filter fields
  sid: any;
  emailFilter: string = '';
  actionFilter: string = '';
  patentFilter: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  baseUrl = environment.apiUrl;
  loader: boolean = false;

  // Pagination properties
  pageSize = 10; // Rows per page
  pageIndex = 0; // Current page index

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.sid = params['sid'];
      console.log('Patent ID:', this.sid);
      if (this.sid) {
        this.fetchBuyerActionsById();
      } else {
        this.fetchBuyerActions();
      }
    });
  }

  // Update paginated data based on current page
  updatePaginatedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedActions = this.filteredActions.slice(startIndex, endIndex);
  }

  // Handle page change event
  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  fetchBuyerActions() {
    this.loader = true;
    this.http.get<BuyerAction[]>(`${this.baseUrl}/buyer-actions/`).subscribe({
      next: (data) => {
        this.buyerActions = data;
        this.filteredActions = data;
        this.generateUniqueFilters(); // 👈 generate dropdown options
        this.updatePaginatedData(); // Initialize paginated data
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        console.error('Error fetching data:', error);
      },
    });
  }

  fetchBuyerActionsById() {
    this.loader = true;
    this.http
      .get<BuyerAction[]>(`${this.baseUrl}/buyer-actions/${this.sid}`)
      .subscribe({
        next: (data) => {
          this.buyerActions = data;
          this.filteredActions = data;
          this.generateUniqueFilters(); // 👈 generate dropdown options
          this.updatePaginatedData();
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          console.error('Error fetching data:', error);
        },
      });
  }

  generateUniqueFilters() {
    const allPatents = this.buyerActions.map((action) => action.patent_number);
    const allEmails = this.buyerActions.map((action) => action.buyer_email);

    this.uniquePatents = Array.from(new Set(allPatents)).filter((p) => !!p);
    this.uniqueEmails = Array.from(new Set(allEmails)).filter((e) => !!e);
  }

  applyFilters() {
    this.filteredActions = this.buyerActions.filter((action) => {
      const matchesEmail = this.emailFilter
        ? action.buyer_email.includes(this.emailFilter)
        : true;
      const matchesAction = this.actionFilter
        ? action.action.toLowerCase().includes(this.actionFilter.toLowerCase())
        : true;
      const matchesPatent = this.patentFilter
        ? action.patent_number
            .toLowerCase()
            .includes(this.patentFilter.toLowerCase())
        : true;
      const actionDate = new Date(action.timestamp);
      const fromDate = this.dateFrom ? new Date(this.dateFrom) : null;
      const toDate = this.dateTo ? new Date(this.dateTo) : null;

      const matchesDate =
        (!fromDate || actionDate >= fromDate) &&
        (!toDate || actionDate <= toDate);

      return matchesEmail && matchesAction && matchesPatent && matchesDate;
    });
    this.pageIndex = 0; // Reset to first page
    this.updatePaginatedData(); // Update paginated data after filtering
  }
}