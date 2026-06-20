import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  public themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public theme = this.themeService.currentTheme;
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  
  // Blindagem Máxima Anti-Autofill do Chrome
  public isReadonly = signal<boolean>(true);
  
  public showPassword = signal<boolean>(false);
  public showConfirmPassword = signal<boolean>(false);
  public showTermsModal = signal<boolean>(false);

  public isOpen = signal<boolean>(false);
  public screenLantern = signal<boolean>(false);
  public backLantern = signal<boolean>(false);

  public reqLength = signal<boolean>(false);
  public reqUpper = signal<boolean>(false);
  public reqLower = signal<boolean>(false);
  public reqNum = signal<boolean>(false);
  public reqSym = signal<boolean>(false);

  public matchStatus = signal<boolean | null>(null);

  private subPass!: Subscription;
  private subConfirm!: Subscription;

  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)
    ]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  });

  ngOnInit(): void {
    this.subPass = this.registerForm.get('password')!.valueChanges.subscribe(val => {
      const v = val || '';
      this.reqLength.set(v.length >= 8);
      this.reqUpper.set(/[A-Z]/.test(v));
      this.reqLower.set(/[a-z]/.test(v));
      this.reqNum.set(/[0-9]/.test(v));
      this.reqSym.set(/[^A-Za-z0-9]/.test(v));
      this.validateMatch(); 
    });

    this.subConfirm = this.registerForm.get('confirmPassword')!.valueChanges.pipe(
      debounceTime(600)
    ).subscribe(() => {
      this.validateMatch();
    });
  }

  ngOnDestroy(): void {
    if (this.subPass) this.subPass.unsubscribe();
    if (this.subConfirm) this.subConfirm.unsubscribe();
  }

  private validateMatch(): void {
    const p1 = this.registerForm.get('password')?.value;
    const p2 = this.registerForm.get('confirmPassword')?.value;
    if (!p2) {
      this.matchStatus.set(null); 
    } else {
      this.matchStatus.set(p1 === p2);
    }
  }

  // Remove a blindagem quando o utilizador toca no formulário
  public disableReadonly(): void {
    if (this.isReadonly()) {
      this.isReadonly.set(false);
    }
  }

  public togglePassword(): void { this.showPassword.update(v => !v); }
  public toggleConfirmPassword(): void { this.showConfirmPassword.update(v => !v); }
  public toggleTermsModal(): void { this.showTermsModal.update(v => !v); }

  public toggleMenu(): void { this.isOpen.update(v => !v); }
  public changeTheme(newTheme: any): void { 
    this.themeService.setTheme(newTheme); 
    this.isOpen.set(false);
  }
  public toggleScreenLantern(): void { this.screenLantern.update(v => !v); }
  public toggleBackLantern(): void { this.backLantern.update(v => !v); }

  public onSubmit(): void {
    if (this.registerForm.invalid || this.matchStatus() !== true) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { name, email, password } = this.registerForm.getRawValue();

    this.authService.register({ name: name!, email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Ocorreu um erro ao processar o seu registro.');
      }
    });
  }
}