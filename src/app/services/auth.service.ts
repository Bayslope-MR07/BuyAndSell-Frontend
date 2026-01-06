import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import {
  Observable,
  of,
  throwError,
  switchMap,
  catchError,
  tap,
  finalize,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  /* =====================================================
     🔐 CSRF INITIALIZATION (MANDATORY)
  ===================================================== */
  initCsrf(): Observable<any> {
    return this.http.get(`${this.baseUrl}/csrf/`, {
      withCredentials: true,
    });
  }

  /* =====================================================
     🔐 AUTH APIs
  ===================================================== */

  signUp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup/`, data, {
      withCredentials: true,
      headers: { 'Skip-Auth-Interceptor': 'true' },
    });
  }

  google_signUp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/google-signup/`, data, {
      withCredentials: true,
      headers: { 'Skip-Auth-Interceptor': 'true' },
    });
  }

  login(data: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/login/`, data, {
        withCredentials: true,
        headers: { 'Skip-Auth-Interceptor': 'true' },
      })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('is_admin', response.is_admin);
          localStorage.setItem('userData', JSON.stringify(response));
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<string> {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<any>(
        `${this.baseUrl}/token/refresh/`,
        { refresh },
        {
          withCredentials: true,
          headers: { 'Skip-Auth-Interceptor': 'true' },
        }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
        }),
        switchMap((res) => of(res.access)),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        })
      );
  }

  /* =====================================================
     🔐 PASSWORD APIs
  ===================================================== */

  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/forgot-password/`,
      { email },
      { withCredentials: true, headers: { 'Skip-Auth-Interceptor': 'true' } }
    );
  }

  resetPassword(
    uid: string,
    token: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reset-password/`,
      { uid, token, new_password: newPassword },
      { withCredentials: true }
    );
  }

  /* =====================================================
     🔐 LOGOUT
  ===================================================== */

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    });

    return this.http
      .post(
        `${this.baseUrl}/logout/`,
        { refresh_token: localStorage.getItem('refresh_token') },
        { headers, withCredentials: true }
      )
      .pipe(
        finalize(() => {
          this.clearSession();
          this.router.navigate(['/'], { replaceUrl: true });
        })
      );
  }

  clearSession(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  isAdminUser(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }

  /* =====================================================
     🔐 AUTHENTICATED BUSINESS APIs
  ===================================================== */

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
  }

  buyerForm(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/accounts/buyer_form_submission/`,
      data,
      { headers: this.authHeaders(), withCredentials: true }
    );
  }

  sellerForm(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/accounts/seller_form_submission/`,
      data,
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Skip-Auth-Interceptor': 'true', // 👈 interceptor ko hint
        }),
      }
    );
  }

  getBuyerMatches(buyerId: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/accounts/buyers/${buyerId}/matches/`,
      { headers: this.authHeaders(), withCredentials: true }
    );
  }

  uploadMainExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/accounts/upload_excel/`, formData, {
      headers: this.authHeaders(),
      withCredentials: true,
    });
  }
}
