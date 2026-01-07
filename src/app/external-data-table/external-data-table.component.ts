import { Component, OnInit } from '@angular/core';
import { ExternalDataRow, FileUploadService } from '../services/file-upload.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-external-data-table',
  standalone: true, // ✅ FIX
  imports: [MatIconModule,CommonModule],
  templateUrl: './external-data-table.component.html',
  styleUrls: ['./external-data-table.component.css'],
})
export class ExternalDataTableComponent implements OnInit {
  rows: ExternalDataRow[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private externalDataService: FileUploadService,
    private router: Router
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
    this.router.navigate(['/buyer']); // Navigate back to the list of cases
  }
}