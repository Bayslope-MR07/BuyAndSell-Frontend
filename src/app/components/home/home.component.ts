import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router :Router){

  }
  ngOnInit(){
    let token=localStorage.getItem('access_token')
    if(token){
      this.scrollToJoinCommunity()
    }
  }
  scrollToJoinCommunity() {
    const element = document.getElementById('join-community');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  naviagateToBuy(){
    this.router.navigateByUrl('buyer');
  }
  naviagateToShell(){
    this.router.navigateByUrl('user-seller-data');
  }
  contactUs(){
    this.router.navigateByUrl('contact-us');
  }
  aboutUs(){
    this.router.navigateByUrl('about-us')
  }
  loginAdmin(){
    this.router.navigateByUrl('login')
  }
  

}
