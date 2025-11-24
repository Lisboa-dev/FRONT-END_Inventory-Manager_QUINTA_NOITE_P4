import { LoginCredentials, RegisterData, AuthResponse, User, Product, Batch, Category } from '../types';
import { createAuthHeaders } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = createAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.senha);

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/produtos');
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/produtos/${id}`);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return this.request<Product>('/produtos', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    return this.request<void>(`/produtos/${id}`, {
      method: 'DELETE',
    });
  }

  async getBatches(): Promise<Batch[]> {
    return this.request<Batch[]>('/lotes');
  }

  async getBatch(id: number): Promise<Batch> {
    return this.request<Batch>(`/lotes/${id}`);
  }

  async createBatch(batch: Omit<Batch, 'id'>): Promise<Batch> {
    return this.request<Batch>('/lotes', {
      method: 'POST',
      body: JSON.stringify(batch),
    });
  }

  async updateBatch(id: number, batch: Partial<Batch>): Promise<Batch> {
    return this.request<Batch>(`/lotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(batch),
    });
  }

  async deleteBatch(id: number): Promise<void> {
    return this.request<void>(`/lotes/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/generos');
  }

  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/generos/${id}`);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return this.request<Category>('/generos', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    return this.request<Category>(`/generos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/generos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
