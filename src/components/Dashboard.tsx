import { useState } from 'react';
import { Package, Box, Tag, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Products } from './Products';
import { Batches } from './Batches';
import { Categories } from './Categories';

type Tab = 'products' | 'batches' | 'categories';

export const Dashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('products');

  const tabs = [
    { id: 'products' as Tab, label: 'Products', icon: Package },
    { id: 'batches' as Tab, label: 'Batches', icon: Box },
    { id: 'categories' as Tab, label: 'Categories', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="text-blue-600 mr-3" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">Inventory Manager</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 border-b border-gray-200">
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
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {activeTab === 'products' && <Products />}
          {activeTab === 'batches' && <Batches />}
          {activeTab === 'categories' && <Categories />}
        </div>
      </div>
    </div>
  );
};
