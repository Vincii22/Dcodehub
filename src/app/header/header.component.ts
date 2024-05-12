import { Component } from '@angular/core';
import { AuthService } from '../post/auth.service'; // Adjust the path as necessary
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

    logout() {
        this.authService.clearToken(); // Clear the authentication token
        this.router.navigate(['']); // Redirect to the login page
    }
}
