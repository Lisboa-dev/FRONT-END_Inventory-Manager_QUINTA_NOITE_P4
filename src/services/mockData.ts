import { User, Product, Batch, Category } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'joao',
    email: 'joao@example.com',
    fullname: 'João Silva',
  },
  {
    id: 2,
    username: 'maria',
    email: 'maria@example.com',
    fullname: 'Maria Santos',
  },
  {
    id: 3,
    username: 'pedro',
    email: 'pedro@example.com',
    fullname: 'Pedro Costa',
  },
];

export const mockCategories: Category[] = [
  {
    id: 1,
    nome: 'Eletrônicos',
    descricao: 'Produtos eletrônicos em geral',
  },
  {
    id: 2,
    nome: 'Alimentos',
    descricao: 'Alimentos e bebidas',
  },
  {
    id: 3,
    nome: 'Roupas',
    descricao: 'Vestuário e acessórios',
  },
  {
    id: 4,
    nome: 'Livros',
    descricao: 'Livros e materiais de leitura',
  },
];

export const mockBatches: Batch[] = [
  {
    id: 1,
    nome: 'Lote A - Janeiro/2025',
    dataEntrada: '2025-01-15',
    dataValidade: '2025-06-15',
    quantidade: 100,
    categoriasId: 1,
  },
  {
    id: 2,
    nome: 'Lote B - Fevereiro/2025',
    dataEntrada: '2025-02-01',
    dataValidade: '2025-12-01',
    quantidade: 250,
    categoriasId: 2,
  },
  {
    id: 3,
    nome: 'Lote C - Março/2025',
    dataEntrada: '2025-03-10',
    dataValidade: '2026-03-10',
    quantidade: 75,
    categoriasId: 3,
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    nome: 'Notebook Dell',
    barCode: '123456789001',
    descricao: 'Notebook Dell Inspiron 15',
    preco: 1299.99,
    loteId: 1,
  },
  {
    id: 2,
    nome: 'Mouse Logitech',
    barCode: '123456789002',
    descricao: 'Mouse sem fio Logitech MX Master',
    preco: 99.99,
    loteId: 1,
  },
  {
    id: 3,
    nome: 'Teclado Mecânico',
    barCode: '123456789003',
    descricao: 'Teclado mecânico RGB',
    preco: 249.99,
    loteId: 1,
  },
  {
    id: 4,
    nome: 'Arroz Integral 5kg',
    barCode: '987654321001',
    descricao: 'Arroz integral tipo 1 - 5kg',
    preco: 28.50,
    loteId: 2,
  },
  {
    id: 5,
    nome: 'Feijão Carioca 1kg',
    barCode: '987654321002',
    descricao: 'Feijão carioca premium - 1kg',
    preco: 8.99,
    loteId: 2,
  },
  {
    id: 6,
    nome: 'Camiseta Básica',
    barCode: '555666777001',
    descricao: 'Camiseta básica 100% algodão',
    preco: 39.99,
    loteId: 3,
  },
  {
    id: 7,
    nome: 'Calça Jeans',
    barCode: '555666777002',
    descricao: 'Calça jeans azul escuro',
    preco: 119.99,
    loteId: 3,
  },
  {
    id: 8,
    nome: '1984 - George Orwell',
    barCode: '222333444001',
    descricao: 'Romance distópico de George Orwell',
    preco: 45.90,
    loteId: 4,
  },
];
