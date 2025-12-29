/*  import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
 
  constructor(private authService:AuthService){
   
  }
logout() {
  this.authService.logout();
  
}
  title = 'BAS-project';
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
   
}
} */
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'BAS-project';
  isLoggedInStatus: boolean = false;

  constructor(private authService: AuthService) {}

  // ngOnInit(): void {
  //   this.checkLoginStatus();
  // }

  ngOnInit(): void {
    // 🔐 VERY IMPORTANT — CSRF cookie set
    this.authService.initCsrf().subscribe({
      next: () => console.log('✅ CSRF cookie initialized'),
      error: (err) => console.error('❌ CSRF init failed', err),
    });

    this.checkLoginStatus();
  }

  // Check if token exists and is valid
  // checkLoginStatus() {
  //   const accessToken = localStorage.getItem('token');
  //   const tokenExpiry = localStorage.getItem('token_expiry');

  //   if (accessToken && tokenExpiry) {
  //     const expiryDate = new Date(tokenExpiry);
  //     if (expiryDate > new Date()) {
  //       this.isLoggedInStatus = true; // Token is valid
  //     } else {
  //       this.isLoggedInStatus = false; // Token is expired
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('token_expiry');
  //     }
  //   } else {
  //     this.isLoggedInStatus = false; // No token present
  //   }
  // }

  checkLoginStatus() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.isLoggedInStatus = false;
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isLoggedInStatus = payload.exp * 1000 > Date.now();
    } catch {
      this.isLoggedInStatus = false;
    }
  }

  // Logout method
  logout() {
    this.authService.logout();
    this.isLoggedInStatus = false;
  }

  // Check if user is logged in
  // isLoggedIn(): boolean {
  //   const token = localStorage.getItem('access_token');
  //   if (!token) return false;

  //   const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
  //   const isExpired = payload.exp * 1000 < Date.now(); // Check expiry
  //   return !isExpired;
  // }

  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }
}