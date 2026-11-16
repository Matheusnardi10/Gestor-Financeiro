import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Movimentacao, MovimentacoesService } from '../services/movimentacoes-service';

@Component({
  selector: 'app-cadastrar-movimentacao',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastrar-movimentacao.html',
  styleUrl: './cadastrar-movimentacao.css'
})
export class CadastrarMovimentacao implements OnInit {
  private api = inject(MovimentacoesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  categorias = ['Salário', 'Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros'];

  salvando = signal(false);
  erro = signal('');

  // bindings do form
  id = '';
  descricao = '';
  tipo: 'entrada' | 'saida' = 'saida';
  categoria = '';
  valor: number | null = null;
  data = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // modo edição: carrega a movimentação e preenche o form
    this.id = id;
    this.api.buscarPorId(id).subscribe({
      next: m => {
        this.descricao = m.descricao;
        this.tipo = m.tipo;
        this.categoria = m.categoria;
        this.valor = m.valor;
        this.data = m.data.substring(0, 10); // yyyy-MM-dd
        this.cdr.markForCheck();
      },
      error: e => this.erro.set(e.error?.error ?? 'Falha ao carregar')
    });
  }

  salvar() {
    if (!this.descricao.trim() || !this.categoria || this.valor == null || !this.data) {
      this.erro.set('Preencha todos os campos');
      return;
    }

    const mov: Movimentacao = {
      descricao: this.descricao.trim(),
      tipo: this.tipo,
      categoria: this.categoria,
      valor: Number(this.valor),
      data: this.data
    };

    this.erro.set('');
    this.salvando.set(true);

    const requisicao = this.id
      ? this.api.atualizar(this.id, mov) // PUT
      : this.api.criar(mov);             // POST

    requisicao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/lista']);
      },
      error: e => {
        this.erro.set(e.error?.error ?? 'Falha ao salvar');
        this.salvando.set(false);
      }
    });
  }
}