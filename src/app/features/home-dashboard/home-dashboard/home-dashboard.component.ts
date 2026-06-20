import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ThemeService } from '../../../core/services/theme.service';
import { WeatherService } from '../../../core/services/weather.service';

import { LocationCardComponent } from '../components/location-card/location-card.component';
import { TimeSyncCardComponent } from '../components/time-sync-card/time-sync-card.component';
import { WeatherCardComponent } from '../components/weather-card/weather-card.component';
import { PlanCardComponent } from '../components/plan-card/plan-card.component';
import { ObservationCardComponent } from '../components/observation-card/observation-card.component';
import { KnowledgeCardComponent } from '../components/knowledge-card/knowledge-card.component';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    LocationCardComponent, 
    TimeSyncCardComponent, 
    WeatherCardComponent, 
    PlanCardComponent, 
    ObservationCardComponent, 
    KnowledgeCardComponent
  ],
  templateUrl: './home-dashboard.component.html'
})
export class HomeDashboardComponent implements OnInit {
  public themeService = inject(ThemeService);
  private weatherService = inject(WeatherService);
  private sanitizer = inject(DomSanitizer);

  public theme = this.themeService.currentTheme;

  // Estados de Telemetria e Sensores
  public isWeatherLoading = signal<boolean>(true);
  public isNight = signal<boolean>(true);
  public weatherData = signal<{ cloudCover: number, humidity: number, windSpeed: number, seeing: string } | null>(null);

  public mapUrl = signal<SafeResourceUrl | null>(null);
  public locationCoords = signal<{ lat: number, lon: number, latStr: string, lonStr: string }>({ 
    lat: -3.73, lon: -38.52, latStr: "3° 43' S", lonStr: "38° 32' W" 
  });

  // Mocks estruturais para as Cargas Úteis de Dados
  public isLoadingPost = signal<boolean>(false);
  public latestPost = signal<any>(null);
  public isLoadingPlan = signal<boolean>(false);
  public latestPlan = signal<any>(null);
  public isLoadingDiy = signal<boolean>(false);
  public latestDiy = signal<any>(null);

  // SINAIS DOS ALERTAS DINÂMICOS
  public currentDayAlert = signal<{title: string, tip: string, icon: string}>({ title: '', tip: '', icon: '' });
  public currentNightTip = signal<{title: string, tip: string, icon: string}>({ title: '', tip: '', icon: '' });

  // ARSENAL DE ALERTAS DIURNOS (Segurança Solar e UV)
  private dayAlerts = [
    { title: 'Risco de Cegueira', tip: 'Nunca aponte o telescópio ou binóculo para o Sol sem filtros Baader. A queima da retina é instantânea e irreversível.', icon: 'fa-eye-low-vision' },
    { title: 'Exposição UV Extrema', tip: 'Observação diurna exige proteção. Use protetor solar FPS 50+, chapéu e roupas UV. Evite insolação e queimaduras.', icon: 'fa-temperature-arrow-up' },
    { title: 'Cuidado com a Buscadora', tip: 'Mantenha a buscadora (finderscope) tampada. O Sol concentrado nela pode causar incêndios nas suas roupas ou pele.', icon: 'fa-fire' },
    { title: 'Manchas Solares', tip: 'Filtro seguro instalado? Aproveite para fotografar manchas solares, mas faça pausas para resfriar o equipamento e hidratar-se.', icon: 'fa-camera' }
  ];

  // ARSENAL DE DICAS NOTURNAS (Lunar, Planetário e Visual)
  private nightTips = [
    { title: 'Ofuscamento Lunar', tip: 'A Lua cheia em telescópios causa ofuscamento e dor. Use sempre um filtro polarizador ou filtro lunar na ocular.', icon: 'fa-moon' },
    { title: 'Janela Planetária', tip: 'Júpiter e suas luas estão visíveis. Use oculares de baixa milimetragem para detalhes das faixas de gás.', icon: 'fa-satellite' },
    { title: 'Adaptação Visual', tip: 'Demora 30 minutos para os olhos se adaptarem ao escuro total. Mantenha o app no Modo Vermelho e evite faróis.', icon: 'fa-eye' },
    { title: 'Céu Profundo (DSO)', tip: 'Noite sem Lua? É a janela perfeita para buscar nebulosas fracas com filtros UHC ou de Banda Estreita.', icon: 'fa-star' }
  ];

  ngOnInit(): void {
    this.initLocationAndWeather();
  }

  public cardClasses(): string {
    const t = this.theme();
    if (t === 'dark') return 'bg-space-blue-dark/50 border-white/10 text-cosmic-silver';
    if (t === 'red') return 'bg-pure-black/60 border-mars-red/20 text-mars-red shadow-[0_0_15px_rgba(239,68,68,0.1)]';
    return 'bg-white/60 border-slate-200 text-slate-900 shadow-xl';
  }

  public initLocationAndWeather(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.updateLocationStrings(position.coords.latitude, position.coords.longitude);
          this.fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          this.updateLocationStrings(this.locationCoords().lat, this.locationCoords().lon);
          this.fetchWeather(this.locationCoords().lat, this.locationCoords().lon);
        }
      );
    } else {
      this.updateLocationStrings(this.locationCoords().lat, this.locationCoords().lon);
      this.fetchWeather(this.locationCoords().lat, this.locationCoords().lon);
    }
  }

  private updateLocationStrings(lat: number, lon: number): void {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    const latDeg = Math.floor(Math.abs(lat));
    const latMin = Math.floor((Math.abs(lat) - latDeg) * 60);
    const lonDeg = Math.floor(Math.abs(lon));
    const lonMin = Math.floor((Math.abs(lon) - lonDeg) * 60);

    this.locationCoords.set({ lat, lon, latStr: `${latDeg}° ${latMin}' ${latDir}`, lonStr: `${lonDeg}° ${lonMin}' ${lonDir}` });

    const url = `https://maps.google.com/maps?q=${lat},${lon}&t=k&z=11&ie=UTF8&iwloc=&output=embed`;
    this.mapUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  private fetchWeather(lat: number, lon: number): void {
    this.isWeatherLoading.set(true);
    this.weatherService.getCurrentWeather(lat, lon).subscribe({
      next: (res) => {
        const current = res.current;
        this.weatherData.set({
          cloudCover: current.cloud_cover,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          seeing: this.weatherService.calculateSeeingHeuristic(current.wind_speed_10m, current.cloud_cover)
        });
        
        const isNightTime = current.is_day === 0;
        this.isNight.set(isNightTime);

        // SORTEIO ALEATÓRIO DE ALERTAS NA ATUALIZAÇÃO DA TELA
        this.currentDayAlert.set(this.dayAlerts[Math.floor(Math.random() * this.dayAlerts.length)]);
        this.currentNightTip.set(this.nightTips[Math.floor(Math.random() * this.nightTips.length)]);

        this.isWeatherLoading.set(false);
      },
      error: () => this.isWeatherLoading.set(false)
    });
  }

  public openImageModal(): void {}
}