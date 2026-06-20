import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnInit {
  public themeService = inject(ThemeService);
  public authService = inject(AuthService);
  private router = inject(Router);
  public theme = this.themeService.currentTheme;
  public isMenuOpen = signal<boolean>(false);
  public pageTitle = signal<string>('Controle de Missão');
  public userFirstName = signal<string>('Astrónomo');
  public userAvatarUrl = signal<string | null>(null);
  public layoutService = inject(LayoutService);

  ngOnInit() {
    this.updateTitleByUrl(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTitleByUrl(event.urlAfterRedirects);
    });

    // Simulando retorno do backend (Nome do usuário e Foto)
    this.userFirstName.set('Eugênio'); 
    this.userAvatarUrl.set(null); 
  }

  private updateTitleByUrl(url: string): void {
    if (url.includes('/feed')) {
      this.pageTitle.set('Registros de Observação');
    } else if (url.includes('/dashboard')) {
      this.pageTitle.set('Controle de Missão');
    } else {
      this.pageTitle.set('KósmosHub');
    }
  }

  public toggleProfileMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  public logout(): void {
    this.authService.logout();
  }
}