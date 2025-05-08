import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  router=inject(Router);

  gameNav() {
    this.router.navigateByUrl('/home');
  }

  leaderNav() {
    this.router.navigateByUrl('/leaderboard');
  }
}
