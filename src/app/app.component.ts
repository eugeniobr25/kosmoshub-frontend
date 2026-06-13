import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';
import { ThemeService } from './core/services/theme.service';
import { CircularFabComponent } from './shared/ui/circular-fab/circular-fab.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, CircularFabComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private themeService = inject(ThemeService);
  public theme = this.themeService.currentTheme;
}