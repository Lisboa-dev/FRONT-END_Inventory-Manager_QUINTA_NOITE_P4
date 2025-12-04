import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Batch } from '../types';

const initialFormState = {
  codigo: '',
  data_validade: '',
  quantidade: 0,
};

export const Batches: React.FC = () => {
  const [lotes, setLotes] = useState<Batch[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLotes();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        data_validade: formData.data_validade ? new Date(formData.data_validade).toISOString() : new Date().toISOString(),
        quantidade: Number(formData.quantidade),


      };

      if (editingId) {
        await api.updateBatch(editingId, payload);
        alert('Lote atualizado com sucesso!');
      } else {
        await api.createBatch(payload);
        alert('Lote criado com sucesso!');
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchLotes();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar lote.');
    }
  };

  const handleEdit = (lote: Batch) => {
    if (lote.id){
    setEditingId(lote.id);}
    setFormData({
      codigo: lote.codigo,
      data_validade: new Date(lote.data_validade).toISOString().split('T')[0],
      quantidade: lote.quantidade,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este lote?')) return;
    try {
      await api.deleteBatch(id);
      fetchLotes();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar lote.');
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px', backgroundColor: '#2d2d2d', color: '#fff', border: '1px solid #555', borderRadius: '4px', boxSizing: 'border-box' };
  const tableHeaderStyle: React.CSSProperties = { padding: '10px', border: '1px solid #444', backgroundColor: '#333' };
  const tableCellStyle: React.CSSProperties = { padding: '10px', border: '1px solid #444' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#e0e0e0' }}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Gerenciar Lotes</h1>

        {error && <div style={{ backgroundColor: '#4a1818', color: '#ff9999', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ff9999' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>{editingId ? 'Editar Lote' : 'Novo Lote'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>Código:</label>
              <input type="text" name="codigo" value={formData.codigo} onChange={handleInputChange} required style={inputStyle} />
            </div>
            <div>
              <label>Data de Entrada:</label>
              <input type="date" name="data_validade" value={formData.data_validade} onChange={handleInputChange} required style={inputStyle} />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>{editingId ? 'Salvar' : 'Criar'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData(initialFormState); }} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>}
          </div>
        </form>

        {loading ? <p>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Código</th>
                <th style={tableHeaderStyle}>Data de Entrada</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => (
                <tr key={lote.id}>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>{lote.id}</td>
                  <td style={tableCellStyle}>{lote.codigo}</td>
                  <td style={tableCellStyle}>{new Date(lote.data_validade).toLocaleDateString()}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'center', width: '120px' }}>
                    <button onClick={() => handleEdit(lote)} style={{ marginRight: '8px', background: 'none', border: 'none', color: '#5dade2', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                    <button onClick={() => handleDelete(lote.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>Excluir</button>
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
