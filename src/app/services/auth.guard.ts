import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('access_token');
    if (token && this.authService.isAuthenticated()) {
      return true;
    } else {
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
      return false;
    }
  }
}
