import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostEditComponent } from './post/post-edit/post-edit.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { UnauthenticatedComponent } from './unauthenticated/unauthenticated.component';
import { AuthService } from './post/auth.service';
import { UserService } from './post/user.service'; // Adjust the import path as necessary
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { APP_INITIALIZER } from '@angular/core';
import { AuthInterceptor } from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostCreateComponent,
    PostEditComponent,
    PostListComponent,
    SidebarComponent,
    LoginComponent,
    AuthComponent,
    PageNotFoundComponent,
    RegisterComponent,
    UnauthenticatedComponent,
  
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserAnimationsModule, 
    MatInputModule, MatButtonModule,
    MatCardModule, MatToolbarModule,
    MatMenuModule, MatIconModule,
    MatSidenavModule,
    MatExpansionModule,
    HttpClientModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatSnackBarModule
 

  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.autoLogin(),
      deps: [AuthService],
      multi: true
    },
    UserService,
    // Add AuthInterceptor to the list of providers
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
