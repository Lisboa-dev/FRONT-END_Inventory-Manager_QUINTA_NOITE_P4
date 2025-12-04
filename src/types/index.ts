export interface User {
  id: number;
  nome: string;
  email: string;
}

export interface User_Api {
  nome: string;
  email: string;
  senha: string;
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
  id: number;
  nome: string;
  descricao?: string;
  barCode: string;
  preco: number;
  quantidade: number;
  lote_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product_Api{
  nome: string;
  descricao?: string;
  barCode: string;
  preco: number;
  quantidade: number;
  lote_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Batch {
  id: number;
  codigo:string;
  produto_id: number;
  quantidade: number;
  data_validade:string;
  genero_id?: number;
  created_at?: string;
}

export interface Batch_Api{
  codigo:string;
  produto_id: number;
  quantidade: number;
  data_validade:string;
  genero_id?: number;
  created_at?: string;
}

export interface Category {
  id: number;
  nome: string;
  created_at?: string;
}

export interface Category_Api{ 
  id: number;
  nome: string;
  created_at?: string;
}
