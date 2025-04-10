import { Routes } from "@angular/router";
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component'; 
import { DriverDashboardComponent } from './pages/driver-dashboard/driver-dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { DriverBookingComponent } from "./pages/driver-booking/driver-booking.component";
import { authGuard } from "./auth/auth.guard";

const routeConfig: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'driver-dashboard', 
    component: DriverDashboardComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'driver' }
  }, 
  {
    path: 'user-dashboard', 
    component: UserDashboardComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'user' }
  },
  {
    path: 'driver-booking', 
    component: DriverBookingComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'user' }
  },
  // Add a catch-all route to redirect to landing page
  { path: '**', redirectTo: '' }
];

export default routeConfig;