import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeMode } from '../../../core/services/theme.service';

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

  // Vinculação direta do sinal para atualização instantânea no DOM
  public theme = this.themeService.currentTheme;

  public toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
  }

  public changeTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }

  public toggleScreenLantern(): void {
    this.screenLantern.set(!this.screenLantern());
  }

  public toggleBackLantern(): void {
    this.backLantern.set(!this.backLantern());
  }
}