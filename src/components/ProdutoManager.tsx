import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product } from '../types';

const initialFormState = {
  nome: '',
  descricao: '',
  preco: '',
  quantidade: '',
  genero_id: '',
};

const ProdutoManager: React.FC = () => {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [formData, setFormData] = useState<any>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProdutos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'preco' || name === 'quantidade' || name === 'genero_id'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const precoFinal =
      formData.preco === '' || isNaN(Number(formData.preco))
        ? 0
        : Number(formData.preco);

    const dataToSend = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: precoFinal,
      quantidade: Number(formData.quantidade),
      genero_id: formData.genero_id ? Number(formData.genero_id) : undefined,
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, dataToSend);
        alert('Produto atualizado com sucesso!');
      } else {
        await api.createProduct(dataToSend);
        alert('Produto criado com sucesso!');
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchProdutos();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar produto.');
    }
  };

  const handleEdit = (produto: Product) => {
    setEditingId(produto.id);

    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco.toString(),
      quantidade: produto.quantidade.toString(),
      genero_id: produto.genero_id?.toString() || '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await api.deleteProduct(id);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar produto.');
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

  const tableHeaderStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #444',
    backgroundColor: '#333',
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #444',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#e0e0e0' }}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Gerenciar Produtos</h1>

        {error && (
          <div
            style={{
              backgroundColor: '#4a1818',
              color: '#ff9999',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ff9999',
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #333',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {editingId ? 'Editar Produto' : 'Novo Produto'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
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

            <div>
              <label>Preço:</label>
              <input
                type="number"
                step="0.01"
                name="preco"
                value={formData.preco}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Quantidade:</label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Gênero (ID):</label>
              <input
                type="number"
                name="genero_id"
                value={formData.genero_id}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label>Descrição:</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              {editingId ? 'Salvar' : 'Criar'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialFormState);
                  setError(null);
                }}
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#555',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#444' }} border={1}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Nome</th>
                <th style={tableHeaderStyle}>Preço</th>
                <th style={tableHeaderStyle}>Quantidade</th>
                <th style={tableHeaderStyle}>Gênero</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>{produto.id}</td>
                  <td style={tableCellStyle}>{produto.nome}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                    R$ {(Number(produto.preco) || 0).toFixed(2)}
                  </td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    {produto.quantidade}
                  </td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    {produto.genero_id ?? '-'}
                  </td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(produto)}
                      style={{
                        marginRight: '8px',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        color: '#5dade2',
                        fontWeight: 'bold',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(produto.id)}
                      style={{
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        color: '#e74c3c',
                        fontWeight: 'bold',
                      }}
                    >
                      Excluir
                    </button>
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

export default ProdutoManager;
