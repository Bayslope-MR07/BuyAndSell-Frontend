/* import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller-form',
  standalone: true, // This makes the component standalone
  imports: [FormsModule, CommonModule], // Import necessary modules
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.css'],
})
export class SellerFormComponent {
  formData = {
    full_name: '',
    email: '',
    contact: '',
    patents: '',
    google_link: '',
    company_name: '',
    file: null as File | null,
  };

  message: string = ''; // Display message for success or error

  constructor(private http: HttpClient) {}

  // Handle file input change
  onFileChange(event: any) {
    this.formData.file = event.target.files[0];
  }

  // Submit the form
  onSubmit() {
    const formDataToSend = new FormData();
    formDataToSend.append('full_name', this.formData.full_name);
    formDataToSend.append('email', this.formData.email);
    formDataToSend.append('contact', this.formData.contact);
    formDataToSend.append('patents', this.formData.patents);
    formDataToSend.append('google_link', this.formData.google_link);
    formDataToSend.append('company_name', this.formData.company_name);
    if (this.formData.file) {
      formDataToSend.append('file', this.formData.file, this.formData.file.name);
    }

    const token = localStorage.getItem('access_token');

    this.http
      .post('http://3.144.99.241/api/accounts/seller-form/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe(
        (response) => {
          this.message = 'Data submitted successfully!';
          console.log(response);
          // Optionally reset the form
          this.formData = {
            full_name: '',
            email: '',
            contact: '',
            patents: '',
            google_link: '',
            company_name: '',
            file: null,
          };
        },
        (error) => {
          this.message = 'Error submitting data!';
          console.error(error);
        }
      );
  }
}
 */
/* import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller-form',
  standalone: true, // Declare the component as standalone
  imports: [FormsModule, CommonModule], // Include FormsModule here
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.css'],
})
export class SellerFormComponent {
  formData = {
    full_name: '',
    email: '',
    contact: '',
    patents: '',
    google_link: '',
    company_name: '',
    file: null as File | null,
  };

  message: string = ''; // Message to show success or error

  constructor(private http: HttpClient) {}

  // Handle file input change
  onFileChange(event: any) {
    this.formData.file = event.target.files[0];
  }

  // Submit the form
  onSubmit() {
    const formDataToSend = new FormData();
    formDataToSend.append('full_name', this.formData.full_name);
    formDataToSend.append('email', this.formData.email);
    formDataToSend.append('contact', this.formData.contact);
    formDataToSend.append('patents', this.formData.patents);
    formDataToSend.append('google_link', this.formData.google_link);
    formDataToSend.append('company_name', this.formData.company_name);
    if (this.formData.file) {
      formDataToSend.append('file', this.formData.file, this.formData.file.name);
    }

    const token = localStorage.getItem('access_token');

    this.http
      .post('http://3.144.99.241/api/accounts/seller-form/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe(
        (response) => {
          this.message = 'Data submitted successfully!';
          console.log(response);
          // Optionally reset the form
          this.formData = {
            full_name: '',
            email: '',
            contact: '',
            patents: '',
            google_link: '',
            company_name: '',
            file: null,
          };
        },
        (error) => {
          this.message = 'Error submitting data!';
          console.error(error);
        }
      );
  }
}
 */
