import { useState, useEffect } from 'react';
import { Package, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onRegisterClick: () => void;
}

export const Login = ({ onRegisterClick }: LoginProps) => {
  const { login, isLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      const response = await api.login(formData);
      await login(response.access_token);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Ocorreu um erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="flex items-center justify-center mb-8">
          <Package className="text-blue-600 mr-3" size={40} />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gestor de Inventário</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Entrar
        </h2>

        {(localError || authError) && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="seu@email.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <button
              onClick={onRegisterClick}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Registar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
