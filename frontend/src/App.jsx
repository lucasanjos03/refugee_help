import { useState } from 'react';
import Home from './pages/home';
import AdminDashboard from './pages/AdminDashboard';
import OngDashboard from './pages/OngDashboard';
import './App.css';

function App() {
  const [telaAtual, setTelaAtual] = useState('home');

  const logout = () => {
    localStorage.removeItem('basicAuth');
    setTelaAtual('home');
  };

  return (
    <div className="App">
      {telaAtual === 'home' && (
        <Home
          navegarParaAdmin={() => setTelaAtual('admin')}
          navegarParaOng={() => setTelaAtual('dashboard-ong')}
        />
      )}

      {telaAtual === 'admin' && (
        <AdminDashboard navegarParaHome={logout} />
      )}

      {telaAtual === 'dashboard-ong' && (
        <OngDashboard navegarParaHome={logout} />
      )}
    </div>
  );
}

export default App;
