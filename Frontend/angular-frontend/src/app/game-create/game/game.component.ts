import { Component } from '@angular/core';
import { Card } from '../../card.interface';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  http = inject(HttpClient);

  getCoins(): Observable<{ coins: number }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return this.http.get<{ coins: number }>('http://localhost:3000/api/user/coins', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateCoins(delta: number) {
    const token = localStorage.getItem('token');
    return this.http.post<{ coins: number }>('http://localhost:3000/api/user/coins/update', { delta }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  deck: Card[] = [];
  playerHand: Card[] = [];
  dealerHand: Card[] = [];
  playerTotal: number = 0;
  dealerTotal: number = 0;
  message: string = '';
  coins: number = 0;
  ngOnInit() {
    console.log('ngOnInit called');
    this.getCoins().subscribe({
      next: (res) => {
        this.coins = res.coins;
        if (this.coins <= 0){
          this.coins = 1;
          this.updateCoins(1).subscribe();;
        }
      },
      error: (err) => {
        console.error('Failed to load coins', err);
      }
    });
  }
  bet: number = 0;
  gameOver: boolean = false;
  showDealerHoleCard: boolean = false;

  constructor() {
    this.initDeck();
  }

  initDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = [
      { rank: "A", value: 11 },
      { rank: "2", value: 2 },
      { rank: "3", value: 3 },
      { rank: "4", value: 4 },
      { rank: "5", value: 5 },
      { rank: "6", value: 6 },
      { rank: "7", value: 7 },
      { rank: "8", value: 8 },
      { rank: "9", value: 9 },
      { rank: "10", value: 10 },
      { rank: "J", value: 10 },
      { rank: "Q", value: 10 },
      { rank: "K", value: 10 },
    ];
    this.deck = [];
    for (let suit of suits) {
      for (let r of ranks) {
        this.deck.push({ suit, rank: r.rank, value: r.value });
      }
    }
    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCard(): Card {
    if (this.deck.length === 0) {
      this.initDeck();
    }
    return this.deck.pop()!;
  }

  calculateHandValue(hand: Card[]): number {
    let value = hand.reduce((sum, card) => sum + card.value, 0);
    let aces = hand.filter(card => card.rank === 'A').length;
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    return value;
  }

  onPlay(betInput: HTMLInputElement) {
    this.bet = parseInt(betInput.value, 10);
    if (isNaN(this.bet) || this.bet <= 0 || this.bet > this.coins) {
      this.message = "Invalid bet!";
      return;
    }

    this.coins -= this.bet;
    this.updateCoins(-this.bet).subscribe();
    //this.ngOnInit();
    this.playerHand = [this.dealCard(), this.dealCard()];
    this.dealerHand = [this.dealCard(), this.dealCard()];
    this.showDealerHoleCard = false;
    this.playerTotal = this.calculateHandValue(this.playerHand);
    this.dealerTotal = this.calculateHandValue(this.dealerHand);
    this.message = "Game started!";

    this.gameOver = false;

    if (this.playerTotal === 21) {
      this.stand();
    }
  }

  hit() {
    if (this.gameOver) return;
    this.playerHand.push(this.dealCard());
    this.playerTotal = this.calculateHandValue(this.playerHand);

    if (this.playerTotal > 21) {
      this.message = "You busted! Dealer wins.";
      this.gameOver = true;
      this.showDealerHoleCard = true;
      if (this.coins <= 0){
        this.coins = 1;
        this.updateCoins(1).subscribe();;
        //this.ngOnInit();
      }
    }
  }

  stand() {
    if (this.gameOver) return;
    this.showDealerHoleCard = true;

    while (this.dealerTotal < 17) {
      this.dealerHand.push(this.dealCard());
      this.dealerTotal = this.calculateHandValue(this.dealerHand);
    }

    if (this.dealerTotal > 21) {
      this.message = "Dealer busted! You win!";
      this.coins += this.bet * 2;
      this.updateCoins(this.bet * 2).subscribe();;
      //this.ngOnInit();
    } else if (this.playerTotal > this.dealerTotal) {
      this.message = "You win!";
      this.coins += this.bet * 2;
      this.updateCoins(this.bet * 2).subscribe();;
      //this.ngOnInit();
    } else if (this.playerTotal < this.dealerTotal) {
      this.message = "Dealer wins.";
      if (this.coins <= 0){
        this.coins = 1;
        this.updateCoins(1).subscribe();;
        //this.ngOnInit();
      }
    } else {
      this.message = "Push (tie). Bet returned.";
      this.coins += this.bet;
      this.updateCoins(this.bet).subscribe();;
      //this.ngOnInit();
    }

    this.gameOver = true;
  }

  getPlayerHandString() {
    return this.playerHand.map(card => `${card.rank}${card.suit}`).join(' ');
  }

  getDealerHandString() {
    if (this.showDealerHoleCard) {
      return this.dealerHand.map(card => `${card.rank}${card.suit}`).join(' ');
    } else {
      return `${this.dealerHand[0].rank}${this.dealerHand[0].suit} ??`;
    }
  }

  getCardAscii(card: Card): string[] {
    const topLeft = card.rank.padEnd(2, ' ');
    const bottomRight = card.rank.padStart(2, ' ');
    return [
      '┌─────────┐',
      `        │${topLeft}       │`,
      `        │         │`,
      `        │    ${card.suit}    │`,
      `        │         │`,
      `        │       ${bottomRight}│`,
      '        └─────────┘'
    ];
  }

  getCardAsciiString(card: Card): string {
    const lines = this.getCardAscii(card);
    return lines.join('\n');
  }
}

