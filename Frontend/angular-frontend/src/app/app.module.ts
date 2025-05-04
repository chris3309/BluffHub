import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './head-create/header/header.component';
import { LoginComponent } from './login-create/login/login.component';
import { LeaderboardComponent } from './leaderboard-create/leaderboard/leaderboard.component';
import { GameComponent } from './game-create/game/game.component';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from '@angular/forms';


// Material Imports
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { SignupComponent } from './login-create/signup/signup.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
//import { Component, OnInit } from '@angular/core';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    LeaderboardComponent,
    GameComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
