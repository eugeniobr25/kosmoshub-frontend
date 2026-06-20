import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-plan-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-card.component.html'
})
export class PlanCardComponent {
  @Input({ required: true }) cardClasses!: string;
  @Input({ required: true }) isLoadingPlan!: boolean;
  @Input({ required: true }) latestPlan!: any;

  public themeService = inject(ThemeService);
  public theme = this.themeService.currentTheme;
}