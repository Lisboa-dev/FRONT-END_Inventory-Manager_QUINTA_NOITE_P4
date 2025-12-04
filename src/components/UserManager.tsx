import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

const initialFormState = {
  nome: '',
  email: '',
  password: '',
  role: 'USER',
};

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (editingId && !formData.password) {
      delete (dataToSend as any).password;
    }

    try {
      if (editingId) {
        await api.updateUser(editingId, dataToSend);
        alert('Usuário atualizado com sucesso!');
      } else {
        await api.createUser(dataToSend);
        alert('Usuário criado com sucesso!');
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar usuário.');
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({ name: user.nome, email: user.email, password: '', role: user.role });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await api.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar usuário.');
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px', backgroundColor: '#2d2d2d', color: '#fff', border: '1px solid #555', borderRadius: '4px', boxSizing: 'border-box' };
  const tableHeaderStyle: React.CSSProperties = { padding: '10px', border: '1px solid #444', backgroundColor: '#333' };
  const tableCellStyle: React.CSSProperties = { padding: '10px', border: '1px solid #444' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#e0e0e0' }}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Gerenciar Usuários</h1>

        {error && <div style={{ backgroundColor: '#4a1818', color: '#ff9999', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div><label>Nome:</label><input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required style={inputStyle} /></div>
            <div><label>Email:</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={inputStyle} /></div>
            <div><label>Senha:</label><input type="password" name="password" value={formData.password} onChange={handleInputChange} required={!editingId} style={inputStyle} placeholder={editingId ? 'Deixe em branco para não alterar' : ''}/></div>
            <div><label>Role:</label><select name="role" value={formData.role} onChange={handleInputChange} style={inputStyle}><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select></div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>{editingId ? 'Salvar' : 'Criar'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData(initialFormState); }} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#555', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancelar</button>}
          </div>
        </form>

        {loading ? <p>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th><th style={tableHeaderStyle}>Nome</th><th style={tableHeaderStyle}>Email</th><th style={tableHeaderStyle}>Role</th><th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{...tableCellStyle, textAlign: 'center'}}>{user.id}</td>
                  <td style={tableCellStyle}>{user.nome}</td>
                  <td style={tableCellStyle}>{user.email}</td>
                  <td style={{...tableCellStyle, textAlign: 'center'}}>{user.role}</td>
                  <td style={{...tableCellStyle, textAlign: 'center', width: '120px' }}>
                    <button onClick={() => handleEdit(user)} style={{ marginRight: '8px', background: 'none', border: 'none', color: '#5dade2', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                    <button onClick={() => handleDelete(user.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>Excluir</button>
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

export default UserManager;
