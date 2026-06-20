import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-card.component.html'
})
export class LocationCardComponent {
  // Recebe os dados processados pelo Dashboard-Pai
  @Input({ required: true }) locationCoords!: { lat: number, lon: number, latStr: string, lonStr: string };
  @Input({ required: true }) mapUrl!: SafeResourceUrl | null;
  @Input({ required: true }) cardClasses!: string;

  public themeService = inject(ThemeService);
  public theme = this.themeService.currentTheme;
}