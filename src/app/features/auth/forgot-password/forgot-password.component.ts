import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);

  public theme = this.themeService.currentTheme;
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public isMailSent = signal<boolean>(false); // Controla a transição de etapa

  public forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  public onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email } = this.forgotForm.value;

    // Vinculação com o método que adicionaremos no seu AuthService
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isMailSent.set(true); // Altera o ecrã para o estado de sucesso
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        // Tratamento tático: se o Spring retornar erro genérico ou 404
        this.errorMessage.set(err.error?.message || 'Não foi possível processar a solicitação de redefinição.');
      }
    });
  }
}