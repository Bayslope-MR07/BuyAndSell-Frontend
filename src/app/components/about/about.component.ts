import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIcon, MatMenu, MatMenuTrigger],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  constructor(private router: Router) {}
  homePage() {
    this.router.navigateByUrl('/');
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
}
