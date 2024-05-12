import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../post/auth.service'; // Adjusted import path
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  existingUsernames: string[] = ['mmmm', 'bbbb', 'nnnn']; // Example list of existing usernames
  errorMessage: string = ''; // Error message property

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  onSubmit() {
    const username = this.registerForm.get('username')?.value ?? '';
    const password = this.registerForm.get('password')?.value ?? '';

    if (this.existingUsernames.includes(username)) {
      // Username already exists, display an error message
      this.errorMessage = 'Username already exists. Please choose a different one.';
      return;
    }

    this.authService.registerUser(username, password).subscribe(
      response => {
          console.log('Registration successful');
          this.router.navigate(['/login']);
      },
      error => {
          console.error('Registration failed:', error);
          this.errorMessage = 'Registration failed. Please try again.';
      }
  );
  
  }

  onRegister(username: string, password: string) {
    this.authService.registerUser(username, password).subscribe(
      response => {
        console.log('Registration successful:', response);
        // Handle successful registration, e.g., navigate to login page
      },
      error => {
        console.error('Registration failed:', error);
        // Handle registration failure, e.g., show an error message
      }
    );
 }
}
