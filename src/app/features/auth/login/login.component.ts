import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);

  public theme = this.themeService.currentTheme;
  public isLoading = false;
  public errorMessage = '';
  public showPassword = false;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => {
        this.isLoading = false;
        // O AuthService já trata do redirecionamento para o /feed
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Credenciais inválidas ou erro no servidor.';
        console.error('Erro de Autenticação:', err);
      }
    });
  }
}