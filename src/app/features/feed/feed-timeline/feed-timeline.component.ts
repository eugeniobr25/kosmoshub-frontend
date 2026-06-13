import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../core/services/post.service';
import { ThemeService } from '../../../core/services/theme.service';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll';

@Component({
  selector: 'app-feed-timeline',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
  templateUrl: './feed-timeline.component.html'
})
export class FeedTimelineComponent implements OnInit {
  public postService = inject(PostService);
  public themeService = inject(ThemeService);
  public theme = this.themeService.currentTheme;

  ngOnInit(): void {
    // Limpa o feed se vier de outra página e carrega a primeira leva de posts
    this.postService.resetFeed();
    this.loadMore();
  }

  // Método disparado pela diretiva quando o utilizador chega ao fim da tela
  public onScroll(): void {
    this.loadMore();
  }

  private loadMore(): void {
    this.postService.loadNextPage(5); // Trazemos 5 de cada vez para otimizar memória mobile
  }

  // Controle de CSS do Card baseado no tema global
  public getCardClasses() {
    return {
      'bg-white border-slate-300 text-slate-900': this.theme() === 'light',
      'bg-space-blue-light border-white/5 text-cosmic-silver': this.theme() === 'dark',
      'bg-mars-red-pure border-mars-red-dark/40 text-mars-red shadow-none': this.theme() === 'red'
    };
  }
}