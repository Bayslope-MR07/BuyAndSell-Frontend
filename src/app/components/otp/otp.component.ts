import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp',
  standalone: true, // Changed to true since we're importing modules
  imports: [FormsModule, CommonModule], // Required for ngModel and form handling
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent {
  otp: string[] = ['', '', '', '']; // Array to store OTP digits

  constructor(private router: Router) {}

  // Move to the next input field when a digit is entered
  moveToNext(event: Event, currentId: string, nextId: string | null) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextId) {
      const nextInput = document.getElementById(nextId) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  // Handle backspace to move to the previous field
  handleBackspace(event: KeyboardEvent, currentId: string, prevId: string | null) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && prevId) {
      const prevInput = document.getElementById(prevId) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  // Verify OTP and navigate
  verifyOTP() {
    const otpValue = this.otp.join(''); // Combine OTP digits
    if (otpValue.length === 4) {
      console.log('OTP Entered:', otpValue); // For debugging
      // Add your OTP verification logic here if needed
      this.router.navigate(['/confirm-password'], { queryParams: { fromForgot: true } });
    } else {
      console.log('Please enter a complete OTP');
      // Optionally add a toast notification here for incomplete OTP
    }
  }
}