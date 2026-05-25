import React, { useState } from 'react';
import Home from './pages/home';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [telaAtual, setTelaAtual] = useState('home');

  return (
    <div className="App">
      {telaAtual === 'home' && (
        <>
          {/* Adicionamos uma ação no botão Admin da Home para abrir o Painel */}
          <Home />
          <div style={{ marginTop: '-4rem', marginBottom: '4rem' }}>
            <button onClick={() => setTelaAtual('admin')} style={{ backgroundColor: '#4b5563' }}>
              Ir para o Painel Admin →
            </button>
          </div>
        </>
      )}

      {telaAtual === 'admin' && (
        <AdminDashboard />
      )}
    </div>
  );
}

export default App;