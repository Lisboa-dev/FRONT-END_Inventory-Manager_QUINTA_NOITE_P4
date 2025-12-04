import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Batch, Product } from '../types';

interface CreateBatchDTO {
  codigo: string;
  produto_id: number;
  quantidade: number;
  data_entrada: string;
  data_validade?: string;
}

const initialFormState: CreateBatchDTO = {
  codigo: '',
  produto_id: 0,
  quantidade: 0,
  data_entrada: '',
  data_validade: '',
};

export const Batches: React.FC = () => {
  const [lotes, setLotes] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<CreateBatchDTO>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLotes();
    fetchProducts();
  }, []);

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const data = await api.getBatches();
      setLotes(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar lotes.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err: any) {
      setError('Erro ao carregar produtos.');
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'produto_id' || name === 'quantidade'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateBatchDTO = {
      ...formData,
      data_entrada: new Date(formData.data_entrada).toISOString(),
      data_validade: formData.data_validade
        ? new Date(formData.data_validade).toISOString()
        : undefined,
    };

    try {
      if (editingId) {
        await api.updateBatch(editingId, payload);
        alert('Lote atualizado!');
      } else {
        await api.createBatch(payload);
        alert('Lote criado!');
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchLotes();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar lote.');
    }
  };

  const handleEdit = (lote: Batch) => {
    setEditingId(lote.id);
    setFormData({
      codigo: lote.codigo,
      produto_id: lote.produto_id,
      quantidade: lote.quantidade,
      data_entrada: lote.data_entrada.split('T')[0],
      data_validade: lote.data_validade ? lote.data_validade.split('T')[0] : '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir?')) return;

    try {
      await api.deleteBatch(id);
      fetchLotes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    backgroundColor: '#2d2d2d',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '4px',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: '#e0e0e0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>Gerenciar Lotes</h1>

        {error && <div style={{ background: '#4a1818', padding: 10, borderRadius: 4 }}>{error}</div>}

        <form
          onSubmit={handleSubmit}
          style={{ background: '#1e1e1e', padding: 20, borderRadius: 8, marginBottom: 30 }}
        >
          <h3>{editingId ? 'Editar Lote' : 'Novo Lote'}</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div>
              <label>Código</label>
              <input
                name="codigo"
                value={formData.codigo}
                onChange={handleInput}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Produto</label>
              <select
                name="produto_id"
                value={formData.produto_id}
                onChange={handleInput}
                required
                style={inputStyle}
              >
                <option value={0}>Selecione</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleInput}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Data de Entrada</label>
              <input
                type="date"
                name="data_entrada"
                value={formData.data_entrada}
                onChange={handleInput}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Data de Validade</label>
              <input
                type="date"
                name="data_validade"
                value={formData.data_validade}
                onChange={handleInput}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{ marginTop: 20, padding: '10px 20px', background: '#28a745', color: '#fff', borderRadius: 4 }}
          >
            {editingId ? 'Salvar' : 'Criar'}
          </button>
        </form>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Entrada</th>
              <th>Validade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.codigo}</td>
                <td>{l.produto_id}</td>
                <td>{l.quantidade}</td>
                <td>{new Date(l.data_entrada).toLocaleDateString()}</td>
                <td>{l.data_validade ? new Date(l.data_validade).toLocaleDateString() : '-'}</td>
                <td>
                  <button onClick={() => handleEdit(l)}>Editar</button>
                  <button onClick={() => handleDelete(l.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};
