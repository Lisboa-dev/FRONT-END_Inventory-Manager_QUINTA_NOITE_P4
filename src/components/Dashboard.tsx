import { useState, useEffect } from 'react';
import { Package, Box, Tag, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProdutoManager from './ProdutoManager';
import { Batches } from './Batches';
import { Categories } from './Categories';
import UserManager from './UserManager'; // Importa o novo componente

// Adiciona a nova aba 'users' ao tipo
type Tab = 'products' | 'batches' | 'categories' | 'users';

export const Dashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('products');

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Adiciona a nova aba à lista
  const tabs = [
    { id: 'products' as Tab, label: 'Produtos', icon: Package },
    { id: 'batches' as Tab, label: 'Lotes', icon: Box },
    { id: 'categories' as Tab, label: 'Categorias', icon: Tag },
    { id: 'users' as Tab, label: 'Usuários', icon: Users }, // Nova aba
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="text-blue-600 mr-3" size={32} />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestor de Inventário</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {/* Adiciona o novo componente à lógica de renderização */}
          {activeTab === 'products' && <ProdutoManager />}
          {activeTab === 'batches' && <Batches />}
          {activeTab === 'categories' && <Categories />}
          {activeTab === 'users' && <UserManager />}
        </div>
      </div>
    </div>
  );
};
