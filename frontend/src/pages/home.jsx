import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

function Home({ navegarParaAdmin, navegarParaOng }) {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  
  // Controle de Modais de Login
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState('admin'); // 'admin' ou 'ong'
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Estados dos Formulários
  const [refugiadoForm, setRefugiadoForm] = useState({
    nomeCompleto: '', nacionalidade: '', dataNascimento: '', genero: 'Masculino',
    documentoIdentificacao: '', numeroFamiliares: 0, telefone: '', situacaoRua: false,
    estado: '', cidade: '', enderecoCompleto: '', descricaoSituacao: ''
  });

  const [necessidades, setNecessidades] = useState({
    Saúde: false, Abrigo: false, Emprego: false, Cursos: false,
    'Assistência Jurídica': false, Alimentação: false, Educação: false, Documentação: false
  });

  const [ongForm, setOngForm] = useState({
    razaoSocial: '', nomeFantasia: '', cnpj: '', tipoOrganizacao: 'ONG', descricao: '',
    horarioFuncionamento: '', telefone: '', email: '', website: '', idiomasAtendimento: '',
    cep: '', bairro: '', estado: '', cidade: '', enderecoCompleto: ''
  });

  const [servicosOferecidos, setServicosOferecidos] = useState({
    Saúde: false, Abrigo: false, 'Emprego/Capacitação': false, Cursos: false,
    'Assistência Jurídica': false, Alimentação: false, Educação: false, Documentação: false
  });

  useEffect(() => {
    api.get('/plataforma/estatisticas')
      .then(response => setStats(response.data))
      .catch(error => console.error("Erro ao buscar estatísticas:", error));
  }, []);

  const alterarIdioma = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginType === 'admin') {
      if (credentials.email === 'admin@arhelp.org' && credentials.password === '123456') {
        setShowLogin(false);
        navegarParaAdmin();
      } else {
        alert('Credenciais de Admin inválidas!');
      }
    } else {
      // Login Simulando a ONG parceira
      if (credentials.email === 'ong@ajuda.org' && credentials.password === '123456') {
        setShowLogin(false);
        navegarParaOng();
      } else {
        alert('Credenciais de Organização inválidas!');
      }
    }
  };

  const handleRefugiadoSubmit = (e) => {
    e.preventDefault();
    const necessidadesMarcadas = Object.keys(necessidades).filter(key => necessidades[key]);
    const payload = { ...refugiadoForm, necessidades: necessidadesMarcadas };

    api.post('/refugiados', payload)
      .then(() => {
        alert('Cadastro de Refugiado enviado com sucesso!');
        e.target.reset();
      })
      .catch(err => console.error(err));
  };

  const handleOngSubmit = (e) => {
    e.preventDefault();
    const servicosMarcados = Object.keys(servicosOferecidos).filter(key => servicosOferecidos[key]);
    const payload = { ...ongForm, servicos: servicosMarcados };

    api.post('/organizacoes', payload)
      .then(() => {
        alert('Cadastro de Organização enviado com sucesso!');
        e.target.reset();
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      
      {/* HEADER TOTALMENTE TRADUZIDO E RESPONSIVO */}
      <nav className="header">
        <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#3b82f6' }}>🕊️ AR Help</div>
        
        <div className="nav-links">
          <a href="#inicio">{t('navHome')}</a>
          <a href="#servicos">{t('navServices')}</a>
          <a href="#refugiados">{t('navRefugees')}</a>
          <a href="#organizacoes">{t('navOngs')}</a>
          <a href="#busca">{t('navSearch')}</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <select onChange={alterarIdioma} defaultValue={i18n.language} style={{ padding: '0.4rem', width: 'auto' }}>
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>

          <button 
            onClick={() => { setLoginType('ong'); setShowLogin(true); }}
            style={{ backgroundColor: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '6px' }}
          >
            🏢 Login ONG
          </button>

          <button 
            onClick={() => { setLoginType('admin'); setShowLogin(true); }}
            style={{ backgroundColor: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '0.5rem 1rem', borderRadius: '6px' }}
          >
            {t('btnAdmin')}
          </button>
        </div>
      </nav>

      {/* MODAL DE LOGIN UNIFICADO (ADMIN / ONG) */}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '1rem' }}>
          <div className="form-container" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.2rem' }}>✕</button>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>
              {loginType === 'admin' ? "🛡️ Painel Administrativo" : "🏢 Acesso Organização"}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              {loginType === 'admin' ? "Acesso restrito para auditoria global." : "Faça login para ver e contactar refugiados associados."}
            </p>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>E-mail de Acesso</label>
                <input type="email" placeholder={loginType === 'admin' ? "admin@arhelp.org" : "ong@ajuda.org"} required onChange={e => setCredentials({...credentials, email: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Senha</label>
                <input type="password" placeholder="••••••" required onChange={e => setCredentials({...credentials, password: e.target.value})} />
              </div>
              <button type="submit" style={{ backgroundColor: loginType === 'admin' ? '#3b82f6' : '#10b981', color: 'white', width: '100%', padding: '0.8rem', border: 'none', borderRadius: '8px' }}>
                Entrar no Sistema
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SEÇÃO 1: HERO */}
      <section id="inicio" className="hero-section">
        <div className="container hero-grid">
          <div style={{ textAlign: 'left' }}>
            <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>🕊️ Plataforma Humanitária</span>
            <h1 style={{ fontSize: '3rem', margin: '1rem 0', lineHeight: '1.2', fontWeight: 800 }}>{t('welcome')}</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: '1.6' }}>{t('subtitle')}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#refugiados"><button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.8rem 1.8rem', borderRadius: '8px' }}>{t('btnRefugee')}</button></a>
              <a href="#organizacoes"><button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.8rem 1.8rem', borderRadius: '8px' }}>{t('btnOng')}</button></a>
            </div>
          </div>

          {/* Estatísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ color: '#3b82f6', fontSize: '2rem' }}>{stats ? stats.tempoResposta : '24h'}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>{t('respTime')}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ color: '#3b82f6', fontSize: '2rem' }}>{stats ? stats.taxaSatisfacao : '98%'}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>{t('satisfaction')}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ color: '#3b82f6', fontSize: '2rem' }}>{stats ? stats.idiomasSuportados + '+' : '3+'}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>{t('languages')}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ color: '#3b82f6', fontSize: '2rem' }}>{stats ? stats.custo : '100%'}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>{t('cost')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: SERVIÇOS */}
      <section id="servicos" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{t('servicesTitle')}</span>
          <h2 style={{ fontSize: '2.2rem', margin: '0.5rem 0 0 0', fontWeight: '800' }}>{t('servicesSubtitle')}</h2>
          
          <div className="auxilio-grid">
            {['Saúde', 'Jurídico', 'Abrigo', 'Assistência Social', 'Emprego', 'Educação'].map((servico, idx) => (
              <div key={idx} className="card-auxilio">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔹</span>
                  <span style={{ background: '#ecfdf5', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>{t('active')}</span>
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: '700' }}>{servico}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{t('serviceDesc')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: CADASTRO DO REFUGIADO */}
      <section id="refugiados" style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{t('btnRefugee').replace(' →', '')}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{t('formSubtitle')}</p>
          </div>

          <div className="form-container">
            <form onSubmit={handleRefugiadoSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>{t('fullName')}</label>
                  <input type="text" placeholder="Nome Completo" required onChange={e => setRefugiadoForm({...refugiadoForm, nomeCompleto: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('nationality')}</label>
                  <input type="text" placeholder="País de Origem" required onChange={e => setRefugiadoForm({...refugiadoForm, nacionalidade: e.target.value})} />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>{t('birthDate')}</label>
                  <input type="date" required onChange={e => setRefugiadoForm({...refugiadoForm, dataNascimento: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('gender')}</label>
                  <select onChange={e => setRefugiadoForm({...refugiadoForm, genero: e.target.value})}>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>{t('docId')}</label>
                  <input type="text" placeholder="Passaporte, RNE, etc." required onChange={e => setRefugiadoForm({...refugiadoForm, documentoIdentificacao: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('famMembers')}</label>
                  <input type="number" defaultValue="0" onChange={e => setRefugiadoForm({...refugiadoForm, numeroFamiliares: parseInt(e.target.value) || 0})} />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>{t('phone')}</label>
                  <input type="tel" placeholder="Telefone" onChange={e => setRefugiadoForm({...refugiadoForm, telefone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('streetLabel')}</label>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <input type="checkbox" checked={refugiadoForm.situacaoRua} onChange={e => setRefugiadoForm({...refugiadoForm, situacaoRua: e.target.checked})} style={{ width: 'auto', marginRight: '10px' }} />
                    <span style={{ fontSize: '0.9rem' }}>{t('streetSituation')}</span>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>{t('situationDesc')}</label>
                <textarea rows="3" placeholder="Descreva sua situação atual..." onChange={e => setRefugiadoForm({...refugiadoForm, descricaoSituacao: e.target.value})}></textarea>
              </div>

              <button type="submit" style={{ backgroundColor: 'var(--bg-primary)', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '8px', width: '100%', marginTop: '1.5rem' }}>
                {t('btnSubmitRefugee')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: CADASTRO DE ORGANIZAÇÃO */}
      <section id="organizacoes" style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Portal das Organizações</h2>
            <p style={{ color: 'var(--text-muted)' }}>Cadastre sua instituição para disponibilizar auxílio humanitário na plataforma.</p>
          </div>

          <div className="form-container" style={{ border: '1px solid var(--border-color)' }}>
            <form onSubmit={handleOngSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Razão Social *</label>
                  <input type="text" required onChange={e => setOngForm({...ongForm, razaoSocial: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Nome Fantasia *</label>
                  <input type="text" required onChange={e => setOngForm({...ongForm, nomeFantasia: e.target.value})} />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>CNPJ *</label>
                  <input type="text" placeholder="00.000.000/0000-00" required onChange={e => setOngForm({...ongForm, cnpj: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tipo de Organização</label>
                  <select onChange={e => setOngForm({...ongForm, tipoOrganizacao: e.target.value})}>
                    <option value="ONG">ONG</option>
                    <option value="Fundação">Fundação</option>
                    <option value="Instituição Religiosa">Instituição Religiosa</option>
                    <option value="Associação">Associação</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição das Atividades</label>
                <textarea rows="3" placeholder="Fale um pouco sobre a missão da sua instituição..." onChange={e => setOngForm({...ongForm, descricao: e.target.value})}></textarea>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Serviços que sua instituição pode oferecer:</label>
                <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {Object.keys(servicosOferecidos).map((serv) => (
                    <label key={serv} style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" checked={servicosOferecidos[serv]} 
                        onChange={e => setServicosOferecidos({...servicosOferecidos, [serv]: e.target.checked})} style={{ width: 'auto', marginRight: '8px' }} /> {serv}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Telefone de Contato *</label>
                  <input type="tel" required onChange={e => setOngForm({...ongForm, telefone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>E-mail Institucional *</label>
                  <input type="email" required onChange={e => setOngForm({...ongForm, email: e.target.value})} />
                </div>
              </div>

              <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '8px', width: '100%', marginTop: '1.5rem' }}>
                Cadastrar Organização Parceira
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: BUSCA DINÂMICA */}
      <section id="busca" style={{ padding: '5rem 0', background: '#f8fafc', textAlign: 'center' }}>
        <div className="container">
          <h2>Busca Dinâmica de Instituições</h2>
          <p style={{ color: '#64748b' }}>Encontre rapidamente os pontos de apoio mais próximos e ativos filtrados por serviço.</p>
          <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <input type="text" placeholder="🔍 Digite uma cidade ou serviço (Ex: Abrigo)..." style={{ width: '100%', padding: '1rem' }} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contato" style={{ background: 'var(--bg-primary)', color: '#94a3b8', padding: '4rem 0 2rem 0' }}>
        <div className="container">
          <div className="footer-container">
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>🕊️ AR Help</h4>
              <p style={{ fontSize: '0.9rem', maxWidth: '300px', lineHeight: '1.5' }}>Conectando pessoas refugiadas a redes de suporte humanitário globais.</p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Serviços</h4>
              <p style={{ fontSize: '0.9rem', margin: '0.4rem 0' }}>Saúde e Abrigo</p>
              <p style={{ fontSize: '0.9rem', margin: '0.4rem 0' }}>Assistência Jurídica</p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Segurança</h4>
              <p style={{ fontSize: '0.9rem', margin: '0.4rem 0' }}>Políticas de Privacidade</p>
              <p style={{ fontSize: '0.9rem', margin: '0.4rem 0' }}>Painel Relatórios</p>
            </div>
          </div>
          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
            © 2026 AR Help. Todos os direitos reservados. 
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Home;