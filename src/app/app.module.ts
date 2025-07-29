import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptors';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SellerFormComponent } from './components/seller-form/seller-form.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { BuyersComponent } from './components/buyers/buyers.component';
import { BuyerDetailsComponent } from './components/buyer-details/buyer-details.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { BuyerActionsComponent } from './components/buyer-actions/buyer-actions.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { OtpComponent } from './components/otp/otp.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { SubAdminComponent } from './components/sub-admin/sub-admin.component';
import { UserSellerDataComponent } from './components/user-seller-data/user-seller-data.component';
import { UserProfileUpdateComponent } from './components/user-profile-update/user-profile-update.component';

import { AuthGuard } from './services/auth.guard';
import { AdminGuard2 } from './services/auth_guardadmin';
import { GoogleCallbackComponent } from './google-callback/google-callback.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPasswordComponent } from './components/confirm-password/confirm-password.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

// Define routes
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'seller', component: SellerFormComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard2] },
  { path: 'buyer', component: BuyersComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent },
  { path: 'buyer-details/:patentId', component: BuyerDetailsComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'buyer-actions', component: BuyerActionsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'sub-admin', component: SubAdminComponent },
  { path: 'user-seller-data', component: UserSellerDataComponent },
  { path: 'user-profile-update', component: UserProfileUpdateComponent },
  { path: 'google-callback', component: GoogleCallbackComponent },
  { path: 'confirm-password', component: ConfirmPasswordComponent },

];

library.add(faTwitter, faFacebook, faInstagram, faLinkedin);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    GoogleCallbackComponent,
    // PieChartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, // Required for ngModel
    RouterModule.forRoot(routes),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-left',
      preventDuplicates: true,
    }),
    MatButtonModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    FontAwesomeModule,
    NgbModule
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    AdminGuard2,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
