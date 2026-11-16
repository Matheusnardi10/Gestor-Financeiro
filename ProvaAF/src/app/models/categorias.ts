export interface Categoria {
  nome: string;
  cor: string;
}

export const CATEGORIAS: Categoria[] = [
  { nome: 'Salário', cor: '#2e9e5b' },
  { nome: 'Alimentação', cor: '#e07b39' },
  { nome: 'Transporte', cor: '#3b82c4' },
  { nome: 'Moradia', cor: '#8e5bb5' },
  { nome: 'Lazer', cor: '#d94f8a' },
  { nome: 'Saúde', cor: '#d64545' },
  { nome: 'Educação', cor: '#c9a227' },
  { nome: 'Outros', cor: '#7a7a7a' }
];

export function corDaCategoria(nome: string): string {
  return CATEGORIAS.find(c => c.nome === nome)?.cor ?? '#7a7a7a';
}