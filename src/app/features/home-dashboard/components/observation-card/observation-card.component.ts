import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-observation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observation-card.component.html'
})
export class ObservationCardComponent {
  @Input({ required: true }) cardClasses!: string;
  @Input({ required: true }) isLoadingPost!: boolean;
  @Input({ required: true }) latestPost!: any;
  
  // Emite o evento de clique para o Pai abrir o Modal
  @Output() imageClick = new EventEmitter<void>();

  public themeService = inject(ThemeService);
  public theme = this.themeService.currentTheme;
}