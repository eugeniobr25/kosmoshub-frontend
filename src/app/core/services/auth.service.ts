import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'kosmoshub_jwt';

  // Signal que diz à nossa UI se o utilizador está logado ou não
  public isAuthenticated = signal<boolean>(this.hasToken());

  public login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Resposta do Backend (Apenas para Arquitetura):', response);
        
        // Cobre os 3 padrões mais comuns do Spring Security
        const tokenStr = response.token || response.accessToken || response.jwt || (typeof response === 'string' ? response : null);
        
        if (tokenStr) {
          localStorage.setItem(this.tokenKey, tokenStr);
          this.isAuthenticated.set(true);
          this.router.navigate(['/dashboard']); // Redireciona com sucesso
        } else {
          console.error('Alerta: O backend respondeu com sucesso, mas não enviou o Token!');
        }
      })
    );
  }

  // MÉTODO ADICIONADO: Conecta o formulário de Registro ao Spring Boot
  public register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  public forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}