import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { ProfileHeaderComponent } from '../components/profile-header/profile-header.component';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-buyer-form',
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    ProfileHeaderComponent,
    // MatMenu,
    // MatIcon,
    FooterComponent,
  ],
  templateUrl: './buyer-form.component.html',
  styleUrl: './buyer-form.component.css',
})
export class BuyerFormComponent {
  buyerForm: FormGroup;
  formData: any = {};
  baseUrl: any = environment.apiUrl;
  message: string = '';

  whoAreYouOptions = [
    'NPE',
    'Investor',
    'Licensing Houses',
    'Operating Companies',
    'Others',
  ];
  purposeOptions = [
    'Litigation defense',
    'Offensive litigation',
    'Licensing',
    'R&D',
    'Blocking competitor',
    'Investment',
  ];
  patentTypeOptions = [
    'Granted patents',
    'Applications',
    'Families',
    'Standards-related',
  ];

  jurisdictionOptions = ['US', 'EP', 'CN', 'JP', 'Others'];
  structureOptions = [
    'Outright purchase',
    'License',
    'Exclusive license',
    'Revenue share',
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.buyerForm = this.fb.group({
      companyName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      position: [''],
      whoAreYou: ['', Validators.required],

      purpose: ['', Validators.required],
      desiredPatentTypes: [[]],

      techFields: [''],
      competitors: [''],

      portfolioSize: [''],
      jurisdictions: [[]],

      budget: [''],
      dealStructure: [''],

      litigationRisk: ['case-by-case'],
      encumbranceTolerance: [''],

      timeline: [''],
      acquisitionInterest: [''],

      ndaRequired: [false],
      disclosureRestrictions: [''],
    });
  }

  onSubmit() {
    const formDataToSend = new FormData();

    Object.entries(this.formData).forEach(([key, value]) => {
      if (key === 'file' && this.formData.file) {
        formDataToSend.append(
          'file',
          this.formData.file,
          this.formData.file.name
        );
      } else {
        formDataToSend.append(key, value as string);
      }
    });

    console.log('Buyer Form Data to Send:', formDataToSend);

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(`${this.baseUrl}/buyer_form_submission/`, formDataToSend, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Buyer Data submitted successfully!');
          if (response.status === 201) {
            this.message = 'Data submitted successfully!';
            this.router.navigateByUrl('user-buyer-data');
          }
          console.log('Response:', response);
          if (response === 201 || 201) {
            this.router.navigateByUrl('user-buyer-data');
          } else {
            this.router.navigateByUrl('#');
          }
        },
        error: (error) => {
          this.toastr.error(error?.message);
          this.message = 'Error submitting buyer data!';
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Buyer request completed');
        },
      });
  }

  selectedFile: File | null = null;
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Selected file:', file);
    }
  }
}
