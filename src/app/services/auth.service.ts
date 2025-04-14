import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  aadharCard?: string;
  role: 'user' | 'driver' | 'admin';
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router) {
    // Try to load user from localStorage on init
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.currentUserValue?.token;
  }

  async login(credentials: { emailOrPhone: string, password: string, role: 'user' | 'driver' | 'admin' }): Promise<User> {
    // Determine endpoint based on role
    const endpoint = credentials.role === 'driver' ?
      'http://localhost:8080/auth/driver/login' :
      credentials.role === 'admin' ?
        'http://localhost:8080/auth/admin/login' :
        'http://localhost:8080/auth/user/login';

    const loginPayload = {
      emailOrPhone: credentials.emailOrPhone,
      password: credentials.password
    };

    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(loginPayload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(data => {
      // Create user object from response
      const user: {
        id: number;
        fullName: string;
        email?: string;
        phone?: string;
        aadharCard?: string;
        role: 'user' | 'driver' | 'admin';
        token: string;
        licenseNumber?: string; // Only for drivers
      } = {
        // Map response properties to user object
        role: credentials.role,
        token: data.token,
        id: data.userId,
        fullName: data.fullName,
      };

      console.log('User data:', data);
      if (credentials.role === 'driver') {
        user.licenseNumber = data.licenseNumber;
        console.log('Driver login successful:', user);
      }
      
      // Store user in localStorage and update subject
      localStorage.setItem("token", data.token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      return user;
    });
  }

  async signup(userDetails: any, role: 'user' | 'driver'): Promise<User> {
    const endpoint = role === 'driver' ? 
      'http://localhost:8080/auth/driver/signup' : 
      'http://localhost:8080/auth/user/signup';
      

    const signupPayload: {
      fullName: string;
      email: string;
      phone: string;
      aadharCard: string;
      password: string;
      licenseNumber?: string;
    } = {
      fullName: userDetails.fullName,
      email: userDetails.email,
      phone: userDetails.phone,
      aadharCard: userDetails.aadharCard,
      password: userDetails.password
    };
    
    if (role === 'driver') {
      signupPayload['licenseNumber'] = userDetails.licenseNumber;
    }
    
    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(signupPayload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      return response.json();
    })
    .then(data => {
      // After signup, you might want to login the user automatically
      // or just return the created user
      return {
        ...data,
        role
      };
    });
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}