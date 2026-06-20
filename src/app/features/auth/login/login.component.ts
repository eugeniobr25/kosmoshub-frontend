import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private router = inject(Router);

  public theme = this.themeService.currentTheme;
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string>('');
  
  public showPassword = signal<boolean>(false);

  // Controladores do Menu Circular (FAB) exatamento como homologado
  public isOpen = signal<boolean>(false);
  public screenLantern = signal<boolean>(false);
  public backLantern = signal<boolean>(false);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public togglePassword(): void { this.showPassword.update(v => !v); }

  // Funções exigidas pelo Circular FAB integradas
  public toggleMenu(): void { this.isOpen.update(v => !v); }
  public changeTheme(newTheme: any): void { 
    this.themeService.setTheme(newTheme); 
    this.isOpen.set(false);
  }
  public toggleScreenLantern(): void { this.screenLantern.update(v => !v); }
  public toggleBackLantern(): void { this.backLantern.update(v => !v); }

  public onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciais inválidas ou erro no servidor.');
        console.error('Erro de Autenticação:', err);
      }
    });
  }
}