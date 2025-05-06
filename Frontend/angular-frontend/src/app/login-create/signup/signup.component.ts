import { HttpClient } from '@angular/common/http';
import { Component, inject  } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInterface } from '../../user.interface';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  enteredUserName = "";
  enteredPassword="";
  enteredPassword2="";

  router = inject(Router);
  fb = inject(FormBuilder);
  http = inject(HttpClient)
  form = this.fb.nonNullable.group({
    username: ['', Validators.required ],
    password: ['', Validators.required],
  });
  authService = inject(AuthService);
  onSubmit():void{
    //console.log('Signing Up Process Begin...');
    this.http.post<{ user: UserInterface }>('http://localhost:3000/api/auth/signup', {
      user: this.form.getRawValue(),
    }).subscribe((response) => {
      console.log("response", response);
      localStorage.setItem('token', response.user.token)
      this.authService.currentUserSignal.set(response.user);
      this.router.navigateByUrl('/home')
    });
  }

}
