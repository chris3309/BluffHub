import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface LeaderboardEntry {
  username: string;
  games:    number;
  wins:     number;
  winRate:  number;   // between 0 and 1
  profit:   number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  loading     = false;
  error: string | null = null;
  limit       = 10;    // fetch top-10 by default

  constructor(private http: HttpClient) {}
  private leaderboardApiURL = environment.apiUrl+"/leaderboard";
  ngOnInit(): void {
    this.fetchLeaderboard();
  }

  fetchLeaderboard(): void {
    this.loading = true;
    this.error   = null;

    this.http
      .get<{ leaderboard: LeaderboardEntry[] }>(this.leaderboardApiURL, {
        params: { limit: this.limit.toString() }
      })
      .subscribe({
        next: res => {
          this.leaderboard = res.leaderboard;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'Failed to load leaderboard';
          this.loading = false;
        }
      });
  }
}
