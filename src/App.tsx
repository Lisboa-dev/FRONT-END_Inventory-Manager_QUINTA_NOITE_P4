import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleRegisterSuccess = () => {
    setShowSuccessMessage(true);
    setShowRegister(false);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (showRegister) {
    return (
      <Register
        onLoginClick={() => setShowRegister(false)}
        onSuccess={handleRegisterSuccess}
      />
    );
  }

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Account created successfully! Please sign in.
        </div>
      )}
      <Login onRegisterClick={() => setShowRegister(true)} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
