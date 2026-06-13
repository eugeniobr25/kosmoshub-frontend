import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'red';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public currentTheme = signal<ThemeMode>('dark');

  public setTheme(mode: ThemeMode): void {
    this.currentTheme.set(mode);
  }
}