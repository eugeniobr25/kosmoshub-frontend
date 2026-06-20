import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; 

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home-dashboard/home-dashboard/home-dashboard.component').then(m => m.HomeDashboardComponent)
  },
  {
    path: 'feed',
    canActivate: [authGuard], 
    loadComponent: () => import('./features/feed/feed-timeline/feed-timeline.component').then(m => m.FeedTimelineComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];