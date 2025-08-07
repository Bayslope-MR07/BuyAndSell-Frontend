import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formData = {
    email: '',
    password: '',
    user_type: '', // No default, will use backend response
  };

  message: string = '';
  userData: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Get user_type from URL query parameter if available
    this.route.queryParams.subscribe((params) => {
      if (params['user_type']) {
        this.formData.user_type = params['user_type'];
      }
    });
  }

  goToSignUp() {
    this.router.navigateByUrl(
      `signup?user_type=${this.formData.user_type || 'Buyer'}`
    );
  }

  goForgot() {
    this.router.navigateByUrl('forgot');
  }

  googleCallback() {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      environment.GOOGLE_CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(
      'https://bas-3nw9.onrender.com/google-callback'
    )}&response_type=code&scope=openid%20email%20profile%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=consent`;
    console.log('Redirecting to Google:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  }

  onSubmit() {
    this.authService.login(this.formData).subscribe({
      next: (response: any) => {
        this.message = 'Login successful!';
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('is_admin', response.is_admin);
        localStorage.setItem('userData', JSON.stringify(response));

        this.userData = {
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
          user_type: response.user_type,
          has_filled_seller_form: response.has_filled_seller_form || false,
        };

        this.toastr.success('Login Successful!', 'Success');

        if (response.is_admin === true) {
          this.router.navigate(['/admin']);
        } else {
          const userType = response.user_type;
          if (userType === 'Seller' || userType === 'Both') {
            if (this.userData.has_filled_seller_form) {
              this.router.navigate(['/user-seller-data']);
            } else {
              this.router.navigate(['/seller']);
            }
          } else if (userType === 'Buyer') {
            this.router.navigate(['/buyer']);
          } else {
            this.router.navigate(['/buyer']);
          }
        }
      },
      error: (error) => {
        console.error('Login Error:', error);
        this.toastr.error('Login failed'); // Default message
        if (error.error) {
          for (const key in error.error) {
            if (error.error.hasOwnProperty(key)) {
              this.toastr.error(`${key}: ${error.error[key].join(' ')}`); // Specific errors
            }
          }
        }
        this.message = 'Invalid email or password.';
      },
    });
  }
}
