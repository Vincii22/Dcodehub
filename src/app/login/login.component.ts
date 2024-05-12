import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../post/auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
 });

 loginError: string | null = null; // Property to hold the error message
 @ViewChild('errorMessage') errorMessageRef!: ElementRef;

showAlert() {
  if (this.loginError) {
    alert(this.errorMessageRef.nativeElement.innerText);
  }
}

 constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {} // Inject AuthService and Router

 onSubmit() {
  const username = this.loginForm.get('username')?.value ?? '';
  const password = this.loginForm.get('password')?.value ?? '';
  this.authService.loginUser(username, password).subscribe(
    response => {
      console.log('Login response:', response); // Log the login response
      this.authService.storeToken(response.token); // Store the JWT
      this.router.navigate(['/posts']); // Redirect to the post component
      this.loginError = null; // Clear any previous error messages
      // Optionally, show a success message or perform other actions
    },
    error => {
      console.error('Login failed:', error); // Log the error
      this.loginError = 'Login failed. Please try again.'; // Set the error message
      this.showAlert();
    }
  );
}


  

}
