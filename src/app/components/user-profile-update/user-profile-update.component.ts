import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; // Adjust path if needed
import { FormsModule, NgForm } from '@angular/forms'; // NgForm for form reference
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile-update',
  standalone: true,
  imports: [FormsModule, CommonModule], // Ensure FormsModule is imported
  templateUrl: './user-profile-update.component.html',
  styleUrls: ['./user-profile-update.component.css'],
})
export class UserProfileUpdateComponent implements OnInit {
  baseUrl = environment.apiUrl;
  user = {
    first_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    user_type: '',
  };
  message: string = '';
  error: boolean = false;

  constructor(private http: HttpClient, private router: Router,private toster:ToastrService) {}

  ngOnInit() {
    this.fetchUserProfile();
  }
  backToHome(){
    const userData:any=localStorage.getItem('userData');
    const response:any=JSON.parse(userData);

     // Navigate based on user role
     if (response.is_admin === true) {
      this.router.navigate(['/admin']);
    } else {
      const userType = response.user_type;
      if (userType === 'Seller') {
        this.router.navigate(['/user-seller-data']);
      } else if (userType === 'Buyer') {
        this.router.navigate(['/buyer']);
      } else {
        this.router.navigate(['/buyer']); // Default fallback
      }
    }
  }

  fetchUserProfile() {
    const userData:any=localStorage.getItem('userData'); 
    const response:any=JSON.parse(userData);
    this.user = {
      first_name: response?.first_name || '',
      last_name: response?.last_name || '',
      email: response?.email || '',
      phone_no: response?.phone_no || '',
      user_type: response?.user_type || ''
      // address: response?.address || ''
    };
  }

  // Ensure onSubmit accepts NgForm as a parameter
  onSubmit(form: NgForm) {
    if (form.valid) {
      // const payload = {
      //   first_name: this.user.firstName,
      //   last_name: this.user.lastName,
      //   email: this.user.email,
      //   phone: this.user.phone,
      //   user_type: this.user.userType,
      //   // address: this.user.address
      // };

      this.http.put(`${this.baseUrl}/update-profile/`, this.user).subscribe(
        (response) => {
          localStorage.setItem('userData',JSON.stringify(this.user))
          this.toster.success('Profile updated successfully!', 'Success');
          this.message = 'Profile updated successfully!';
          if(this.user.user_type === 'buyer') {
            this.router.navigateByUrl('buyer');
          }if(this.user.user_type === 'seller') {
            this.router.navigateByUrl('seller');
          }
          else {
            this.router.navigateByUrl('Buyer');
          }
          this.error = false;
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.message = 'Failed to update profile.';
          this.error = true;
        }
      );
    }
  }

  resetForm() {
    this.fetchUserProfile();
    this.message = '';
    this.error = false;
  }
}