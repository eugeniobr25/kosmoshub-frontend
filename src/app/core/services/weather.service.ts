import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 🚀 CORREÇÃO EXATA AQUI
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  /**
   * Busca as condições atuais (Nuvens, Humidade, Vento e se é Dia/Noite)
   * utilizando a API gratuita da Open-Meteo.
   */
  public getCurrentWeather(lat: number, lon: number): Observable<any> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover,relative_humidity_2m,wind_speed_10m,is_day&timezone=auto`;
    return this.http.get<any>(url);
  }

  /**
   * Cálculo heurístico para estimar a qualidade do Seeing (Estabilidade Atmosférica).
   * Em apps profissionais, o seeing é calculado por modelos complexos, 
   * mas para o nosso MVP, usaremos vento e nuvens para criar uma estimativa tática.
   */
  public calculateSeeingHeuristic(windSpeed: number, cloudCover: number): string {
    if (cloudCover > 50) return 'Péssimo'; // Muitas nuvens destroem a observação
    if (windSpeed > 25) return 'Ruim';     // Vento forte causa turbulência no tubo do telescópio
    if (windSpeed > 15 || cloudCover > 20) return 'Médio';
    return 'Excelente'; // Céu limpo e atmosfera calma
  }
}