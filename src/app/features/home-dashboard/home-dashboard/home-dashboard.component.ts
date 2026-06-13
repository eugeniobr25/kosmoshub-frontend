import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../core/services/post.service';
import { ThemeService } from '../../../core/services/theme.service';
// Importamos os nossos novos serviços
import { DiyProjectService } from '../../../core/services/diy-project.service';
import { ObservationPlanService } from '../../../core/services/observation-plan.service';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit, OnDestroy {
  public themeService = inject(ThemeService); 
  private postService = inject(PostService);
  private diyService = inject(DiyProjectService);
  private planService = inject(ObservationPlanService);

  public theme = this.themeService.currentTheme;

  private timerInterval: any;
  public now = signal<Date>(new Date());
  
  // Signals de Estado para os nossos Cartões
  public latestPost = signal<any | null>(null);
  public latestDiy = signal<any | null>(null);
  public latestPlan = signal<any | null>(null);
  
  public isLoadingPost = signal<boolean>(true);
  public isLoadingDiy = signal<boolean>(true);
  public isLoadingPlan = signal<boolean>(true);

  ngOnInit(): void {
    this.timerInterval = setInterval(() => {
      this.now.set(new Date());
    }, 1000);
    
    // Disparamos as três chamadas simultaneamente
    this.loadLatestPost();
    this.loadLatestDiy();
    this.loadLatestPlan();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private loadLatestPost(): void {
    this.postService.getFeed(0, 1).subscribe({
      next: (res) => {
        if (res.content && res.content.length > 0) this.latestPost.set(res.content[0]);
        this.isLoadingPost.set(false);
      },
      error: () => this.isLoadingPost.set(false)
    });
  }

  private loadLatestDiy(): void {
    this.diyService.getProjects(0, 1).subscribe({
      next: (res) => {
        if (res.content && res.content.length > 0) this.latestDiy.set(res.content[0]);
        this.isLoadingDiy.set(false);
      },
      error: () => this.isLoadingDiy.set(false)
    });
  }

  private loadLatestPlan(): void {
    this.planService.getPlans(0, 1).subscribe({
      next: (res) => {
        if (res.content && res.content.length > 0) this.latestPlan.set(res.content[0]);
        this.isLoadingPlan.set(false);
      },
      error: () => this.isLoadingPlan.set(false)
    });
  }

  public cardClasses() {
    return {
      'bg-white border-slate-300 text-slate-900': this.theme() === 'light',
      'bg-space-blue-light border-white/5 text-cosmic-silver': this.theme() === 'dark',
      'bg-mars-red-pure border-mars-red-dark/40 text-mars-red shadow-none': this.theme() === 'red'
    };
  }

  public openImageModal(): void {
    console.log('Ativar Modal com cores originais da imagem!');
  }
}