import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal reativo: qualquer mudança aqui reflete automaticamente na UI
  public currentUser = signal<any | null>(null);
  private tokenKey = 'kosmos_jwt';

  constructor() {
    this.checkToken();
  }

  public setSession(token: string, user: any): void {
    localStorage.setItem(this.tokenKey, token);
    this.currentUser.set(user);
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      // Simulação inicial: num projeto real, validaríamos o JWT aqui
      this.currentUser.set({ role: 'USER' });
    }
  }
}