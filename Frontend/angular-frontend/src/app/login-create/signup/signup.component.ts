import { HttpClient } from '@angular/common/http';
import { Component, inject  } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInterface } from '../../user.interface';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserService } from '../../user.service';
@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private signupApiURL = environment.apiUrl+"/auth/signup";
  router = inject(Router);
  fb = inject(FormBuilder);
  http = inject(HttpClient)

  loginclick(){
    this.router.navigateByUrl('/login');
  }

  form = this.fb.nonNullable.group({
    username: ['', Validators.required ],
    password: ['', Validators.required],
  });
  authService = inject(AuthService);

  displayUsername = '';

  userService = inject(UserService);

  onSubmit():void{
    const username = this.form.get('username')?.value || '';
    this.userService.setUsername(username);
    //console.log('Signing Up Process Begin...');
    this.http.post<{ token: string }>(this.signupApiURL, this.form.getRawValue()).subscribe({
      next: ({ token }) => {
        localStorage.setItem('token', token);
        this.authService.setToken(token);
        this.router.navigateByUrl('/home');
      }
    });
  }

}
