// signup.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { gapi } from 'gapi-script';  // Import Google API
import { environment } from '../../../environments/environment';
import {MatButtonModule} from '@angular/material/button';
import {ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('mandatoryFieldsModal') mandatoryFieldsModal!: ElementRef;
  formData = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    user_type: ''
  };

  message: string = '';

  googleUserData: any = null;  // Store Google user details

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}
  
  ngOnInit() {
    this.initGoogleAuth();
  }

  openModal() {
    this.modalService.open(this.mandatoryFieldsModal, { backdrop: 'static', keyboard: false });
  }

  closeModal() {
    this.formData = {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      user_type: ''
    };
    this.modalService.dismissAll();
  }

  // Google Sign-In Initialization
  initGoogleAuth() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: environment.GOOGLE_CLIENT_ID,
        cookiepolicy: 'single_host_origin',
        prompt: 'select_account',
        scope: 'profile email'
      });
    });
  }

  loginPage(){
    this.router.navigateByUrl('login');
  }

  async googleSignup() {
    const auth2 = gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();

    if (googleUser) {
      const profile = googleUser.getBasicProfile();
      const idToken = googleUser.getAuthResponse().id_token;  // ✅ Get Google Token
  
      this.googleUserData = {
        first_name: profile.getGivenName(),
        last_name: profile.getFamilyName(),
        email: profile.getEmail(),
        token: idToken  
      };
  

      // Show additional fields for phone number and user type
      this.openModal()
    }
  }

  google_complete_signup(){
    const userData = {
      ...this.googleUserData, // Merge Google Data
      phone_number: this.formData.phone_number,
      user_type: this.formData.user_type
    };

    this.authService.google_signUp(userData).subscribe(
      response => {
        this.toastr.success('Sign-up successful! Redirecting to login...');
        this.message = 'Sign-up successful! Redirecting to login...';
        this.closeModal()
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error => {
        if (error.error) {
          // console.log(error.error)
          this.closeModal()
          this.toastr.error(error?.error?.message);
        }
        this.message = 'Error during sign-up. Please try again.';
        console.error('Signup failed', error);
      }
    );
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.authService.signUp(this.formData).subscribe(
        response => {
          this.toastr.success('Sign-up successful! Redirecting to login...');
          this.message = 'Sign-up successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error => {
          if (error.error) {
            for (const key in error.error) {
              if (error.error.hasOwnProperty(key)) {
                this.toastr.error(`${key}: ${error.error[key].join(' ')}`);
              }
            }
          }
          this.message = 'Error during sign-up. Please try again.';
          console.error(error);
        }
      );
    }
  }
}

// Add this custom directive for password matching
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[match]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MatchDirective, multi: true }]
})
export class MatchDirective implements Validator {
  @Input('match') matchValue: string = '';

  validate(control: AbstractControl): { [key: string]: any } | null {
    return control.value !== this.matchValue ? { 'mismatch': true } : null;
  }
}