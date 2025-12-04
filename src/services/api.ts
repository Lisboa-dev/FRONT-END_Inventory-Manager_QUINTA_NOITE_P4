import { LoginCredentials, RegisterData, AuthResponse, User, Product, Batch, Category } from '../types';
import { createAuthHeaders } from './auth';
import { mockUsers, mockProducts, mockBatches, mockCategories } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

class ApiClient {
  private useMockData = USE_MOCK_DATA;
  private mockProductsData = [...mockProducts];
  private mockBatchesData = [...mockBatches];
  private mockCategoriesData = [...mockCategories];
  private mockUsersData = [...mockUsers];

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = createAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
        throw new Error(error.detail || `Erro HTTP: ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);

    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        if (this.useMockData) {
          console.warn('Servidor indisponível. Usando dados de teste.');
          return this.handleMockRequest<T>(endpoint, options);
        }
        throw new Error('Falha na comunicação com o servidor. Verifique a sua ligação ou tente mais tarde.');
      }
      throw error;
    }
  }

  private handleMockRequest<T>(endpoint: string, options: RequestInit): T {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Produtos
    if (endpoint === '/produtos' && method === 'GET') {
      return this.mockProductsData as any as T;
    }
    if (endpoint.match(/^\/produtos\/\d+$/) && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return this.mockProductsData.find(p => p.id === id) as any as T;
    }
    if (endpoint === '/produtos' && method === 'POST') {
      const newProduct: Product = {
        id: Math.max(...this.mockProductsData.map(p => p.id), 0) + 1,
        ...body,
      };
      this.mockProductsData.push(newProduct);
      return newProduct as any as T;
    }
    if (endpoint.match(/^\/produtos\/\d+$/) && method === 'PUT') {
      const id = parseInt(endpoint.split('/')[2]);
      const index = this.mockProductsData.findIndex(p => p.id === id);
      if (index !== -1) {
        this.mockProductsData[index] = { ...this.mockProductsData[index], ...body };
        return this.mockProductsData[index] as any as T;
      }
    }
    if (endpoint.match(/^\/produtos\/\d+$/) && method === 'DELETE') {
      const id = parseInt(endpoint.split('/')[2]);
      this.mockProductsData = this.mockProductsData.filter(p => p.id !== id);
      return {} as T;
    }

    // Lotes
    if (endpoint === '/lotes' && method === 'GET') {
      return this.mockBatchesData as any as T;
    }
    if (endpoint.match(/^\/lotes\/\d+$/) && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return this.mockBatchesData.find(b => b.id === id) as any as T;
    }
    if (endpoint === '/lotes' && method === 'POST') {
      const newBatch: Batch = {
        id: Math.max(...this.mockBatchesData.map(b => b.id), 0) + 1,
        ...body,
      };
      this.mockBatchesData.push(newBatch);
      return newBatch as any as T;
    }
    if (endpoint.match(/^\/lotes\/\d+$/) && method === 'PUT') {
      const id = parseInt(endpoint.split('/')[2]);
      const index = this.mockBatchesData.findIndex(b => b.id === id);
      if (index !== -1) {
        this.mockBatchesData[index] = { ...this.mockBatchesData[index], ...body };
        return this.mockBatchesData[index] as any as T;
      }
    }
    if (endpoint.match(/^\/lotes\/\d+$/) && method === 'DELETE') {
      const id = parseInt(endpoint.split('/')[2]);
      this.mockBatchesData = this.mockBatchesData.filter(b => b.id !== id);
      return {} as T;
    }

    // Categorias
    if (endpoint === '/generos' && method === 'GET') {
      return this.mockCategoriesData as any as T;
    }
    if (endpoint.match(/^\/generos\/\d+$/) && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return this.mockCategoriesData.find(c => c.id === id) as any as T;
    }
    if (endpoint === '/generos' && method === 'POST') {
      const newCategory: Category = {
        id: Math.max(...this.mockCategoriesData.map(c => c.id), 0) + 1,
        ...body,
      };
      this.mockCategoriesData.push(newCategory);
      return newCategory as any as T;
    }
    if (endpoint.match(/^\/generos\/\d+$/) && method === 'PUT') {
      const id = parseInt(endpoint.split('/')[2]);
      const index = this.mockCategoriesData.findIndex(c => c.id === id);
      if (index !== -1) {
        this.mockCategoriesData[index] = { ...this.mockCategoriesData[index], ...body };
        return this.mockCategoriesData[index] as any as T;
      }
    }
    if (endpoint.match(/^\/generos\/\d+$/) && method === 'DELETE') {
      const id = parseInt(endpoint.split('/')[2]);
      this.mockCategoriesData = this.mockCategoriesData.filter(c => c.id !== id);
      return {} as T;
    }

    // Usuários
    if (endpoint === '/users' && method === 'GET') {
      return this.mockUsersData as any as T;
    }
    if (endpoint.match(/^\/users\/\d+$/) && method === 'GET') {
      const id = parseInt(endpoint.split('/')[2]);
      return this.mockUsersData.find(u => u.id === id) as any as T;
    }
    if (endpoint === '/users' && method === 'POST') {
      const newUser: User = {
        id: Math.max(...this.mockUsersData.map(u => u.id), 0) + 1,
        ...body,
      };
      this.mockUsersData.push(newUser);
      return newUser as any as T;
    }
    if (endpoint.match(/^\/users\/\d+$/) && method === 'PUT') {
      const id = parseInt(endpoint.split('/')[2]);
      const index = this.mockUsersData.findIndex(u => u.id === id);
      if (index !== -1) {
        this.mockUsersData[index] = { ...this.mockUsersData[index], ...body };
        return this.mockUsersData[index] as any as T;
      }
    }
    if (endpoint.match(/^\/users\/\d+$/) && method === 'DELETE') {
      const id = parseInt(endpoint.split('/')[2]);
      this.mockUsersData = this.mockUsersData.filter(u => u.id !== id);
      return {} as T;
    }

    return {} as T;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Se usar mock data, testa localmente
    if (this.useMockData) {
      // Credenciais de teste válidas
      const validCredentials = [
        { email: 'joao@example.com', senha: '123456' },
        { email: 'maria@example.com', senha: '123456' },
        { email: 'pedro@example.com', senha: '123456' },
        { email: 'teste@example.com', senha: 'teste123' },
      ];

      const isValid = validCredentials.some(
        cred => cred.email === credentials.email && cred.senha === credentials.senha
      );

      if (isValid) {
        return {
          access_token: 'mock_token_' + Date.now(),
          user: {
            id: 1,
            email: credentials.email,
            username: credentials.email.split('@')[0],
            fullname: credentials.email.split('@')[0],
          },
        };
      } else {
        throw new Error('Email ou senha inválidos');
      }
    }

    return this.request<AuthResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<User> {
    if (this.useMockData) {
      const newUser: User = {
        id: Math.max(...this.mockUsersData.map(u => u.id), 0) + 1,
        email: data.email,
        username: data.username,
        fullname: data.fullname || data.username,
      };
      this.mockUsersData.push(newUser);
      return newUser;
    }

    return this.request<User>('/users/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/produtos');
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/produtos/${id}`);
  }

  async createProduct(product: Omit<Product, 'id' >): Promise<Product> {
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
    await this.request<void>(`/produtos/${id}`, {
      method: 'DELETE',
    });
  }

  async getBatches(): Promise<Batch[]> {
    return this.request<Batch[]>('/lotes');
  }

  async getBatch(id: number): Promise<Batch> {
    return this.request<Batch>(`/lotes/${id}`);
  }

  async createBatch(batch: Omit<Batch, 'id' | 'produto_id'>): Promise<Batch> {
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
    await this.request<void>(`/lotes/${id}`, {
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
    await this.request<void>(`/generos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
