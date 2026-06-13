import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservationPlanService {
  private http = inject(HttpClient);
  // Altere a URL base se o seu endpoint no Spring Boot for diferente
  private apiUrl = 'http://localhost:8080/api/plans';

  public getPlans(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.apiUrl, { params });
  }
}