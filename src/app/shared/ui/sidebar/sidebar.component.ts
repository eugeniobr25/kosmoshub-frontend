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

  // Lógica inteligente para cruzar a expansão com a cor do tema
  public getLogoUrl(): string {
    const isExpanded = this.layoutService.isSidebarExpanded();
    const currentTheme = this.theme();

    if (currentTheme === 'dark') {
      return isExpanded ? '/assets/images/logo-name-grey.png' : '/assets/images/logo-no-name-grey.png';
    } else if (currentTheme === 'red') {
      return isExpanded ? '/assets/images/logo-name-red.png' : '/assets/images/logo-no-name-red.png';
    } else {
      // Tema Claro (Light)
      return isExpanded ? '/assets/images/logo-name.png' : '/assets/images/logo-no-name.png';
    }
  }
}