import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. O Segredo está aqui: adicionar o SidebarComponent a esta lista!
  imports: [CommonModule, SidebarComponent, RouterOutlet], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public theme = signal<'light' | 'dark' | 'red'>('dark');

  public setLightMode(): void {
    this.theme.set('light');
  }

  public setDarkMode(): void {
    this.theme.set('dark');
  }

  public setRedMode(): void {
    this.theme.set('red');
  }
}