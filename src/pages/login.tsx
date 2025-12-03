import React, { useState } from 'react';
import { authService } from '../services/auth';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '', // Changed from password to senha
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The whole formData is sent, which now includes 'senha'
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        authService.setToken(data.token);
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Falha no login');
      }
    } catch (error) {
      setError('Ocorreu um erro ao tentar fazer login.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2d2d2d',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '4px',
    boxSizing: 'border-box' as 'border-box',
    marginBottom: '15px',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: '#e0e0e0'
    }}>
      <div style={{
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h1>

        {error && (
          <div style={{
            backgroundColor: '#4a1818',
            color: '#ff9999',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ff9999',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
            <input
              type="password"
              id="password"
              name="senha" // Changed from password to senha
              value={formData.senha} // Changed from formData.password
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
