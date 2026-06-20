import { Component, Input, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-time-sync-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './time-sync-card.component.html'
})
export class TimeSyncCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) cardClasses!: string;

  public themeService = inject(ThemeService);
  public theme = this.themeService.currentTheme;

  // Lógica Interna Automática do Relógio
  public now = signal<Date>(new Date());
  public utcHoursDeg = signal<number>(0);
  public utcMinsDeg = signal<number>(0);
  public localHoursDeg = signal<number>(0);
  public localMinsDeg = signal<number>(0);
  
  // Telemetria Astronômica
  public julianDate = signal<string>('');
  public siderealTime = signal<string>('');

  private timer: any;

  ngOnInit() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private updateTime() {
    const date = new Date();
    this.now.set(date);

    // Cálculos de ponteiros UTC
    const utcHours = date.getUTCHours();
    const utcMins = date.getUTCMinutes();
    this.utcHoursDeg.set((utcHours % 12) * 30 + utcMins * 0.5);
    this.utcMinsDeg.set(utcMins * 6);

    // Cálculos de ponteiros Locais
    const localHours = date.getHours();
    const localMins = date.getMinutes();
    this.localHoursDeg.set((localHours % 12) * 30 + localMins * 0.5);
    this.localMinsDeg.set(localMins * 6);

    // Cálculo exato do Dia Juliano (JD)
    const jd = (date.getTime() / 86400000) + 2440587.5;
    this.julianDate.set(jd.toFixed(4));

    // Cálculo do Tempo Sideral Médio de Greenwich (GMST) - Fórmula MVP
    const d = jd - 2451545.0;
    let gmst = 18.697374558 + 24.06570982441908 * d;
    gmst = gmst % 24;
    if (gmst < 0) gmst += 24;
    
    const h = Math.floor(gmst);
    const m = Math.floor((gmst - h) * 60);
    const s = Math.floor(((gmst - h) * 60 - m) * 60);
    const pad = (num: number) => num.toString().padStart(2, '0');
    this.siderealTime.set(`${pad(h)}:${pad(m)}:${pad(s)}`);
  }

  public localTimezoneOffset(): string {
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const pad = (num: number) => Math.floor(Math.abs(num)).toString().padStart(2, '0');
    return `UTC${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
  }

  public getLocalTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}