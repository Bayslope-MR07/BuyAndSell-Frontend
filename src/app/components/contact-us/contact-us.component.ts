import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact-us',
  imports: [MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
  // styleUrls: ['./styles.css']
})
export class ContactUsComponent {
  constructor(private router :Router){}

  contactUs(){
    this.router.navigateByUrl('contact-us');
  }
  
  aboutUs(){
    this.router.navigateByUrl('about-us');
  }
  homePage(){
    this.router.navigateByUrl('/');
  }
  loginAdmin(){
    this.router.navigateByUrl('login')
  }
 

}