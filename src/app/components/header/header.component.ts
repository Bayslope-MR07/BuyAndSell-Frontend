import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true, // Ensure HeaderComponent is standalone
  imports: [MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 constructor(private router :Router,private authService: AuthService){

  }
  logout(){
    this.router.navigateByUrl('/');
  }
  naviagateToBuy(){
    this.router.navigateByUrl('buyer');
  }
  naviagateToShell(){
    this.router.navigateByUrl('seller');
  }
  contactUs(){
    this.router.navigateByUrl('contact-us');
  }
  aboutUs(){
    this.router.navigateByUrl('about-us')
  }
  loginAsAdmin(){
    this.router.navigateByUrl('login');
  }
  homePage(){
    this.router.navigateByUrl('/')
  }
  forgot(){
    this.router.navigateByUrl('forgot');
  }
}
