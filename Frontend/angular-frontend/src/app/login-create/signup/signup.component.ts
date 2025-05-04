import { Component, inject  } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    username: ['', Validators.required ],
    password: ['', Validators.required],
  });

  onSubmit():void{
    console.log('Sign Up');
  }



}
