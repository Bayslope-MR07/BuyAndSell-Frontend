import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'], // Corrected from styleUrl to styleUrls
})
export class ProfileHeaderComponent implements OnInit {
  userType: string = '';
  check1: boolean = false;
  check2: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(): void {
    let user: any = localStorage.getItem('userData');
    let info = JSON.parse(user);
    this.userType = info.user_type;
    this.check1 = this.userType === 'Buyer' || this.userType === 'Both';
    this.check2 = this.userType === 'Seller' || this.userType === 'Both';
  }
  // Check if the current route matches a given path
  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // yaha kuch nahi karna, finalize already redirect + clear karega
      },
      error: (err) => {
        console.error('Logout error:', err);
        // Agar API fail bhi ho jaaye, phir bhi user ko force logout kar sakte ho:
        this.authService.clearSession();
        this.router.navigate(['/'], { replaceUrl: true });
      },
    });
  }

  naviagateToBuy() {
    this.router.navigateByUrl('buyer');
  }

  naviagateToShell() {
    this.router.navigateByUrl('seller');
  }

  contactUs() {
    this.router.navigateByUrl('contact-us');
  }

  aboutUs() {
    this.router.navigateByUrl('about-us');
  }

  loginAsAdmin() {
    this.router.navigateByUrl('login');
  }

  homePage() {
    this.router.navigateByUrl('/');
  }

  updateUserProfile() {
    this.router.navigateByUrl('user-profile-update');
  }

  seller() {
    this.router.navigateByUrl('user-seller-data');
  }

  buyer() {
    this.router.navigateByUrl('buyer');
  }
  goForgot() {
    this.router.navigateByUrl('confirm-password');
  }
}