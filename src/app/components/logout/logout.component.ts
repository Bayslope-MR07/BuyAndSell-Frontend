import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="logout()">Logout</button>
  `,
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router: Router,private toster:ToastrService) {}

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.toster.success('Logout Successful!', 'Success');
        this.authService.clearSession();
        this.router.navigate(['/login']); // Redirect to login after logout
        console.log("success");
      },
      error => {
        console.error('Logout failed:', error);
      }
    );
  }
}
