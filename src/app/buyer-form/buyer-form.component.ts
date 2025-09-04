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
import { BuyersComponent } from '../components/buyers/buyers.component';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-buyer-form',
  imports: [
    ReactiveFormsModule,
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
  matches: any[] = [];

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
  whoAreYou: ['', Validators.required],
  purpose: ['', Validators.required],
  desiredPatentTypes: [''],

  techFields: [''],
  competitors: [''],

  portfolioSize: [''],
  jurisdictions: [''],

  budget: [''],
  dealStructure: [''],

  litigationRisk: ['case-by-case'],
  encumbranceTolerance: [''],

  timeline: [''],
  acquisitionInterest: [''],

  ndaRequired: [''],
  disclosureRestrictions: [''],
  directContactAck: [false],
});

  }

  onSubmit() {
    const formDataToSend = new FormData();

    // Use reactive form values
Object.entries(this.buyerForm.value).forEach(([key, value]) => {
  if (value === null || value === undefined) {
    formDataToSend.append(key, '');
  } else if (Array.isArray(value) || typeof value === 'object') {
    formDataToSend.append(key, JSON.stringify(value)); // ✅ always string
  } else {
    formDataToSend.append(key, value.toString()); // ✅ ensure string
  }
});



    // File upload
    if (this.selectedFile) {
      formDataToSend.append('file', this.selectedFile, this.selectedFile.name);
    }

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
          console.log('Response:', response);
          this.router.navigate(['/buyer'])
        },
        error: (error) => {
          this.toastr.error(
            error?.error?.detail || 'Error submitting buyer data!'
          );
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
