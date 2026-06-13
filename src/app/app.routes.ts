import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; 

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home-dashboard/home-dashboard/home-dashboard.component').then(m => m.HomeDashboardComponent)
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () => import('./features/observation-post/post-feed/post-feed.component').then(m => m.PostFeedComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];