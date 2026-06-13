import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se o token existir e a requisição for para a nossa API, clonamos a requisição e injetamos o token
  if (token && req.url.includes('localhost:8080/api')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Se não houver token, deixa passar a requisição original (útil para a própria rota de login)
  return next(req);
};