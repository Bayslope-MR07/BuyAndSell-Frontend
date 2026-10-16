import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nda-upload',
  standalone: false,
  templateUrl: './nda-upload.component.html',
  styleUrls: ['./nda-upload.component.css'],
})
export class NdaUploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  // private baseUrl = 'http://127.0.0.1:8000/api/accounts';
  private baseUrl =
    'https://bp6fqe0ma0.execute-api.us-east-1.amazonaws.com/buysell/dev/api/accounts';
  // private baseUrl = 'https://api.sellbuypatent.com/api/accounts';
  // private baseUrl = 'https://buyandsell-backend.onrender.com/api/accounts';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  uploadNDA() {
    if (!this.selectedFile) {
      this.toastr.error('Please select your signed NDA to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('nda_signed_file', this.selectedFile); // 👈 match Django field

    const token = localStorage.getItem('access_token');
    this.uploading = true;

    this.http
      .post(`${this.baseUrl}/upload-nda/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success('✅ NDA Uploaded. Awaiting admin approval.');
          this.router.navigate(['/pending-verification']);
        },
        error: (err) => {
          this.uploading = false;
          console.error(err);
          this.toastr.error('🚫 Upload failed. Please try again.');
        },
      });
  }
}
