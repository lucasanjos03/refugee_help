import React, { useEffect, useState } from 'react';
import api from '../services/api';

function OngDashboard({ navegarParaHome }) {
  const [refugiados, setRefugiados] = useState([]);

  // Quando a ONG logar, busca a lista real de refugiados salvos no Postgres via Java
  useEffect(() => {
    api.get('/refugiados')
      .then(response => setRefugiados(response.data))
      .catch(() => {
        // Mock de dados caso o back-end esteja desligado durante a viagem
        setRefugiados([
          { id: 1, nomeCompleto: "Ahmed Mansour", nacionalidade: "Síria", necessidades: ["Abrigo", "Alimentação"], telefone: "(11) 99999-1111" },
          { id: 2, nomeCompleto: "Maria Silva", nacionalidade: "Venezuela", necessidades: ["Saúde", "Documentação"], telefone: "(21) 98888-2222" }
        ]);
      });
  }, []);

  const contactarRefugiado = (nome, telefone) => {
    alert(`Abrindo canal de comunicação com ${nome} no telefone: ${telefone}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
        <h2>🏢 Painel de Atendimento da Organização</h2>
        <button onClick={navegarParaHome} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px' }}>
          Sair / Voltar
        </button>
      </div>

      <h3>Refugiados Solicitando Auxílio</h3>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Abaixo estão os cadastros compatíveis com a busca por assistência humanitária ativa.</p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {refugiados.map(ref => (
          <div key={ref.id} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{ref.nomeCompleto}</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>🌐 Origem: <strong>{ref.nacionalidade}</strong></p>
              <div style={{ marginTop: '0.5rem' }}>
                
                {/* Lógica Corrigida e Blindada contra tela branca */}
                {Array.isArray(ref.needs) ? (
                  ref.needs.map((n, i) => (
                    <span key={i} style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', marginRight: '0.5rem', fontWeight: 'bold' }}>{n}</span>
                  ))
                ) : Array.isArray(ref.necessidades) ? (
                  ref.necessidades.map((n, i) => (
                    <span key={i} style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', marginRight: '0.5rem', fontWeight: 'bold' }}>{n}</span>
                  ))
                ) : (
                  // Caso o dado venha como texto simples ("Saúde, Abrigo") ou nulo, exibe direto sem quebrar a tela
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', marginRight: '0.5rem', fontWeight: 'bold' }}>
                    {ref.necessidades || ref.needs || 'Nenhuma informada'}
                  </span>
                )}

              </div>
            </div>
            <button 
              onClick={() => contactarRefugiado(ref.nomeCompleto, ref.telefone)}
              style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px' }}
            >
              📞 Contactar Refugiado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OngDashboard;