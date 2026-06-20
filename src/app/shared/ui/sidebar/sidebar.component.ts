import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  public themeService = inject(ThemeService);
  public layoutService = inject(LayoutService);
  public theme = this.themeService.currentTheme;

  public getLogoExpandedUrl(): string {
    const t = this.theme();
    if (t === 'dark') return '/assets/images/logo-no-name-grey.png';
    if (t === 'red') return '/assets/images/logo-no-name-red.png';
    return '/assets/images/logo-no-name.png';
  }

  public getLogoCollapsedUrl(): string {
    const t = this.theme();
    if (t === 'dark') return '/assets/images/logo-name-grey.png';
    if (t === 'red') return '/assets/images/logo-name-red.png';
    return '/assets/images/logo-name.png';
  }

  // Intercetor de Cliques: Recolhe a Sidebar caso o utilizador esteja em ecrãs Mobile/Tablet
  public handleNavigationClick(): void {
    if (window.innerWidth < 1024) { // Ponto de rutura 'lg' do Tailwind
      this.layoutService.toggleSidebar(); // Fecha suavemente a gaveta
    }
  }
}