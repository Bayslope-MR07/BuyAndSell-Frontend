import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-google-callback',
  standalone: false,
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.css'
})
export class GoogleCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.exchangeCodeForTokens(code);
      } else {
        console.error('Authorization code not found');
        this.router.navigate(['/']);
      }
    });
  }

  exchangeCodeForTokens(code: string): void {
    // const url = 'http://localhost:8000/api/v1/auth/google/';
    const url = 'https://buyandsell-backend.onrender.com/api/v1/auth/google/';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Skip-Auth-Interceptor': 'true'});

    this.http.post(url, { code }, { headers })
      .subscribe({
        next: (response: any) => {
          // Handle successful login
          // this.message = 'Login successful!';
          localStorage.setItem('access_token', response.access_token); // Save access token
          localStorage.setItem('refresh_token', response.refresh_token); // Save refresh token
          localStorage.setItem('is_admin', response.is_admin);
          localStorage.setItem('userData', JSON.stringify(response));
  
          // Store user data for display
          // this.userData = {
          //   first_name: response.first_name,
          //   last_name: response.last_name,
          //   email: response.email,
          // };
  
          // console.log('User Data:', this.userData); // Log user data to the console
  
          // Show success toast message once
          this.toastr.success('Login Successful!', 'Success');
  
          // Navigate based on user role
          if (response.is_admin === true) {
            this.router.navigate(['/admin']);
          } else {
            const userType = response.user_type;
            if (userType === 'Seller') {
              this.router.navigate(['/user-seller-data']);
            } else if (userType === 'Buyer') {
              this.router.navigate(['/buyer']);
            } else {
              this.router.navigate(['/buyer']); // Default fallback
            }
          }
        },
        error: (error) => {
          // Handle errors
          if (error.error) {
            for (const key in error.error) {
              if (error.error.hasOwnProperty(key)) {
                this.toastr.error(`${key}: ${error.error[key].join(' ')}`);
              }
            }
          }
          // this.message = 'Invalid email or password.';
          // this.toastr.error('Invalid email or password.', 'Error');
          console.error('Login Error:', error); // Log error details
        },
      });
  }
}
