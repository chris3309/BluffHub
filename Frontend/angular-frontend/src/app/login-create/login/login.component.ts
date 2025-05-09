import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UserInterface } from '../../user.interface';
import { environment } from '../../../environments/environment';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  enteredUserName = "";
  enteredPassword="";
  private loginApiURL = environment.apiUrl+"/auth/login";
  fb = inject(FormBuilder);
  router=inject(Router);
  http = inject(HttpClient);
  authService = inject(AuthService);
  userService = inject(UserService);

  signupclick(){
    this.router.navigateByUrl("/signup");
  }

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit():void{
    this.http.post<{token: string; user: UserInterface }>(this.loginApiURL, {
      user: this.form.getRawValue(),
    }).subscribe({
      next: (response)=>{
        this.userService.setUsername(response.user.username);
        console.log("Login success", response);
        localStorage.setItem('token', response.token);
        this.authService.currentUserSignal.set(response.user);
        this.router.navigateByUrl('/home');
      },
    error: (err) => {
      console.error("Login failed", err);
      alert('Invalid username or password');
    }
    });
  }
}
