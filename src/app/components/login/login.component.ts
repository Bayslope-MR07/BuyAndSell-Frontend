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
  showBuyerPopup: boolean = false;
  showSellerPopup: boolean = false;

  formData = {
    email: '',
    password: '',
    user_type: '',
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
          has_filled_seller_form: response.has_filled_seller_form ?? false,
          has_filled_buyer_form: response.has_filled_buyer_form ?? false,
          // is_verified: response.is_verified ?? false,
        };

        this.toastr.success('Login Successful!', 'Success');

        // 👨‍💼 Admin
        if (response.is_admin === true) {
          this.router.navigate(['/admin']);
          return;
        }

        const userType = response.user_type;

        // 👨‍🏫 Seller or Both
        if (userType === 'Seller' || userType === 'Both') {
          if (this.userData.has_filled_seller_form) {
            this.router.navigate(['/user-seller-data']);
          } else {
            this.router.navigate(['/seller']);
          }
          return;
        }

        // 👤 Buyer Login Logic
        if (userType === 'Buyer') {
          // ❌ If not verified, go to NDA upload
          if (!this.userData.is_verified) {
            this.router.navigate(['/buyer']);
            return;
          }

          // ✅ Verified Buyer
          if (!this.userData.has_filled_buyer_form) {
            const skipped = localStorage.getItem('buyerFormSkipped');
            if (skipped === 'true') {
              this.router.navigate(['/buyer']);
            } else {
              this.showBuyerPopup = true;
            }
          } else {
            this.router.navigate(['/buyer']);
          }

          return;
        }

        // Default fallback
        this.router.navigate(['/buyer']);
      },
      error: (error) => {
        console.error('Login Error:', error);
        this.toastr.error('Login failed ❌');

        if (
          error.status === 403 &&
          error.error.error.includes('Not verified')
        ) {
          // NDA upload required
          this.message = 'You are not verified. Please upload signed NDA.';
          // Redirect or show NDA upload modal/page
          this.router.navigate(['/nda-upload'], {
            queryParams: { email: this.formData.email },
          });
          return;
        }

        /*
      // Commented out invalid email/password error handling
      if (error.error) {
        for (const key in error.error) {
          if (error.error.hasOwnProperty(key)) {
            this.toastr.error(`${key}: ${error.error[key].join(' ')}`);
          }
        }
      }

      this.message = 'Invalid email or password.';
      */
      },
    });
  }

  goToBuyerForm() {
    this.showBuyerPopup = false;
    this.router.navigate(['/buyerform']);
  }

  skipBuyerForm() {
    this.showBuyerPopup = false;
    localStorage.setItem('buyerFormSkipped', 'true');
    this.router.navigate(['/buyer']);
  }
}
