import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../user.model'; // Adjust the path as necessary
import jwtDecode from 'jwt-decode';



// Define a custom interface for the decoded token
interface DecodedToken {
    [key: string]: any; // Define index signature to access arbitrary properties
}   

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000';
    private currentUserSubject: BehaviorSubject<User | null>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User | null>(null);
    }

    registerUser(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, { username, password }, { responseType: 'json' })
            .pipe(catchError(this.handleError));
    }

    loginUser(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
            .pipe(
                tap((response: any) => {
                    const token = response.token;
                    if (token) {
                        this.storeToken(token);
                        const decodedToken = this.decodeToken(token); // Decode JWT token
                        const user: User = {
                            id: decodedToken['id'], // Access id using bracket notation
                            username: decodedToken['username'], // Access username using bracket notation
                            // Add other properties if needed
                        };
                        this.currentUserSubject.next(user); // Update currentUserSubject with the user information
                        this.router.navigate(['/posts']); // Navigate to posts page after login

                        // Calculate the time remaining until the token expires
                        const currentTime = Date.now().valueOf() / 1000;
                        const timeRemaining = decodedToken['exp'] - currentTime;

                        // If the token is not expired, set a timer to log out the user after the token expires
                        if (timeRemaining > 0) {
                            setTimeout(() => {
                                this.logout();
                            }, timeRemaining * 1000); // Convert seconds to milliseconds
                        }
                    } else {
                        console.error('Token not found in login response');
                    }
                }),
                catchError(this.handleError)
            );
    }

    storeToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    clearToken(): void {
        localStorage.removeItem('authToken');
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return false;
        }
        try {
            const decodedToken = this.decodeToken(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken['exp'] && decodedToken['exp'] < currentTime) { // Access exp using bracket notation
                this.clearToken();
                return false;
            }
            return true;
        } catch (error) {
            this.clearToken();
            return false;
        }
    }

    private decodeToken(token: string): DecodedToken {
        try {
            return jwtDecode(token) as DecodedToken; // Decode the token and return the decoded object
        } catch (error) {
            console.error('Error decoding token:', error);
            return {} as DecodedToken; // Return an empty object if decoding fails
        }
    }

    private handleError(error: any) {
        const errorMessage = `An error occurred: ${error.message}`;
        return throwError(() => new Error(errorMessage)); // Updated to use the recommended approach
    }

    logout(): void {
        this.clearToken();
        this.currentUserSubject.next(null); // Clear currentUserSubject
        this.router.navigate(['/login']);
    }

    public getCurrentUser(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    autoLogin(): void {
        const token = this.getToken();
        if (token) {
            const decodedToken = this.decodeToken(token);
            const user: User = {
                id: decodedToken['id'], // Access id using bracket notation
                username: decodedToken['username'], // Access username using bracket notation
                // Add other properties if needed
            };
            this.currentUserSubject.next(user); // Update currentUserSubject with the user information

            // Calculate the time remaining until the token expires
            const currentTime = Date.now().valueOf() / 1000;
            const timeRemaining = decodedToken['exp'] - currentTime;

            // If the token is not expired, set a timer to log out the user after the token expires
            if (timeRemaining > 0) {
                setTimeout(() => {
                    this.logout();
                }, timeRemaining * 1000); // Convert seconds to milliseconds
            }
        }
    }
}