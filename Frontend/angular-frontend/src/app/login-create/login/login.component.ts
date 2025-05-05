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
    this.http.post<{ user: UserInterface }>('http://localhost:3000/auth/login', {
      user: this.form.getRawValue(),
    }).subscribe((response)=>{
      console.log("response", response);
      localStorage.setItem('token', response.user.token);
      this.authService.currentUserSignal.set(response.user);
      this.router.navigateByUrl('/home');
    });
  }
}
