import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  // Endpoint do backend (ajuste se for diferente no seu Java)
  private apiUrl = 'http://localhost:8080/api/posts';

  // Recebe a página atual e a quantidade de itens por página
  public getFeed(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}