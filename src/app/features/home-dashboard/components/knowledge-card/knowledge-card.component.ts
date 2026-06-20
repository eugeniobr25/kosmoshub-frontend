import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-knowledge-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge-card.component.html'
})
export class KnowledgeCardComponent {
  @Input({ required: true }) cardClasses!: string;
  @Input({ required: true }) isLoadingDiy!: boolean;
  @Input({ required: true }) latestDiy!: any;

  public themeService = inject(ThemeService);
  public theme = this.themeService.currentTheme;
}