import { Component, OnInit } from '@angular/core';
import {
  ExternalDataRow,
  FileUploadService,
} from '../services/file-upload.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
// import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-external-data-table',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './external-data-table.component.html',
  styleUrls: ['./external-data-table.component.css'],
})
export class ExternalDataTableComponent implements OnInit {
  rows: ExternalDataRow[] = [];
  loading = true;
  errorMessage: string | null = null;

  apiUrl = environment.apiUrl; // 👈 base API URL

  constructor(
    private externalDataService: FileUploadService,
    private router: Router,
    private http: HttpClient, // 👈 inject HttpClient
    private toastr: ToastrService // 👈 inject Toastr
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = null;

    this.externalDataService.getFirst100().subscribe({
      next: (data) => {
        this.rows = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error while fetching data';
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/buyer']);
  }

reachOut(row: any) {
  // DB/serializer field name
  const patentNumber = row.patentNumber;   

  if (!patentNumber) {
    this.toastr.error('Patent number not found for this row.');
    return;
  }

  if (!confirm(`Do you want to reach out for patent: ${patentNumber}?`)) {
    return;
  }

  this.http
    .post(
      `${this.apiUrl}/reach-out/`,       
      { patentNumber },                  
      { withCredentials: true }
    )
    .subscribe({
      next: () => {
        this.toastr.success(
          'An email has been sent to your registered email address.'
        );
      },
      error: (err) => {
        console.error('Reach-out error:', err);
        this.toastr.error('Could not send email. Please try again.');
      },
    });
}
}
