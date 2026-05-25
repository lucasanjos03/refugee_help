import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

function Home() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);

  // Busca as estatísticas dinâmicas do seu Java/Spring Boot
  useEffect(() => {
    api.get('/plataforma/estatisticas')
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar estatísticas do backend:", error);
      });
  }, []);

  // Função para alternar o idioma selecionado
  const alterarIdioma = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Seletor de Idiomas no Topo */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '2rem' }}>
        <label style={{ alignSelf: 'center' }}>🌐 Idioma:</label>
        <select onChange={alterarIdioma} defaultValue={i18n.language}>
          <option value="pt">Português</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      {/* Hero Section */}
      <header style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '1rem' }}>AR Help</h1>
        <h2>{t('welcome')}</h2>
        <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          {t('subtitle')}
        </p>
        
        <div>
          <button style={{ backgroundColor: '#10b981' }}>{t('btnRefugee')}</button>
          <button style={{ backgroundColor: '#6366f1' }}>{t('btnOng')}</button>
          <button style={{ backgroundColor: '#4b5563' }}>{t('btnAdmin')}</button>
        </div>
      </header>

      {/* Seção de Estatísticas vindas do Java */}
      <section style={{ backgroundColor: '#1f2937', padding: '2rem', borderRadius: '12px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>{t('statsTitle')}</h3>
        
        {stats ? (
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h4 style={{ margin: 0, color: '#10b981', fontSize: '1.8rem' }}>{stats.taxaSatisfacao}</h4>
              <p style={{ margin: 0, color: '#9ca3af' }}>{t('satisfaction')}</p>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#3b82f6', fontSize: '1.8rem' }}>{stats.tempoResposta}</h4>
              <p style={{ margin: 0, color: '#9ca3af' }}>{t('respTime')}</p>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#f59e0b', fontSize: '1.8rem' }}>{stats.custo}</h4>
              <p style={{ margin: 0, color: '#9ca3af' }}>{t('cost')}</p>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#ec4899', fontSize: '1.8rem' }}>{stats.idiomasSuportados}</h4>
              <p style={{ margin: 0, color: '#9ca3af' }}>{t('languages')}</p>
            </div>
          </div>
        ) : (
          <p style={{ color: '#9ca3af' }}>Carregando dados do servidor...</p>
        )}
      </section>
    </div>
  );
}

export default Home;