import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  public currentUser = signal<any | null>(null);
  private tokenKey = 'kosmos_jwt';
  
  // ATENÇÃO: Confirme se este é o endpoint exato do seu Spring Boot
  private apiUrl = 'http://localhost:8080/api/auth/login';
  constructor() {
    this.checkToken();
  }

  // O método que comunica com o backend Java
  public login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        // Se o Spring Boot devolver o token com sucesso, guardamos na sessão
        // Assumindo que o seu backend devolve algo como { "token": "eyJhbG..." }
        this.setSession(response.token, { email: credentials.email });
      })
    );
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
      // Aqui o utilizador já tem token, logo consideramos logado (simplificado)
      this.currentUser.set({ role: 'USER' });
    }
  }
}