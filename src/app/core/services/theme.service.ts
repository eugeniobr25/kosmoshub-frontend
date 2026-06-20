import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'red';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Inicializa o tema buscando no LocalStorage ou no Sistema Operativo
  public currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Effect: Sempre que o signal currentTheme mudar, salvamos no LocalStorage automaticamente
    effect(() => {
      const theme = this.currentTheme();
      localStorage.setItem('kosmoshub_theme', theme);
      
      // Caso precise aplicar classes diretamente no <body> do HTML no futuro:
      // document.body.className = theme === 'dark' ? 'dark-theme' : '';
    });
  }

  private getInitialTheme(): Theme {
    // 1. Tenta buscar a última escolha do usuário salva no navegador
    const savedTheme = localStorage.getItem('kosmoshub_theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // 2. Se for o primeiro acesso, lê a preferência do Sistema Operativo / Browser
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'; // O Windows/Mac/iOS do usuário está no modo escuro
    }

    // 3. Fallback padrão
    return 'light'; 
  }

  public setTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }
}