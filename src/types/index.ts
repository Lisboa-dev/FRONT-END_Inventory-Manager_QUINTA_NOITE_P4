export interface User {
  id?: number;
  nome: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Product {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  barcode: string;
  loteId?: number;
}

export interface Batch {
  id?: number;
  codigo:string;
  quantidade: number;
  data_validade: string;
  created_at?: string;
}

export interface Category {
  id?: number;
  nome: string;
  descricao?: string;
  created_at?: string;
}
