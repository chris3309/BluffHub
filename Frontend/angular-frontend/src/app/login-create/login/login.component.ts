import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UserInterface } from '../../user.interface';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  enteredUserName = "";
  enteredPassword="";

  fb = inject(FormBuilder);
  router=inject(Router);
  http = inject(HttpClient);
  authService = inject(AuthService);


  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit():void{
    this.http.post<{token: string; user: UserInterface }>('http://localhost:3000/api/auth/login', {
      user: this.form.getRawValue(),
    }).subscribe({
      next: (response)=>{
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
