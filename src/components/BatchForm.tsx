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

interface BatchFormState {
  produto_id: string;
  quantidade: string;
  data_entrada: string;
  data_validade: string;
}

type CreateBatchDTO = {
  produto_id: number;
  quantidade: number;
  data_entrada: string;
  data_validade?: string;
};

export const BatchForm = ({ batch, products, onClose, onSuccess }: BatchFormProps) => {
  const [formData, setFormData] = useState<BatchFormState>({
    produto_id: '',
    quantidade: '',
    data_entrada: '',
    data_validade: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Preenche o formulário ao editar
  useEffect(() => {
    if (batch) {
      setFormData({
        produto_id: batch.produto_id.toString(),
        quantidade: batch.quantidade.toString(),
        data_entrada: batch.data_entrada.split('T')[0],
        data_validade: batch.data_validade ? batch.data_validade.split('T')[0] : '',
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        data_entrada: today,
      }));
    }
  }, [batch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dto: CreateBatchDTO = {
        produto_id: Number(formData.produto_id),
        quantidade: Number(formData.quantidade),
        data_entrada: formData.data_entrada,
        data_validade:
          formData.data_validade.trim() === '' ? undefined : formData.data_validade,
      };

      if (batch) {
        await api.updateBatch(batch.id, dto);
      } else {
        await api.createBatch(dto);
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Produto *
            </label>
            <select
              value={formData.produto_id}
              onChange={(e) => setFormData({ ...formData, produto_id: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantidade *
            </label>
            <input
              type="number"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          {/* Data de entrada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Entrada *
            </label>
            <input
              type="date"
              value={formData.data_entrada}
              onChange={(e) => setFormData({ ...formData, data_entrada: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          {/* Validade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Validade
            </label>
            <input
              type="date"
              value={formData.data_validade}
              onChange={(e) => setFormData({ ...formData, data_validade: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
