import { FormsModule } from '@angular/forms';
import { CATEGORIAS, corDaCategoria } from '../models/categorias';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Movimentacao, MovimentacoesService } from '../services/movimentacoes-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-movimentacoes',
  imports: [CurrencyPipe, DatePipe, RouterLink, FormsModule],
  templateUrl: './lista-movimentacoes.html',
  styleUrl: './lista-movimentacoes.css'
})
export class ListaMovimentacoes implements OnInit {
  private api = inject(MovimentacoesService);

  movimentacoes = signal<Movimentacao[]>([]);
  carregando = signal(false);
  erro = signal('');

    categorias = CATEGORIAS;
  cor = corDaCategoria;

  // filtros
  filtroCategoria = signal('');
  filtroTipo = signal('');

  filtradas = computed(() =>
    this.movimentacoes().filter(m =>
      (!this.filtroCategoria() || m.categoria === this.filtroCategoria()) &&
      (!this.filtroTipo() || m.tipo === this.filtroTipo())
    )
  );
  
    // gráfico de pizza: gastos (saídas) por categoria
  gastosPorCategoria = computed(() => {
    const saidas = this.movimentacoes().filter(m => m.tipo === 'saida');
    const total = saidas.reduce((t, m) => t + m.valor, 0);
    return this.categorias
      .map(c => {
        const valor = saidas.filter(m => m.categoria === c.nome).reduce((t, m) => t + m.valor, 0);
        return { nome: c.nome, cor: c.cor, valor, percentual: total ? (valor / total) * 100 : 0 };
      })
      .filter(g => g.valor > 0);
  });

  pizza = computed(() => {
    const gastos = this.gastosPorCategoria();
    if (gastos.length === 0) return '#e0e0e0';
    let acumulado = 0;
    const fatias = gastos.map(g => {
      const inicio = acumulado;
      acumulado += g.percentual;
      return `${g.cor} ${inicio}% ${acumulado}%`;
    });
    return `conic-gradient(${fatias.join(', ')})`;
  });

  totalEntradas = computed(() =>
    this.movimentacoes().filter(m => m.tipo === 'entrada').reduce((t, m) => t + m.valor, 0)
  );
  totalSaidas = computed(() =>
    this.movimentacoes().filter(m => m.tipo === 'saida').reduce((t, m) => t + m.valor, 0)
  );
  saldo = computed(() => this.totalEntradas() - this.totalSaidas());

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.api.listar().subscribe({
      next: xs => {
        this.movimentacoes.set(xs);
        this.carregando.set(false);
      },
      error: e => {
        this.erro.set(e.message ?? 'Falha ao carregar');
        this.carregando.set(false);
      }
    });
  }

  excluir(id?: string) {
    if (!id) return;
    this.api.excluir(id).subscribe({
      next: () => this.carregar(),
      error: e => this.erro.set(e.message ?? 'Falha ao excluir')
    });
  }
}