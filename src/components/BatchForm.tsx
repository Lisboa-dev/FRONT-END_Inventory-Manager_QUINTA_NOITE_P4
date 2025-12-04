import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';
import { Batch, Product } from '../types';

interface BatchFormProps {
  batch: Batch | null;
  products: Product[];
  onClose: () => void;
  onSuccess: () => void;
}

export const BatchForm = ({ batch, products, onClose, onSuccess }: BatchFormProps) => {
  const [formData, setFormData] = useState({
    codigo: '',
    quantidade: '',
    data_validade: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (batch) {
      setFormData({
        quantidade: batch.quantidade.toString(),
        codigo: batch.codigo.split('T')[0],
        data_validade: batch.data_validade ? batch.data_validade.split('T')[0] : '',
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, data_validade: today }));
    }
  }, [batch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const batchData = {
        quantidade: parseInt(formData.quantidade),
        data_validade: formData.data_validade,
        codigo: formData.codigo,
      };

      if (batch) {
        if(batch.id){
        await api.updateBatch(batch.id, batchData);}
      } else {
        await api.createBatch(batchData);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao guardar o lote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {batch ? 'Editar Lote' : 'Adicionar Lote'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              codigo *
            </label>
            <select
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantidade *
            </label>
            <input
              type="number"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Validade
            </label>
            <input
              type="date"
              value={formData.data_validade}
              onChange={(e) => setFormData({ ...formData, data_validade: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
