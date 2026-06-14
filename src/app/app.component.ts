import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';
import { TopbarComponent } from './shared/ui/topbar/topbar.component';
import { ThemeService } from './core/services/theme.service';
import { LayoutService } from './core/services/layout.service';
import { CircularFabComponent } from './shared/ui/circular-fab/circular-fab.component'; 
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, CircularFabComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private themeService = inject(ThemeService);
  public authService = inject(AuthService);
  public layoutService = inject(LayoutService); // Controla a expansão da página
  public theme = this.themeService.currentTheme;
}