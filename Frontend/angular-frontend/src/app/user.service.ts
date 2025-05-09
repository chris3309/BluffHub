import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private usernameSubject = new BehaviorSubject<string>('');
  username$ = this.usernameSubject.asObservable();

  setUsername(name: string) {
    this.usernameSubject.next(name);
  }

  getUsername(): string {
    return this.usernameSubject.getValue();
  }
}
