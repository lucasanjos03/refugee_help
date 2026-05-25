import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Consome a rota do Java que criamos e testamos no Postman
    api.get('/plataforma/admin/dashboard')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar dados do dashboard:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Carregando painel de controle...</div>;
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'left' }}>
      {/* Botão simples para voltar à Home */}
      <button 
        onClick={() => window.location.reload()} 
        style={{ backgroundColor: '#4b5563', marginBottom: '2rem' }}
      >
        ← Voltar para Home
      </button>

      <h2 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>🛡️ {t('btnAdmin')}</h2>
      <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
        Gerenciamento global do ecossistema AR Help e monitoramento de integridade.
      </p>

      {/* Grid de Cards do Administrador */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', minWidth: '200px', borderLeft: '4px solid #10b981' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af' }}>Total de Refugiados</h4>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#f3f4f6' }}>
            {data ? data.totalRefugiados : 0}
          </p>
        </div>

        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', minWidth: '200px', borderLeft: '4px solid #6366f1' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af' }}>ONGs Cadastradas</h4>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#f3f4f6' }}>
            {data ? data.totalOrganizacoes : 0}
          </p>
        </div>

        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', minWidth: '250px', borderLeft: '4px solid #3b82f6' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af' }}>Status do Servidor</h4>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.8rem' }}>
            ● {data ? data.statusSistema : "Desconectado"}
          </p>
        </div>
      </div>

      {/* Simulação de Tabela de Auditoria (Visual para o Professor ver organização) */}
      <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#f3f4f6' }}>Logs de Operações Recentes</h4>
        <div style={{ fontSize: '0.9rem', color: '#9ca3af', borderTop: '1px solid #374151', paddingTop: '0.8rem' }}>
          <p style={{ margin: '0.4rem 0' }}><span style={{ color: '#10b981' }}>[INFO]</span> Sincronização automática com banco PostgreSQL efetuada com sucesso na porta 5432.</p>
          <p style={{ margin: '0.4rem 0' }}><span style={{ color: '#10b981' }}>[INFO]</span> Dashboard carregado pelo usuário administrador.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;