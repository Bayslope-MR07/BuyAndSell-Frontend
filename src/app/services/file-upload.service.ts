import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  // private baseUrl = 'http://127.0.0.1:8000/api/accounts';
  private baseUrl = 'http://160.153.181.186:8002/api/accounts';
  // private baseUrl ='https://buyandsell-backend.onrender.com/api/accounts';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('access_token')}`
    );

    return this.http.post(`${this.baseUrl}/upload_excel/`, formData, {
      headers,
    });
  }

  uploadEmbedded(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload_embedded/`, formData);
  }
  uploadNDA(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('nda_signed_file', file); // 🔑 Must match backend field name!

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });

    return this.http.post(`${this.baseUrl}/upload-nda/`, formData, { headers });
  }
}
