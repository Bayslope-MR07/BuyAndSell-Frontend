import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  first,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  toArray,
  tap,
  throwError,
  merge,
  concat,
  finalize
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl; // Adjust based on your backend URL
  private token: string = '';
  private isAdmin: boolean = false;
  constructor(private http: HttpClient, private router: Router) {}

  // Function to get the CSRF token from the browser cookies (if it's set)
  private getCsrfToken(): string {
    const csrfToken = document.cookie
      .split(';')
      .find((cookie) => cookie.trim().startsWith('csrftoken='));
    return csrfToken ? csrfToken.split('=')[1] : '';
  }

  signUp(data: any): Observable<any> {
    const csrfToken = this.getCsrfToken();
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Skip-Auth-Interceptor': 'true',
    });
    return this.http.post(`${this.baseUrl}/signup/`, data, { headers });
  }
  google_signUp(data: any): Observable<any> {
    const csrfToken = this.getCsrfToken();
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Skip-Auth-Interceptor': 'true',
    });
    return this.http.post(`${this.baseUrl}/google-signup/`, data, { headers });
  }

  login(data: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/login/`, data, {
        headers: { 'Skip-Auth-Interceptor': 'true' }, // Custom header to signal interceptor to skip
      })
      .pipe(
        tap((response: any) => {
          if (response) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            localStorage.setItem('is_admin', response.is_admin);
            localStorage.setItem('userData', JSON.stringify(response)); // Store all response data
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<string> {
    const endpoint = `${this.baseUrl}/token/refresh/`;
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<any>(
        endpoint,
        { refresh: refreshToken },
        {
          headers: { 'Skip-Auth-Interceptor': 'true' }, // Custom header to signal interceptor to skip
        }
      )
      .pipe(
        switchMap((response) => {
          if (response && response.access) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            return of(response.access);
          } else {
            this.logout();
            return throwError(() => new Error('Invalid refresh response'));
          }
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    return this.http.post<any>(`${this.baseUrl}/forgot-password/`, formData);
  }

  resetPassword(
    uid: string,
    token: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password/`, {
      uid: uid,
      token: token,
      new_password: newPassword,
    });
  }
  // ... (other imports and code remain same)

  logout(): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken || ''}`,
    });

    const body = {
      refresh_token: refreshToken || '',
    };

    return this.http.post(`${this.baseUrl}/logout/`, body, { headers }).pipe(
      finalize(() => {
        this.clearSession();
        this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
          window.history.pushState(null, '', '/login');
          window.onpopstate = () => {
            window.history.pushState(null, '', '/login');
          };
        });
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        this.clearSession();
        this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
          window.history.pushState(null, '', '/login');
          window.onpopstate = () => {
            window.history.pushState(null, '', '/login');
          };
        });
        return throwError(() => error);
      })
    );
  }

  clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('userData');
  }

  // clearSession(): void {
  //   localStorage.removeItem('access_token');
  //    // Remove the token from local storage

  // }
  isAdminUser() {
    return localStorage.getItem('is_admin') === 'true';
  }
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
  // Inside your AuthService
  loginUser(credentials: any) {
    // Make an API call to authenticate the user
    this.http
      .post('your-login-endpoint', credentials)
      .subscribe((response: any) => {
        localStorage.setItem('token', response.access_token);
        const expiryDate = new Date(
          new Date().getTime() + response.expires_in * 1000
        ); // Assuming expires_in is in seconds
        localStorage.setItem('token_expiry', expiryDate.toString());
      });
  }

  buyerForm(data: any): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(
      `${this.baseUrl}/accounts/buyer_form_submission/`,
      data,
      { headers }
    );
  }

  sellerForm(data: any): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(
      `${this.baseUrl}/accounts/seller_form_submission/`,
      data,
      { headers }
    );
  }

  getBuyerMatches(buyerId: number): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(
      `${this.baseUrl}/accounts/buyers/${buyerId}/matches/`,
      { headers }
    );
  }
  uploadMainExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/accounts/upload_excel/`, formData);
  }

  
}
