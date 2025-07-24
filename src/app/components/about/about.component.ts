import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  constructor(private router:Router){}
  homePage(){
    this.router.navigateByUrl('/');
  }
  contactUs(){
    this.router.navigateByUrl('contact-us');
  }
  aboutUs(){
    this.router.navigateByUrl('about-us');
  }
  loginAdmin(){
    this.router.navigateByUrl('login')
  }

}