/* import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.css'],
})
export class SellerFormComponent {
  formData = {
    portfolio_type: '', // Sale only, License only, Sale and License
    patent_owner_status: '', // Owner or Broker
    patent_owner_website: '', // Optional
    first_name: '',
    last_name: '',
    country: '',
    email: '',
    phone: '',
    city: '',
    postal_code: '',
    current_assignee_status: '', // Yes or No
    price_expectation: '', // Dropdown values
    deadline: '', // Optional date
    expiry:'',
    primary_technology: '',
    google_patent_link: '',
    file: null as File | null,
    patents: [
      {
        country: '',
        status: '',
        patent_number: '',
        publication_number: '',
        application_number: '',
      },
    ], // For dynamic fields
  };

  message: string = '';

  constructor(private http: HttpClient) {}

  // Handle file input change
  onFileChange(event: any) {
    this.formData.file = event.target.files[0];
  }

  // Add a new patent object dynamically
  addPatent() {
    this.formData.patents.push({
      country: '',
      status: '',
      patent_number: '',
      publication_number: '',
      application_number: '',
    });
  }

  // Remove a specific patent object
  removePatent(index: number) {
    this.formData.patents.splice(index, 1);
  }

  // Submit the form
  onSubmit() {
    const formDataToSend = new FormData();
    Object.entries(this.formData).forEach(([key, value]) => {
      if (key === 'patents') {
        formDataToSend.append(key, JSON.stringify(value)); // Send patents as JSON string
      } else if (key === 'file' && this.formData.file) {
        formDataToSend.append('file', this.formData.file, this.formData.file.name);
      } else {
        formDataToSend.append(key, value as string);
      }
    });

    const token = localStorage.getItem('access_token');

    this.http
      .post('http://3.144.99.241/api/accounts/seller-form/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe(
        (response) => {
          this.message = 'Data submitted successfully!';
          console.log(response);
        },
        (error) => {
          this.message = 'Error submitting data!';
          console.error(error);
        }
      );
  }
}
  */


import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {  HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-seller-form',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent, ProfileHeaderComponent],
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.css'],
})
export class SellerFormComponent {
  formData = {
    portfolio_type: '', // Sale only, License only, Sale and License
    patent_owner_status: '', // Owner or Broker
    patent_owner_website: '', // Optional

    first_name: '',
    last_name: '',
    country: '',
    email: '',
    phone: '',
    
    city: '',
    postal_code: '',
    current_assignee_status: '', // Yes or No
    price_expectation: '', // Dropdown values
    deadline: '', // Optional date
    expiry: '',
    primary_technology: '',
    encumbrances: '',
    motivation_to_sell: '',

    file: null as File | null,
    patents: [
      {
        country: '',
        status: '',
        patent_number: '',
        publication_number: '',
        application_number: '',
        google_patent_link: '',
      },
    ], // For dynamic fields
  };

  message: string = '';
  baseUrl: any = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  logout() {
    this.router.navigateByUrl('login');
  }
  // Handle file input change
  onFileChange(event: any) {
    this.formData.file = event.target.files[0];
  }

  buyer() {
    this.router.navigateByUrl('buyer');
  }
  seller() {
    this.router.navigateByUrl('user-seller-data');
  }

  // Add a new patent object dynamically
  addPatent() {
    this.formData.patents.push({
      country: '',
      status: '',
      patent_number: '',
      publication_number: '',
      application_number: '',
      google_patent_link: '',
    });
  }

  // Remove a specific patent object
  removePatent(index: number) {
    this.formData.patents.splice(index, 1);
  }

  // Submit the form
  onSubmit() {
    const formDataToSend = new FormData();

    Object.entries(this.formData).forEach(([key, value]) => {
      if (key === 'patents') {
        formDataToSend.append(key, JSON.stringify(value)); // Send patents as JSON string
      } else if (key === 'file' && this.formData.file) {
        formDataToSend.append(
          'file',
          this.formData.file,
          this.formData.file.name
        );
      } else {
        formDataToSend.append(key, value as string);
      }
    });
    console.log('Form Data to Send:', formDataToSend);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(`${this.baseUrl}/seller-form/`, formDataToSend, { headers })
      .subscribe({
        next: (response: any) => {
          // Replace 'any' with a response interface
          this.toastr.success('Data submitted successfully!');
          if (response.status === 201) {
            this.message = 'Data submitted successfully!';
            this.router.navigateByUrl('user-seller-data');
          }
          // else {
          //   this.message = 'Data submitted, but unexpected status: ' + response.status;
          // }
          console.log('Response:', response);
          if (response === 201 || 201) {
            this.router.navigateByUrl('user-seller-data');
          } else {
            this.router.navigateByUrl('#');
          }
        },
        error: (error) => {
          this.toastr.error(error?.message);
          this.message = 'Error submitting data!';
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }
}
