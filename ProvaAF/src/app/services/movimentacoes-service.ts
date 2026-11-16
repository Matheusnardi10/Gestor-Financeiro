import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movimentacao {
  _id?: string;
  descricao: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  valor: number;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/movimentacoes';

  listar(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(this.base);
  }

  buscarPorId(id: string): Observable<Movimentacao> {
    return this.http.get<Movimentacao>(`${this.base}/${id}`);
  }

  criar(mov: Movimentacao): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(this.base, mov);
  }

  atualizar(id: string, mov: Movimentacao): Observable<Movimentacao> {
    return this.http.put<Movimentacao>(`${this.base}/${id}`, mov);
  }

  excluir(id: string): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}