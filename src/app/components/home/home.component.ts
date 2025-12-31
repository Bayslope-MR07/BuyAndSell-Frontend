import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    let token = localStorage.getItem('access_token');
    if (token) {
      this.scrollToJoinCommunity();
    }
  }
  scrollToJoinCommunity() {
    const element = document.getElementById('join-community');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  naviagateToBuy() {
    this.router.navigateByUrl('/login?user_type=Buyer');
  }
  naviagateToShell() {
    this.router.navigateByUrl('/login?user_type=Seller');
  }
  contactUs() {
    this.router.navigateByUrl('contact-us');
  }
  aboutUs() {
    this.router.navigateByUrl('about-us');
  }
  loginAdmin() {
    this.router.navigateByUrl('login');
  }
  // Login methods
  loginAsBuyer() {
    this.router.navigateByUrl('/login?user_type=Buyer');
  }

  loginAsAdmin() {
    this.router.navigateByUrl('/login?user_type=Admin');
  }

  loginAsSeller() {
    this.router.navigateByUrl('/login?user_type=Seller');
  }
}
