import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-buyer-details',
  standalone: true,
  imports: [FormsModule, CommonModule,ProfileHeaderComponent,  FooterComponent, MatProgressSpinnerModule],
  templateUrl: './buyer-details.component.html',
  styleUrls: ['./buyer-details.component.css'],
})
export class BuyerDetailsComponent implements OnInit {
  patentId: number | undefined;
  patentDetails: any;
  userFeedback: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.patentId = +params['patentId']; // Get patentId from route params
      this.fetchPatentDetails();
    });
  }

  fetchPatentDetails() {
    const token = localStorage.getItem('access_token'); // Retrieve token from local storage
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http
      .get(
        `https://buyandsell-backend.onrender.com/api/accounts/buyer-data/${this.patentId}/`,
        { headers }
      )
      .subscribe(
        (response: any) => {
          this.patentDetails = response;
          this.userFeedback = response.user_feedback; // Store patent details
        },
        (error) => {
          console.error('Error fetching patent details:', error);
        }
      );
  }

  backToBuyer() {
    this.router.navigate(['/buyer']);
  }
}