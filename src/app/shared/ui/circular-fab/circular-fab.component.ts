import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../core/services/theme.service';

@Component({
  selector: 'app-circular-fab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circular-fab.component.html'
})
export class CircularFabComponent {
  public themeService = inject(ThemeService);
  public isOpen = signal<boolean>(false);
  public screenLantern = signal<boolean>(false);
  public backLantern = signal<boolean>(false);
  public theme = this.themeService.currentTheme;

  public toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
  }

  public changeTheme(mode: Theme): void {
    this.themeService.setTheme(mode);
  }

  public toggleScreenLantern(): void {
    this.screenLantern.set(!this.screenLantern());
  }

  public toggleBackLantern(): void {
    this.backLantern.set(!this.backLantern());
  }
}