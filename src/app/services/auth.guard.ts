import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service'; // path adjust karo agar alag ho

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Optional: clear local storage if koi leftover hai
    this.authService.clearSession();

    // User ko login pe bhejo, replaceUrl ke saath
    this.router.navigate(['/'], {
      replaceUrl: true,
      queryParams: { returnUrl: state.url }, // agar baad me redirect back karna ho to
    });

    return false;
  }
}
