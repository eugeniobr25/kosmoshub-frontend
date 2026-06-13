import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public onSubmit(): void {
    if (this.loginForm.valid) {
      // Extraímos os valores do formulário (email e password)
      const credentials = this.loginForm.value;

      // Chamamos o serviço que baterá no Spring Boot
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Autenticação com o Spring Boot bem-sucedida!', response);
          this.router.navigate(['/dashboard']); // Vamos para o Post Feed!
        },
        error: (err) => {
          console.error('Falha na autenticação (Rejeitado pelo Java):', err);
          alert('Acesso negado. Verifique as suas credenciais no backend.');
        }
      });
    }
  }
}