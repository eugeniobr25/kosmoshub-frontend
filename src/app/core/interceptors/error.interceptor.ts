import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se for 401 (não autorizado), deslogamos o utilizador
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/features/auth/login']);
      }
      
      console.error('KósmosHub API Error:', error);
      return throwError(() => error);
    })
  );
};