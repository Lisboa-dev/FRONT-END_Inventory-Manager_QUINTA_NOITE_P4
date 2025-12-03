import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Category } from '../types';

const initialFormState = {
  nome: '',
};

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.updateCategory(editingId, formData);
        alert('Categoria atualizada com sucesso!');
      } else {
        await api.createCategory(formData);
        alert('Categoria criada com sucesso!');
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar categoria.');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ nome: category.nome });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await api.deleteCategory(id);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar categoria.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px', backgroundColor: '#2d2d2d', color: '#fff',
    border: '1px solid #555', borderRadius: '4px', boxSizing: 'border-box'
  };
  const tableHeaderStyle: React.CSSProperties = { padding: '10px', border: '1px solid #444', backgroundColor: '#333' };
  const tableCellStyle: React.CSSProperties = { padding: '10px', border: '1px solid #444' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#e0e0e0' }}>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Gerenciar Categorias</h1>

        {error && (
          <div style={{
            backgroundColor: '#4a1818', color: '#ff9999', padding: '10px',
            marginBottom: '10px', borderRadius: '4px', border: '1px solid #ff9999'
          }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '30px', padding: '20px', backgroundColor: '#1e1e1e',
            border: '1px solid #333', borderRadius: '8px'
          }}
        >
          <h3 style={{ marginTop: 0 }}>{editingId ? 'Editar Categoria' : 'Nova Categoria'}</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flexGrow: 1 }}>
              <label>Nome:</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
              {editingId ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Nome</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>{category.id}</td>
                  <td style={tableCellStyle}>{category.nome}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'center', width: '120px' }}>
                    <button onClick={() => handleEdit(category)} style={{ marginRight: '8px', background: 'none', border: 'none', color: '#5dade2', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                    <button onClick={() => handleDelete(category.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
