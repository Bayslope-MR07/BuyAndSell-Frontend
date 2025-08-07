import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onLogout(): void {
    this.authService.logout().subscribe(
      () => {
        this.toastr.success('Logout Successful!', 'Success');
        this.authService.clearSession();
        this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
          // Reset history to prevent back navigation
          window.history.replaceState(null, '', '/login');
          window.onpopstate = () => {
            window.history.replaceState(null, '', '/login');
            this.router.navigate(['/login'], { replaceUrl: true });
          };
          // Clear all previous history
          while (window.history.length > 1) {
            window.history.back();
            window.history.forward();
          }
        });
        console.log('Logout success');
      },
      (error) => {
        this.toastr.error('Logout failed', 'Error');
        this.authService.clearSession();
        this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
          window.history.replaceState(null, '', '/login');
          window.onpopstate = () => {
            window.history.replaceState(null, '', '/login');
            this.router.navigate(['/login'], { replaceUrl: true });
          };
          while (window.history.length > 1) {
            window.history.back();
            window.history.forward();
          }
        });
        console.error('Logout failed:', error);
      }
    );
  }
}
