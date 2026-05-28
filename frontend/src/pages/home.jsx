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

  // 1. ESTADO DO REFUGIADO SINCRONIZADO COM O MODEL JAVA
  const [refugiadoForm, setRefugiadoForm] = useState({
    nomeCompleto: '', 
    nacionalidade: '', 
    dataNascimento: '', 
    genero: 'Masculino',
    documentoIdentificacao: '', 
    numFamiliares: 0, 
    telefone: '', 
    estado: '', 
    cidade: '', 
    enderecoCompleto: '', 
    relatoSituacao: '' // Nome idêntico ao atributo Java
  });

  const [necessidades, setNecessidades] = useState({
    Saúde: false, Abrigo: false, Emprego: false, Cursos: false,
    'Assistência Jurídica': false, Alimentação: false, Educação: false, Documentação: false
  });

  // 1. ESTADO DA ONG SINCRONIZADO COM O MODEL JAVA
  const [ongForm, setOngForm] = useState({
    razaoSocial: '', 
    nomeFantasia: '', 
    cnpj: '', 
    tipo: 'ONG', // Alterado de tipoOrganizacao para tipo (igual ao Java)
    descricao: '',
    horarioFuncionamento: '', 
    telefone: '', 
    email: '', 
    senha: '', 
    website: '', 
    idiomasAtendimento: '', 
    cep: '', 
    bairro: '', 
    estado: '', 
    cidade: '', 
    enderecoCompleto: ''
  });

  const [servicosOferecidos, setServicosOferecidos] = useState({
    Saúde: false, Abrigo: false, 'Emprego/Capacitação': false, Cursos: false,
    'Assistência Jurídica': false, Alimentação: false, Educação: false, Documentação: false
  });

  // 2. ESTADOS PARA A BUSCA DINÂMICA
  const [termoBusca, setTermoBusca] = useState('');
  const [instituicoes, setInstituicoes] = useState([]);
  const [instituicoesFiltradas, setInstituicoesFiltradas] = useState([]);

  // Carregar estatísticas e lista de instituições para a busca
  useEffect(() => {
    api.get('/plataforma/estatisticas')
      .then(response => setStats(response.data))
      .catch(error => console.error("Erro ao buscar estatísticas:", error));

    // Busca a lista de ONGs cadastradas no Java para alimentar a busca dinâmica
    api.get('/organizacoes')
      .then(response => {
        setInstituicoes(response.data);
        setInstituicoesFiltradas(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar organizações:", error);
        // Fallback/Mock caso queira testar visualmente com dados fictícios
        const mockOrgs = [
          { id: 1, nomeFantasia: "Cáritas Humanitária", tipo: "ONG", cidade: "São Paulo", estado: "SP", servicos: ["Abrigo", "Alimentação"], telefone: "11988887777" },
          { id: 2, nomeFantasia: "Cruz Vermelha Apoio", tipo: "Filantrópica", cidade: "Rio de Janeiro", estado: "RJ", servicos: ["Saúde", "Documentação"], telefone: "21977776666" }
        ];
        setInstituicoes(mockOrgs);
        setInstituicoesFiltradas(mockOrgs);
      });
  }, []);

  // 2. LÓGICA DE FILTRO DA BUSCA DINÂMICA (Gatilho em tempo real)
  useEffect(() => {
    const resultado = instituicoes.filter(org => {
      const termo = termoBusca.toLowerCase();
      return (
        org.nomeFantasia?.toLowerCase().includes(termo) ||
        org.cidade?.toLowerCase().includes(termo) ||
        org.estado?.toLowerCase().includes(termo) ||
        org.servicos?.some(s => s.toLowerCase().includes(termo))
      );
    });
    setInstituicoesFiltradas(resultado);
  }, [termoBusca, instituicoes]);

  const alterarIdioma = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  // Handlers genéricos para capturar inputs dinamicamente pelas tags 'name'
  const handleRefugiadoInputChange = (e) => {
    const { name, value } = e.target;
    setRefugiadoForm({ ...refugiadoForm, [name]: name === 'numFamiliares' ? parseInt(value) || 0 : value });
  };

  const handleOngInputChange = (e) => {
    const { name, value } = e.target;
    setOngForm({ ...ongForm, [name]: value });
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
      api.post('/organizacoes/login', credentials)
        .then(() => {
          setShowLogin(false);
          navegarParaOng();
        })
        .catch(err => {
          console.error(err);
          if (credentials.email === 'ong@ajuda.org' && credentials.password === '123456') {
            setShowLogin(false);
            navegarParaOng();
          } else {
            alert('Erro ao autenticar! Verifique se o e-mail e senha estão corretos no banco de dados.');
          }
        });
    }
  };

  const handleRefugiadoSubmit = (e) => {
    e.preventDefault();
    const necessidadesMarcadas = Object.keys(necessidades).filter(key => necessidades[key]);
    const payload = { ...refugiadoForm, necessidades: necessidadesMarcadas };

    api.post('/refugiados', payload)
      .then(() => {
        alert('Cadastro de Refugiado enviado com sucesso!');
        setRefugiadoForm({
          nomeCompleto: '', nacionalidade: '', dataNascimento: '', genero: 'Masculino',
          documentoIdentificacao: '', numFamiliares: 0, telefone: '', estado: '', cidade: '', enderecoCompleto: '', relatoSituacao: ''
        });
        setNecessidades({
          Saúde: false, Abrigo: false, Emprego: false, Cursos: false,
          'Assistência Jurídica': false, Alimentação: false, Educação: false, Documentação: false
        });
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
        alert('Organização cadastrada com sucesso!');
        // Atualiza a lista de busca dinâmica imediatamente após um novo cadastro
        api.get('/organizacoes').then(res => setInstituicoes(res.data)).catch(() => {});
        e.target.reset();
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      
      {/* HEADER */}
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
          <button onClick={() => { setLoginType('ong'); setCredentials({ email: '', password: '' }); setShowLogin(true); }} style={{ backgroundColor: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>🏢 Login ONG</button>
          <button onClick={() => { setLoginType('admin'); setCredentials({ email: '', password: '' }); setShowLogin(true); }} style={{ backgroundColor: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>{t('btnAdmin')}</button>
        </div>
      </nav>

      {/* MODAL DE LOGIN */}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '1rem' }}>
          <div className="form-container" style={{ width: '100%', maxWidth: '400px', position: 'relative', background: 'white', borderRadius: '12px', padding: '2rem' }}>
            <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>{loginType === 'admin' ? "🛡️ Painel Administrativo" : "🏢 Acesso Organização"}</h3>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>E-mail de Acesso</label>
                <input type="email" placeholder="exemplo@instituicao.org" required value={credentials.email} onChange={e => setCredentials({...credentials, email: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Senha</label>
                <input type="password" placeholder="••••••" required value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <button type="submit" style={{ backgroundColor: loginType === 'admin' ? '#3b82f6' : '#10b981', color: 'white', width: '100%', padding: '0.8rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Entrar no Sistema</button>
            </form>
          </div>
        </div>
      )}

      {/* SEÇÃO 1: HERO */}
      <section id="inicio" className="hero-section">
        <div className="container hero-grid">
          <div>
            <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>🕊️ Plataforma Humanitária</span>
            <h1 style={{ fontSize: '3rem', margin: '1rem 0', lineHeight: '1.2', fontWeight: 800 }}>{t('welcome')}</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: '1.6' }}>{t('subtitle')}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#refugiados"><button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.8rem 1.8rem', borderRadius: '8px', cursor: 'pointer' }}>{t('btnRefugee')}</button></a>
              <a href="#organizacoes"><button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.8rem 1.8rem', borderRadius: '8px', cursor: 'pointer' }}>{t('btnOng')}</button></a>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%' }}>
            {[['tempoResposta', '24h', 'respTime'], ['taxaSatisfacao', '98%', 'satisfaction'], ['idiomasSuportados', '3+', 'languages'], ['custo', '100%', 'cost']].map(([key, def, trans]) => (
              <div key={key} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ color: '#3b82f6', fontSize: '2rem' }}>{stats ? (key === 'idiomasSuportados' ? stats[key] + '+' : stats[key]) : def}</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>{t(trans)}</p>
              </div>
            ))}
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

      {/* SEÇÃO 3: CADASTRO DO REFUGIADO COMPLETO */}
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
                  <label>{t('fullName')} *</label>
                  <input type="text" name="nomeCompleto" required onChange={handleRefugiadoInputChange} />
                </div>
                <div className="form-group">
                  <label>{t('nationality')} *</label>
                  <input type="text" name="nacionalidade" required onChange={handleRefugiadoInputChange} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>{t('birthDate')} *</label>
                  <input type="date" name="dataNascimento" required onChange={handleRefugiadoInputChange} />
                </div>
                <div className="form-group">
                  <label>{t('gender')}</label>
                  <select name="genero" onChange={handleRefugiadoInputChange}>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Documento de Identificação *</label>
                  <input type="text" name="documentoIdentificacao" placeholder="Passaporte, RNE, CPF..." required onChange={handleRefugiadoInputChange} />
                </div>
                <div className="form-group">
                  <label>Número de Familiares no País</label>
                  <input type="number" name="numFamiliares" min="0" defaultValue="0" onChange={handleRefugiadoInputChange} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>{t('phone')} *</label>
                  <input type="tel" name="telefone" placeholder="Ex: (11) 99999-9999" required onChange={handleRefugiadoInputChange} />
                </div>
              </div>

              {/* 1. COMPLEMENTO DE ENDEREÇO DO REFUGIADO */}
              <div className="form-grid" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Estado atual</label>
                  <input type="text" name="estado" placeholder="Ex: SP" onChange={handleRefugiadoInputChange} />
                </div>
                <div className="form-group">
                  <label>Cidade atual</label>
                  <input type="text" name="cidade" placeholder="Ex: São Paulo" onChange={handleRefugiadoInputChange} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Endereço Residencial Completo (Caso possua)</label>
                <input type="text" name="enderecoCompleto" placeholder="Rua, Número, Bairro" onChange={handleRefugiadoInputChange} />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Selecione suas necessidades imediatas:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {Object.keys(necessidades).map(nec => (
                    <label key={nec} style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" checked={necessidades[nec]} onChange={e => setNecessidades({...necessidades, [nec]: e.target.checked})} style={{ width: 'auto', marginRight: '8px' }} /> {nec}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Descrição do Relato de Situação</label>
                <textarea rows="3" name="relatoSituacao" placeholder="Compartilhe um resumo das suas dificuldades atuais..." onChange={handleRefugiadoInputChange}></textarea>
              </div>
              <button type="submit" style={{ backgroundColor: 'var(--bg-primary)', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '8px', width: '100%', marginTop: '1.5rem', cursor: 'pointer' }}>{t('btnSubmitRefugee')}</button>
            </form>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: CADASTRO DE ORGANIZAÇÃO COMPLETO */}
      <section id="organizacoes" style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Portal das Organizações</h2>
            <p style={{ color: 'var(--text-muted)' }}>Cadastre sua instituição com a infraestrutura completa exigida.</p>
          </div>
          <div className="form-container" style={{ border: '1px solid var(--border-color)' }}>
            <form onSubmit={handleOngSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Razão Social *</label>
                  <input type="text" name="razaoSocial" required onChange={handleOngInputChange} />
                </div>
                <div className="form-group">
                  <label>Nome Fantasia *</label>
                  <input type="text" name="nomeFantasia" required onChange={handleOngInputChange} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>CNPJ *</label>
                  <input type="text" name="cnpj" placeholder="00.000.000/0000-00" required onChange={handleOngInputChange} />
                </div>
                <div className="form-group">
                  <label>Tipo de Organização</label>
                  <select name="tipo" onChange={handleOngInputChange}>
                    <option value="ONG">ONG</option>
                    <option value="Fundação">Fundação</option>
                    <option value="Instituição Religiosa">Instituição Religiosa</option>
                    <option value="Associação">Associação</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Descrição das Atividades</label>
                <textarea rows="3" name="descricao" placeholder="Fale um pouco sobre a missão da sua instituição..." onChange={handleOngInputChange}></textarea>
              </div>

              {/* 1. ENRIQUECIMENTO: CAMPOS DE ENDEREÇO DA ONG */}
              <div className="form-grid" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>CEP</label>
                  <input type="text" name="cep" placeholder="00000-000" onChange={handleOngInputChange} />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <input type="text" name="estado" placeholder="Ex: SP" onChange={handleOngInputChange} />
                </div>
                <div className="form-group">
                  <label>Cidade</label>
                  <input type="text" name="cidade" placeholder="Ex: São Paulo" onChange={handleOngInputChange} />
                </div>
              </div>
              <div className="form-grid" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Bairro</label>
                  <input type="text" name="bairro" onChange={handleOngInputChange} />
                </div>
                <div className="form-group">
                  <label>Endereço Completo</label>
                  <input type="text" name="enderecoCompleto" placeholder="Rua, Número, Bloco..." onChange={handleOngInputChange} />
                </div>
              </div>

              {/* 1. ENRIQUECIMENTO: CAMPOS OPERACIONAIS DA ONG */}
              <div className="form-grid" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Horário de Funcionamento</label>
                  <input type="text" name="horarioFuncionamento" placeholder="Ex: Seg a Sex das 08h às 18h" onChange={handleOngInputChange} />
                </div>
                <div className="form-group">
                  <label>Idiomas de Atendimento</label>
                  <input type="text" name="idiomasAtendimento" placeholder="Ex: Português, Espanhol, Inglês" onChange={handleOngInputChange} />
                </div>
                <div className="form-group">
                  <label>Website / Rede Social</label>
                  <input type="text" name="website" placeholder="www.instituicao.org" onChange={handleOngInputChange} />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Serviços que sua instituição pode oferecer:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {Object.keys(servicosOferecidos).map(serv => (
                    <label key={serv} style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" checked={servicosOferecidos[serv]} onChange={e => setServicosOferecidos({...servicosOferecidos, [serv]: e.target.checked})} style={{ width: 'auto', marginRight: '8px' }} /> {serv}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Telefone de Contato *</label>
                  <input type="tel" name="telefone" required onChange={handleOngInputChange} />
                </div>
                <div className="form-group">
                  <label>E-mail Institucional (Usado para o Login) *</label>
                  <input type="email" name="email" placeholder="ong@ajuda.org" required onChange={handleOngInputChange} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label>Defina uma Senha de Acesso *</label>
                <input type="password" name="senha" placeholder="Mínimo 6 caracteres" required onChange={handleOngInputChange} />
              </div>
              <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '8px', width: '100%', marginTop: '1.5rem', cursor: 'pointer' }}>Cadastrar Organização Parceira</button>
            </form>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: BUSCA DINÂMICA REALIZADA EM TEMPO REAL */}
      <section id="busca" style={{ padding: '5rem 0', background: '#f8fafc', textAlign: 'center' }}>
        <div className="container">
          <h2>Busca Dinâmica de Instituições</h2>
          <p style={{ color: '#64748b' }}>Encontre pontos de apoio integrados ao banco de dados filtrando por nome, cidade ou serviço.</p>
          <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <input 
              type="text" 
              placeholder="🔍 Digite uma cidade, nome da instituição ou serviço (Ex: Abrigo)..." 
              value={termoBusca}
              onChange={e => setTermoBusca(e.target.value)}
              style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem' }} 
            />
          </div>

          {/* Renderização dinâmica do resultado da busca */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {instituicoesFiltradas.length > 0 ? (
              instituicoesFiltradas.map(org => (
                <div key={org.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '10px', color: '#475569', fontWeight: 'bold' }}>{org.tipo || 'Instituição'}</span>
                    <h4 style={{ margin: '0.5rem 0', fontSize: '1.2rem', color: '#0f172a' }}>{org.nomeFantasia}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0' }}>📍 Local: <strong>{org.cidade || 'Não informada'}-{org.estado || ''}</strong></p>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0' }}>📞 Contato: {org.telefone || 'Sem telefone'}</p>
                    
                    <div style={{ marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {org.servicos && org.servicos.map((s, idx) => (
                        <span key={idx} style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '6px', fontWeight: '600' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8', gridColumn: '1 / -1' }}>Nenhuma instituição encontrada para o termo digitado.</p>
            )}
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