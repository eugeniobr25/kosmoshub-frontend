import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.component.html'
})
export class WeatherCardComponent {
  @Input({ required: true }) cardClasses!: string;
  @Input({ required: true }) isWeatherLoading!: boolean;
  @Input({ required: true }) weatherData!: { cloudCover: number, humidity: number, windSpeed: number, seeing: string } | null;
  @Input({ required: true }) isNight!: boolean;
  
  // As duas propriedades dinâmicas
  @Input({ required: true }) currentDayAlert!: { title: string, tip: string, icon: string };
  @Input({ required: true }) currentNightTip!: { title: string, tip: string, icon: string };

  public themeService = inject(ThemeService);
  public theme = this.themeService.currentTheme;
}