import { Component } from '@angular/core';

@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.css']
})
export class SubAdminComponent {
  subAdminData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  };

  onSubmit() {
    if (this.subAdminData.password !== this.subAdminData.confirm_password) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Sub-Admin Data:', this.subAdminData);
    // Add your logic here to handle the form submission (e.g., API call)
  }
}