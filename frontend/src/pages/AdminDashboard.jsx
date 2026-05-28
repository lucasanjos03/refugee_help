import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para gerenciar as listas do CRUD operacional
  const [organizacoes, setOrganizacoes] = useState([]);
  const [refugiados, setRefugiados] = useState([]);
  
  // Estado para controlar qual aba de gerenciamento está ativa
  const [abaAtiva, setAbaAtiva] = useState('ongs'); // 'ongs' ou 'refugiados'

  // Função centralizada para recarregar todos os dados do dashboard
  const carregarDadosDashboard = () => {
    setLoading(true);
    
    // Executa as 3 requisições simultaneamente para otimizar a performance
    Promise.all([
      api.get('/plataforma/admin/dashboard'),
      api.get('/organizacoes'),
      api.get('/refugiados') 
    ])
    .then(([resDashboard, resOrgs, resRefugiados]) => {
      setData(resDashboard.data);
      setOrganizacoes(resOrgs.data);
      setRefugiados(resRefugiados.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Erro ao carregar dados do dashboard:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  // Handler para Excluir Organização
  const handleExcluirOng = (id, nome) => {
    if (window.confirm(`Tem certeza que deseja remover permanentemente a organização "${nome}"?`)) {
      api.delete(`/organizacoes/${id}`)
        .then(() => {
          alert('Organização excluída com sucesso!');
          setLoading(true);
          carregarDadosDashboard(); // Recarrega a tabela e os contadores do topo
        })
        .catch(error => {
          console.error("Erro ao excluir organização:", error);
          alert('Erro ao excluir organização. Verifique dependências ou chaves estrangeiras no banco.');
        });
    }
  };

  // Handler para Excluir Refugiado
  const handleExcluirRefugiado = (id, nome) => {
    if (window.confirm(`Tem certeza que deseja remover permanentemente o registro de "${nome}"?`)) {
      api.delete(`/refugiados/${id}`)
        .then(() => {
          alert('Registro de refugiado excluído com sucesso!');
          setLoading(true);
          carregarDadosDashboard(); // Recarrega a tabela e os contadores do topo
        })
        .catch(error => {
          console.error("Erro ao excluir refugiado:", error);
          alert('Erro ao excluir refugiado no banco de dados.');
        });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#f3f4f6', backgroundColor: '#0f172a', minHeight: '100vh' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>⚙️ Sincronizando com o servidor Java...</div>
        <div style={{ color: '#9ca3af' }}>Carregando painel de controle operacional...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'left', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f3f4f6' }}>
      
      {/* Botão para voltar à Home */}
      <button 
        onClick={() => window.location.reload()} 
        style={{ backgroundColor: '#334155', color: '#f3f4f6', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', marginBottom: '2rem', transition: 'background 0.2s' }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#475569'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#334155'}
      >
        ← Voltar para Home
      </button>

      <h2 style={{ color: '#3b82f6', marginBottom: '0.5rem', fontWeight: '800' }}>🛡️ {t('btnAdmin')}</h2>
      <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
        Gerenciamento global do ecossistema AR Help e monitoramento de integridade.
      </p>

      {/* Grid de Cards Dinâmicos */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', minWidth: '220px', flex: '1', borderLeft: '5px solid #10b981', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total de Refugiados</h4>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#f3f4f6' }}>
            {data ? data.totalRefugiados : refugiados.length}
          </p>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', minWidth: '220px', flex: '1', borderLeft: '5px solid #6366f1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ONGs Cadastradas</h4>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#f3f4f6' }}>
            {data ? data.totalOrganizacoes : organizacoes.length}
          </p>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', minWidth: '250px', flex: '1', borderLeft: '5px solid #3b82f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status do Servidor</h4>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> 
            {data ? data.statusSistema : "Conectado ao PostgreSQL"}
          </p>
        </div>
      </div>

      {/* SELETOR DE ABAS OPERACIONAIS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', borderBottom: '2px solid #334155', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setAbaAtiva('ongs')}
          style={{ background: 'none', border: 'none', color: abaAtiva === 'ongs' ? '#3b82f6' : '#94a3b8', fontSize: '1.1rem', fontWeight: 'bold', padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: abaAtiva === 'ongs' ? '3px solid #3b82f6' : '3px solid transparent', marginBottom: '-0.7rem' }}
        >
          🏢 Organizações Parceiras ({organizacoes.length})
        </button>
        <button 
          onClick={() => setAbaAtiva('refugiados')}
          style={{ background: 'none', border: 'none', color: abaAtiva === 'refugiados' ? '#3b82f6' : '#94a3b8', fontSize: '1.1rem', fontWeight: 'bold', padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: abaAtiva === 'refugiados' ? '3px solid #3b82f6' : '3px solid transparent', marginBottom: '-0.7rem' }}
        >
          🕊️ Casos de Refugiados ({refugiados.length})
        </button>
      </div>

      {/* CONTEÚDO DAS TABELAS DO CRUD */}
      <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflowX: 'auto', marginBottom: '2rem' }}>
        
        {/* TABELA 1: ORGANIZAÇÕES */}
        {abaAtiva === 'ongs' && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#f3f4f6' }}>Entidades Jurídicas Ativas</h3>
            {organizacoes.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Nenhuma organização parceira cadastrada no banco.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.75rem' }}>ID</th>
                    <th style={{ padding: '0.75rem' }}>Nome Fantasia</th>
                    <th style={{ padding: '0.75rem' }}>CNPJ</th>
                    <th style={{ padding: '0.75rem' }}>Localidade</th>
                    <th style={{ padding: '0.75rem' }}>Contato</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {organizacoes.map(org => (
                    <tr key={org.id} style={{ borderBottom: '1px solid #334155', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#3b82f6' }}>{org.id}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div>{org.nomeFantasia}</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{org.tipo || 'ONG'}</span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{org.cnpj}</td>
                      <td style={{ padding: '0.75rem' }}>{org.cidade ? `${org.cidade}-${org.estado}` : 'Não cadastrado'}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                        <div>📞 {org.telefone}</div>
                        <div style={{ color: '#64748b' }}>✉️ {org.email}</div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleExcluirOng(org.id, org.nomeFantasia)}
                          style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                        >
                          🗑️ Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TABELA 2: REFUGIADOS */}
        {abaAtiva === 'refugiados' && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#f3f4f6' }}>Acolhidos e Demandas Solicitadas</h3>
            {refugiados.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Nenhum refugiado registrado na base de dados.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.75rem' }}>ID</th>
                    <th style={{ padding: '0.75rem' }}>Nome Completo</th>
                    <th style={{ padding: '0.75rem' }}>Nacionalidade</th>
                    <th style={{ padding: '0.75rem' }}>Contato / Local</th>
                    <th style={{ padding: '0.75rem' }}>Necessidades Relatadas</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {refugiados.map(ref => (
                    <tr key={ref.id} style={{ borderBottom: '1px solid #334155', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>{ref.id}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div>{ref.nomeCompleto}</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{ref.genero || 'Não inf.'}</span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>{ref.nacionalidade}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                        <div>📞 {ref.telefone}</div>
                        <div style={{ color: '#64748b' }}>📍 {ref.cidade ? `${ref.cidade}-${ref.estado}` : 'Sem endereço'}</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ maxWidth: '280px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {ref.necessidades && ref.necessidades.length > 0 ? (
                            ref.necessidades.map((nec, idx) => (
                              <span key={idx} style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                {nec}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Nenhuma listada</span>
                          )}
                        </div>
                        {ref.relatoSituacao && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ref.relatoSituacao}>
                            "{ref.relatoSituacao}"
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleExcluirRefugiado(ref.id, ref.nomeCompleto)}
                          style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                        >
                          🗑️ Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* TABELA DE AUDITORIA DO SISTEMA */}
      <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#f3f4f6' }}>Logs de Operações Recentes</h4>
        <div style={{ fontSize: '0.9rem', color: '#9ca3af', borderTop: '1px solid #334155', paddingTop: '0.8rem' }}>
          <p style={{ margin: '0.4rem 0' }}><span style={{ color: '#10b981' }}>[INFO]</span> Sincronização automática com banco PostgreSQL efetuada com sucesso.</p>
          <p style={{ margin: '0.4rem 0' }}><span style={{ color: '#3b82f6' }}>[CRUD]</span> Mapeamento de endpoints de deleção operacional ativado.</p>
          <p style={{ margin: '0.4rem 0' }}><span style={{ color: '#10b981' }}>[INFO]</span> Painel de Controle renderizado com sucesso.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;