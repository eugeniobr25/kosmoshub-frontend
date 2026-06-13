import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  // Altere a URL base se o seu endpoint no Spring Boot for diferente
  private apiUrl = 'http://localhost:8080/api/posts';

  // SINAIS DE ESTADO (O "Cérebro" da Timeline)
  public posts = signal<any[]>([]); // Array cumulativo de posts
  public currentPage = signal<number>(0);
  public isLoading = signal<boolean>(false);
  public isLastPage = signal<boolean>(false); // Impede chamadas desnecessárias quando a lista acaba

  // Mantive o seu método original para não quebrar o Dashboard
  public getFeed(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  // Novo método inteligente para a Diretiva acionar
  public loadNextPage(size: number = 10): void {
    // Se já estiver a carregar ou não houver mais dados no banco, cancela a ação
    if (this.isLoading() || this.isLastPage()) return;

    this.isLoading.set(true);

    this.getFeed(this.currentPage(), size).subscribe({
      next: (response) => {
        // Pega no array atual de posts e junta (spread operator) com os novos posts que chegaram
        this.posts.update(current => [...current, ...response.content]);
        
        // O Spring Boot devolve uma flag 'last' verdadeira se for a última página do banco
        this.isLastPage.set(response.last); 
        
        // Se houver mais páginas, incrementa o contador para o próximo scroll
        if (!response.last) {
          this.currentPage.update(page => page + 1);
        }
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Falha de telemetria ao carregar o feed:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Ferramenta útil para limpar a lista quando o utilizador puxar a tela para atualizar (pull-to-refresh)
  public resetFeed(): void {
    this.posts.set([]);
    this.currentPage.set(0);
    this.isLastPage.set(false);
  }
}