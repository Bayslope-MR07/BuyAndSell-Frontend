import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  
  constructor(
    private router:Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private http: HttpClient){}
  email:any=""
 backLogin(){
  this.router.navigateByUrl('login');
 }
 otpSend(){
  if (this.email) {
    // const email = email;
    this.authService.forgotPassword(this.email).subscribe(
      (response) => {
        this.toastr.success("Password reset email sent! Check your inbox.");
        this.email=""
      },
      (error) => {
        this.toastr.error("Error: " + error.error.message);
      }
    );
  }
  // this.router.navigateByUrl('otp');

 }

}
