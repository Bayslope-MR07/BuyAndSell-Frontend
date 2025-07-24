import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
    providedIn: 'root'
  })
export class AdminGuard2 implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(): boolean {
      if (this.authService.isAuthenticated() && this.authService.isAdminUser()) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
  }
  