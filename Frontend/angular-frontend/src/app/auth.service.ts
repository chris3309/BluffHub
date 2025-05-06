import { Injectable, signal, computed } from "@angular/core";
import { UserInterface } from "./user.interface";

const TOKEN_KEY = 'token';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  currentUserSignal = signal<UserInterface | undefined | null>(undefined);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly token       = this._token.asReadonly();
  readonly isLoggedIn  = computed(() => !!this._token());
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
  }
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
  }
}
