import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-confirm-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.css']
})
export class ConfirmPasswordComponent implements OnInit {
  formData = {
    old_password: '',
    new_password: '',
    confirm_password: ''
  };
  baseUrl:any = environment.apiUrl;
  fromForgotPassword: boolean = false;
  uid: any="";
  token: any= "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if coming from forgot password flow via query param or route data
    this.route.queryParams.subscribe(params => {
      this.fromForgotPassword = params['fromForgot'] === 'true';
      this.uid = params['uid'];
      this.token = params['token'];
    });
  }

  onSubmit() {
    // Validate passwords match
    if (this.formData.new_password !== this.formData.confirm_password) {
      this.toastr.error('New password and confirm password do not match.', 'Error');
      return;
    }

    if (!this.fromForgotPassword && !this.formData.old_password) {
      this.toastr.error('Old password is required.', 'Error');
      return;
    }
    if(this.fromForgotPassword){
      this.authService.resetPassword(this.uid, this.token, this.formData.new_password).subscribe(
        (response) => {
          this.toastr.success("Password reset successful! Redirecting to login...");
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 2000);
        },
        (error) => {
          this.toastr.error("Error: " + error.error.message);
        }
      );
    }
    else{

      this.http.post(`${this.baseUrl}/change-password/`,{old_password:this.formData.old_password,new_password:this.formData.new_password}).subscribe(
        (response: any) => {
          this.toastr.success(response?.message)
          // this.loader=false;
          // console.log(this.submissionStatus)
          this.router.navigateByUrl('login');
        },
        (error) => {
          // this.loader=false;
          this.toastr.error(error?.error?.message)
          console.error('Error fetching buyer data:', error);
        }
      );
    }
    // Here you would typically call an AuthService to update the password
    // console.log('Form Data:', this.formData);
    // this.toastr.success('Password updated successfully!', 'Success');

    // Navigate to login or home after success
    
  }

  goBack() {
    if (this.fromForgotPassword) {
      this.router.navigateByUrl('/otp'); // Back to OTP if from forgot flow
    } else {
      this.router.navigateByUrl('/login'); // Back to login otherwise
    }
  }
}