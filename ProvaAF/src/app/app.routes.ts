import { Routes } from '@angular/router';
import { ListaMovimentacoes } from './lista-movimentacoes/lista-movimentacoes';
import { CadastrarMovimentacao } from './cadastrar-movimentacao/cadastrar-movimentacao';

export const routes: Routes = [
  { path: 'lista', component: ListaMovimentacoes },
  { path: 'cadastro', component: CadastrarMovimentacao },
  { path: 'cadastro/:id', component: CadastrarMovimentacao },
  { path: '', redirectTo: 'lista', pathMatch: 'full' }
];