import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ngModel ke liye
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadService } from '../../services/file-upload.service';

// Yahan pe type define kar dete hain
interface ContactFormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

@Component({
  selector: 'app-contact-us',
  standalone: true, // agar yeh standalone component hai
  imports: [FormsModule, MatMenuModule, MatIconModule, MatButtonModule,FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'], // styleUrl nahi, styleUrls (array)
})
export class ContactUsComponent {
  constructor(
    private router: Router,
    private contactService: FileUploadService // isme sendContactForm method hona chahiye
  ) {}

  contactUs() {
    this.router.navigateByUrl('contact-us');
  }

  aboutUs() {
    this.router.navigateByUrl('about-us');
  }

  homePage() {
    this.router.navigateByUrl('/');
  }

  loginAdmin() {
    this.router.navigateByUrl('login');
  }

  contact: ContactFormPayload = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  };

  isSubmitting = false;

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.contactService.sendContactForm(this.contact).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Message sent successfully!');
        this.contact = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        };
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error sending message', err);
        alert('Something went wrong, please try again.');
      },
    });
  }
}
