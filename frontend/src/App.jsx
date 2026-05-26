import React, { useState } from 'react';
import Home from './pages/home';
import AdminDashboard from './pages/AdminDashboard'; // ou a pasta correta dele

function App() {
  const [telaAtual, setTelaAtual] = useState('home');

  return (
    <div className="App">
      {/* Se a tela atual for 'home', renderiza apenas a Home e passa a função de mudar de tela */}
      {telaAtual === 'home' && (
        <Home navegarParaAdmin={() => setTelaAtual('admin')} />
      )}

      {/* Se a tela atual for 'admin', renderiza o Painel de Controle */}
      {telaAtual === 'admin' && (
        <AdminDashboard navegarParaHome={() => setTelaAtual('home')} />
      )}
    </div>
  );
}

export default App;