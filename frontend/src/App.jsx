import React, { useState } from 'react';
import Home from './pages/home';
import AdminDashboard from './pages/AdminDashboard';
import OngDashboard from './pages/OngDashboard'; // Vamos simular este componente abaixo

function App() {
  const [telaAtual, setTelaAtual] = useState('home');

  return (
    <div className="App">
      {telaAtual === 'home' && (
        <Home 
          navegarParaAdmin={() => setTelaAtual('admin')} 
          navegarParaOng={() => setTelaAtual('dashboard-ong')} 
        />
      )}

      {telaAtual === 'admin' && (
        <AdminDashboard navegarParaHome={() => setTelaAtual('home')} />
      )}

      {telaAtual === 'dashboard-ong' && (
        <OngDashboard navegarParaHome={() => setTelaAtual('home')} />
      )}
    </div>
  );
}

export default App;