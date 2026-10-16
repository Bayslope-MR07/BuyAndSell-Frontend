import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExternalDataRow {
  sno: string | null;
  applicationNumber: string | null;
  patentNumber: string | null;
  applicationType: string | null;
  PublicationNumber: string | null;
  PublicationType: string | null;
  status: string | null;
  entityStatus: string | null;
  smallEntityStatus: string | null;
  filingDate: string | null;
  applicantName: string | null;
  inventorBag: string | null;
}

export interface ContactFormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = environment.apiUrl;
  // private baseUrl = 'https://api.sellbuypatent.com/api/accounts';
  // private baseUrl ='https://buyandsell-backend.onrender.com/api/accounts';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('access_token')}`,
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

  sendContactForm(payload: ContactFormPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact/`, payload);
  }
  getFirst100(): Observable<ExternalDataRow[]> {
    return this.http.get<ExternalDataRow[]>(`${this.baseUrl}/external-data/`);
  }
}

