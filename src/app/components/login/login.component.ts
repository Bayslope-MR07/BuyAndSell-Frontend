import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Import necessary modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formData = {
    email: '',
    password: '',
  };

  message: string = '';
  userData: any = null; // To store user data from backend

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  goToSignUp() {
    this.router.navigateByUrl('signup');
  }

  goForgot() {
    this.router.navigateByUrl('forgot');
  }

  googleCallback(){
    window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${environment.GOOGLE_CALLBACK_URI}&prompt=consent&response_type=code&client_id=${environment.GOOGLE_CLIENT_ID}&scope=openid%20email%20profile&access_type=offline`;
  }
  onSubmit() {
    this.authService.login(this.formData).subscribe({
      next: (response: any) => {
        // Handle successful login
        this.message = 'Login successful!';
        localStorage.setItem('access_token', response.access_token); // Save access token
        localStorage.setItem('refresh_token', response.refresh_token); // Save refresh token
        localStorage.setItem('is_admin', response.is_admin);
        localStorage.setItem('userData', JSON.stringify(response));

        // Store user data for display
        this.userData = {
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
        };

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
        this.message = 'Invalid email or password.';
        // this.toastr.error('Invalid email or password.', 'Error');
        console.error('Login Error:', error); // Log error details
      },
    });
  }
}