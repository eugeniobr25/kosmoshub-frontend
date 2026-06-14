import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PostService } from '../../../core/services/post.service';
import { ThemeService } from '../../../core/services/theme.service';
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
  private sanitizer = inject(DomSanitizer);

  public theme = this.themeService.currentTheme;

  private timerInterval: any;
  public now = signal<Date>(new Date());
  
  public utcHoursDeg = signal<number>(0);
  public utcMinsDeg = signal<number>(0);
  public localHoursDeg = signal<number>(0);
  public localMinsDeg = signal<number>(0);

  public isNight = signal<boolean>(false);
  public localTimezoneOffset = signal<string>('');
  
  public mapUrl = signal<SafeResourceUrl | null>(null);

  public latestPost = signal<any | null>(null);
  public latestDiy = signal<any | null>(null);
  public latestPlan = signal<any | null>(null);
  
  public isLoadingPost = signal<boolean>(true);
  public isLoadingDiy = signal<boolean>(true);
  public isLoadingPlan = signal<boolean>(true);

  ngOnInit(): void {
    this.setupLocationMap();
    this.calculateTimezoneOffset();

    this.timerInterval = setInterval(() => {
      const d = new Date();
      this.now.set(d);
      
      this.utcHoursDeg.set((d.getUTCHours() % 12) * 30 + d.getUTCMinutes() * 0.5);
      this.utcMinsDeg.set(d.getUTCMinutes() * 6);
      this.localHoursDeg.set((d.getHours() % 12) * 30 + d.getMinutes() * 0.5);
      this.localMinsDeg.set(d.getMinutes() * 6);

      const h = d.getHours();
      this.isNight.set(h >= 18 || h < 5);
    }, 1000);
    
    this.loadLatestPost();
    this.loadLatestDiy();
    this.loadLatestPlan();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  public getLocalTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  private calculateTimezoneOffset(): void {
    const offset = -new Date().getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '-';
    const pad = (n: number) => String(Math.abs(n)).padStart(2, '0');
    this.localTimezoneOffset.set(`UTC ${sign}${pad(offset)}:00`);
  }

  private setupLocationMap(): void {
    const lat = -3.7319;
    const lon = -38.5267;
    const bbox = `${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}`;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
    this.mapUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
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
      'bg-white/80 border-slate-200 shadow-xl shadow-slate-200/30 text-slate-900': this.theme() === 'light',
      'bg-white/5 border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-cosmic-silver': this.theme() === 'dark',
      'bg-red-950/20 border-mars-red/30 shadow-[0_0_15px_rgba(239,68,68,0.05)] text-mars-red': this.theme() === 'red'
    };
  }

  public openImageModal(): void {
    console.log('Ativar Modal');
  }
}