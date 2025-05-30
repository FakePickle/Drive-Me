import { Routes } from "@angular/router";
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component'; 
import { DriverDashboardComponent } from './pages/driver-dashboard/driver-dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { DriverBookingComponent } from "./pages/driver-booking/driver-booking.component";
import { MyVehiclesComponent } from "./pages/my-vehicles/my-vehicles.component";
import { authGuard } from "./auth/auth.guard";
import { MyBookingsComponent } from "./pages/my-bookings/my-bookings.component";
import { FindDriverComponent } from "./pages/find-driver/find-driver.component";
import {AdminDashboardComponent} from "./pages/admin-dashboard/admin-dashboard.component";
import { AllTripsComponent } from "./pages/all-trips/all-trips.component";
import { AvailableTripsComponent } from "./pages/available-trips/available-trips.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { ChatSupportComponent } from "./pages/chat-support/chat-support.component";

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
    path: 'all-trips',
    component: AllTripsComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'driver' }
  },
  {
    path: 'available-trips',
    component: AvailableTripsComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'driver' }
  },
  {
    path: 'chat-support',
    component: ChatSupportComponent,
    canActivate: [authGuard],
    data: { requiredRole: ['driver', 'user'] } // Allow both user types
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard], 
    data: { requiredRole: ['driver', 'user'] } // Allow both user types
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
  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'user' }
  },
  {
    path: 'my-vehicles',
    component: MyVehiclesComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'user' }
  },
  {
    path: 'find-driver',
    component: FindDriverComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'user' }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'admin' }
  },
  // Add a catch-all route to redirect to landing page
  { path: '**', redirectTo: '' }
];

export default routeConfig;