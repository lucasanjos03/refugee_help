import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

function Home() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);

  // ==========================================
  // ESTADOS DO FORMULÁRIO DO REFUGIADO
  // ==========================================
  const [refugiadoForm, setRefugiadoForm] = useState({
    nomeCompleto: '',
    nacionalidade: '',
    dataNascimento: '',
    genero: 'Masculino',
    documentoIdentificacao: '',
    numeroFamiliares: 0,
    telefone: '',
    situacaoRua: false,
    estado: '',
    cidade: '',
    enderecoCompleto: '',
    descricaoSituacao: ''
  });

  // Lista de necessidades (controladas individualmente por booleanos)
  const [necessidades, setNecessidades] = useState({
    Saúde: false, Abrigo: false, Emprego: false, Cursos: false,
    'Assistência Jurídica': false, Alimentação: false, Educação: false, Documentação: false
  });

  // ==========================================
  // ESTADOS DO FORMULÁRIO DA ONG
  // ==========================================
  const [ongForm, setOngForm] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    tipoOrganizacao: 'ONG',
    descricao: '',
    horarioFuncionamento: '',
    telefone: '',
    email: '',
    website: '',
    idiomasAtendimento: '',
    cep: '',
    bairro: '',
    estado: '',
    cidade: '',
    enderecoCompleto: ''
  });

  // Lista de serviços oferecidos pela ONG
  const [servicosOferecidos, setServicosOferecidos] = useState({
    Saúde: false, Abrigo: false, 'Emprego/Capacitação': false, Cursos: false,
    'Assistência Jurídica': false, Alimentação: false, Educação: false, Documentação: false
  });

  // Carregar estatísticas do Java no início
  useEffect(() => {
    api.get('/plataforma/estatisticas')
      .then(response => setStats(response.data))
      .catch(error => console.error("Erro ao buscar estatísticas:", error));
  }, []);

  const alterarIdioma = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  // ==========================================
  // MANIPULADORES DE ENVIOS (AXIOS POST)
  // ==========================================
  
  // Envio do Refugiado
  const handleRefugiadoSubmit = (e) => {
    e.preventDefault();

    // Filtra apenas as necessidades que foram marcadas como true
    const necessidadesMarcadas = Object.keys(necessidades).filter(key => necessidades[key]);

    // Monta o payload final idêntico ao que o seu DTO/Entity do Java precisa
    const payload = {
      ...refugiadoForm,
      necessidades: necessidadesMarcadas
    };

    // Dispara o POST para salvar no PostgreSQL
    api.post('/refugiados', payload)
      .then(response => {
        alert('Cadastro de Refugiado enviado com sucesso!');
        e.target.reset();
      })
      .catch(error => {
        console.error("Erro ao enviar cadastro do refugiado:", error);
        alert('Erro ao conectar com o servidor Java. Verifique o console.');
      });
  };

  // Envio da ONG
  const handleOngSubmit = (e) => {
    e.preventDefault();

    // Filtra os serviços marcados
    const servicosMarcados = Object.keys(servicosOferecidos).filter(key => servicosOferecidos[key]);

    const payload = {
      ...ongForm,
      servicos: servicosMarcados
    };

    api.post('/organizacoes', payload)
      .then(response => {
        alert('Cadastro de Organização enviado com sucesso!');
        e.target.reset();
      })
      .catch(error => {
        console.error("Erro ao enviar cadastro da ONG:", error);
        alert('Erro ao conectar com o servidor Java. Verifique o console.');
      });
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* HEADER COMPLETO */}
      <nav className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#0a192f' }}>💙 AR Help</div>
        </div>
        <div className="nav-links">
          <a href="#inicio">Início</a>
          <a href="#servicos">Serviços</a>
          <a href="#refugiados">Para Refugiados</a>
          <a href="#organizacoes">Para Organizações</a>
          <a href="#busca">Buscar Ajuda</a>
          <a href="#contato">Contato</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          🌐
          <select onChange={alterarIdioma} defaultValue={i18n.language} style={{ marginTop: 0, padding: '0.3rem' }}>
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
          <button style={{ backgroundColor: '#0a192f', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px' }}>
            Preciso de Ajuda
          </button>
        </div>
      </nav>

      {/* SEÇÃO 1: INÍCIO / HERO */}
      <section id="inicio" className="hero-section">
        <div style={{ maxWidth: '50%' }}>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }}>🕊️ Plataforma Humanitária</span>
          <h1 style={{ fontSize: '3.5rem', margin: '1rem 0', lineHeight: '1.1' }}>{t('welcome')}</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem' }}>
            {t('subtitle')}
          </p>
          <div>
            <a href="#refugiados"><button style={{ backgroundColor: '#ffffff', color: '#0a192f', fontWeight: 'bold', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginRight: '1rem' }}>{t('btnRefugee')}</button></a>
            <a href="#organizacoes"><button style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1px solid #ffffff', padding: '0.8rem 1.5rem', borderRadius: '8px' }}>{t('btnOng')}</button></a>
          </div>
        </div>

        {/* Cards de Métricas Dinâmicas traduzidos e integrados */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '45%' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{stats ? stats.tempoResposta : '24h'}</h2>
            <p style={{ color: '#9ca3af', margin: '0.5rem 0 0 0' }}>{t('respTime')}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{stats ? stats.taxaSatisfacao : '98%'}</h2>
            <p style={{ color: '#9ca3af', margin: '0.5rem 0 0 0' }}>{t('satisfaction')}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{stats ? stats.idiomasSuportados + '+' : '3+'}</h2>
            <p style={{ color: '#9ca3af', margin: '0.5rem 0 0 0' }}>{t('languages')}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{stats ? stats.custo : '100%'}</h2>
            <p style={{ color: '#9ca3af', margin: '0.5rem 0 0 0' }}>{t('cost')}</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: SERVIÇOS */}
      <section id="servicos" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <span style={{ color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>{t('servicesTitle')}</span>
        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0 3rem 0' }}>{t('servicesSubtitle')}</h2>
        
        <div className="auxilio-grid">
          {['Saúde', 'Jurídico', 'Abrigo', 'Assistência Social', 'Emprego', 'Educação'].map((servico, idx) => (
            <div key={idx} className="card-auxilio">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔹</span>
                <span style={{ background: '#e2fbe8', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>{t('active')}</span>
              </div>
              <h3>{servico}</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{t('serviceDesc')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 3: CADASTRO DO REFUGIADO */}
      <section id="refugiados" style={{ padding: '5rem 0', background: '#f1f5f9' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ background: '#cbd5e1', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem' }}>{t('portalRefugee')}</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{t('btnRefugee').replace(' →', '')}</h2>
        </div>

        <div className="form-container">
          <h3>{t('formTitle')}</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>{t('formSubtitle')}</p>
          
          <form onSubmit={handleRefugiadoSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('fullName')}</label>
                <input type="text" placeholder="Digite seu nome completo" required 
                  onChange={(e) => setRefugiadoForm({...refugiadoForm, nomeCompleto: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{t('nationality')}</label>
                <input type="text" placeholder="Selecione seu país de origem" required 
                  onChange={(e) => setRefugiadoForm({...refugiadoForm, nacionalidade: e.target.value})} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>{t('birthDate')}</label>
                <input type="date" required 
                  onChange={(e) => setRefugiadoForm({...refugiadoForm, dataNascimento: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{t('gender')}</label>
                <select onChange={(e) => setRefugiadoForm({...refugiadoForm, genero: e.target.value})}>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não dizer">Prefiro não dizer</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>{t('docId')}</label>
                <input type="text" placeholder="Passaporte, RNE ou outro" required 
                  onChange={(e) => setRefugiadoForm({...refugiadoForm, documentoIdentificacao: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{t('famMembers')}</label>
                <input type="number" defaultValue="0" 
                  onChange={(e) => setRefugiadoForm({...refugiadoForm, numeroFamiliares: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>{t('phone')}</label>
                <input type="tel" placeholder="(XX) XXXXX-XXXX" 
                  onChange={(e) => setRefugiadoForm({...refugiadoForm, telefone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{t('streetLabel')}</label>
                <div style={{ marginTop: '1rem' }}>
                  <input type="checkbox" checked={refugiadoForm.situacaoRua} 
                    onChange={(e) => setRefugiadoForm({...refugiadoForm, situacaoRua: e.target.checked})} style={{ width: 'auto', margin: '0 10px 0 0' }} />
                  <span>{t('streetSituation')}</span>
                </div>
              </div>
            </div>

            {!refugiadoForm.situacaoRua && (
              <div className="form-grid">
                <div className="form-group">
                  <label>{t('state')}</label>
                  <input type="text" placeholder="Ex: SP" onChange={(e) => setRefugiadoForm({...refugiadoForm, estado: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('city')}</label>
                  <input type="text" placeholder="Digite a cidade" onChange={(e) => setRefugiadoForm({...refugiadoForm, cidade: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>{t('address')}</label>
                  <input type="text" placeholder="Rua, número, bairro" onChange={(e) => setRefugiadoForm({...refugiadoForm, enderecoCompleto: e.target.value})} />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>{t('needsTitle')}</label>
              <div className="checkbox-group">
                {Object.keys(necessidades).map((nec) => (
                  <label key={nec} style={{ fontWeight: 'normal' }}>
                    <input type="checkbox" checked={necessidades[nec]} 
                      onChange={(e) => setNecessidades({...necessidades, [nec]: e.target.checked})} style={{ width: 'auto', marginRight: '8px' }} /> {nec}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>{t('situationDesc')}</label>
              <textarea rows="4" placeholder="Conte-nos um pouco sobre suas maiores dificuldades atuais..." 
                onChange={(e) => setRefugiadoForm({...refugiadoForm, descricaoSituacao: e.target.value})}></textarea>
            </div>

            <button type="submit" style={{ backgroundColor: '#0a192f', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1.5rem', width: '100%' }}>
              {t('btnSubmitRefugee')}
            </button>
          </form>
        </div>
      </section>

      {/* SEÇÃO 4: CADASTRO DE ORGANIZAÇÃO */}
      <section id="organizacoes" style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ background: '#e2e8f0', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem' }}>Portal das Instituições</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Cadastre sua Organização para Ajudar</h2>
        </div>

        <div className="form-container" style={{ border: '1px solid #e2e8f0' }}>
          <h3>Dados da Organização</h3>
          <form onSubmit={handleOngSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Razão Social *</label>
                <input type="text" required onChange={(e) => setOngForm({...ongForm, razaoSocial: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Nome Fantasia *</label>
                <input type="text" required onChange={(e) => setOngForm({...ongForm, nomeFantasia: e.target.value})} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>CNPJ *</label>
                <input type="text" placeholder="00.000.000/0000-00" required onChange={(e) => setOngForm({...ongForm, cnpj: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Tipo de Organização</label>
                <select onChange={(e) => setOngForm({...ongForm, tipoOrganizacao: e.target.value})}>
                  <option value="ONG">ONG</option>
                  <option value="Fundação">Fundação</option>
                  <option value="Instituição Religiosa">Instituição Religiosa</option>
                  <option value="Associação">Associação</option>
                  <option value="Órgão Governamental">Órgão Governamental</option>
                  <option value="Órgão Internacional">Órgão Internacional</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Descrição da Organização</label>
              <textarea rows="3" placeholder="Fale sobre a missão da sua instituição..." onChange={(e) => setOngForm({...ongForm, descricao: e.target.value})}></textarea>
            </div>

            <h3 style={{ marginTop: '2.5rem' }}>Serviços Oferecidos</h3>
            <div className="checkbox-group">
              {Object.keys(servicosOferecidos).map((serv) => (
                <label key={serv} style={{ fontWeight: 'normal' }}>
                  <input type="checkbox" checked={servicosOferecidos[serv]} 
                    onChange={(e) => setServicosOferecidos({...servicosOferecidos, [serv]: e.target.checked})} style={{ width: 'auto', marginRight: '8px' }} /> {serv}
                </label>
              ))}
            </div>

            <h3 style={{ marginTop: '2.5rem' }}>Funcionamento & Contato</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Horário de Funcionamento</label>
                <input type="text" placeholder="Ex: Seg a Sex das 08h às 18h" onChange={(e) => setOngForm({...ongForm, horarioFuncionamento: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Telefone de Contato *</label>
                <input type="tel" required onChange={(e) => setOngForm({...ongForm, telefone: e.target.value})} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>E-mail institucional *</label>
                <input type="email" required onChange={(e) => setOngForm({...ongForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input type="url" placeholder="https://..." onChange={(e) => setOngForm({...ongForm, website: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Idiomas de Atendimento</label>
              <input type="text" placeholder="Ex: Português, Inglês, Espanhol" onChange={(e) => setOngForm({...ongForm, idiomasAtendimento: e.target.value})} />
            </div>

            <h3 style={{ marginTop: '2.5rem' }}>Endereço da Sede</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>CEP *</label>
                <input type="text" required onChange={(e) => setOngForm({...ongForm, cep: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Bairro *</label>
                <input type="text" required onChange={(e) => setOngForm({...ongForm, bairro: e.target.value})} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Estado *</label>
                <input type="text" required onChange={(e) => setOngForm({...ongForm, estado: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Cidade *</label>
                <input type="text" required onChange={(e) => setOngForm({...ongForm, cidade: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Endereço Completo *</label>
              <input type="text" placeholder="Rua, número" required onChange={(e) => setOngForm({...ongForm, enderecoCompleto: e.target.value})} />
            </div>

            <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1.5rem', width: '100%' }}>
              Cadastrar Organização Parceira
            </button>
          </form>
        </div>
      </section>

      {/* SEÇÃO 5: BUSCA DINÂMICA */}
      <section id="busca" style={{ padding: '5rem 0', background: '#f8fafc', textAlign: 'center' }}>
        <h2>Busca Dinâmica de Instituições</h2>
        <p style={{ color: '#64748b' }}>Encontre rapidamente os pontos de apoio mais próximos e ativos filtrados por serviço.</p>
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <input type="text" placeholder="🔍 Digite uma cidade ou serviço (Ex: Abrigo)..." style={{ width: '100%', padding: '1rem' }} />
        </div>
      </section>

      {/* FOOTER COMPLETO */}
      <footer id="contato" style={{ background: '#0a192f', color: '#9ca3af', padding: '4rem', fontSize: '0.9rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '2rem' }}>
          <div>
            <h4 style={{ color: 'white' }}>AR Help</h4>
            <p>Conectando esperança e assistência global de forma segura.</p>
          </div>
          <div>
            <h4 style={{ color: 'white' }}>Serviços</h4>
            <p style={{ margin: '0.2rem 0' }}>Saúde</p>
            <p style={{ margin: '0.2rem 0' }}>Abrigo</p>
            <p style={{ margin: '0.2rem 0' }}>Assistência Jurídica</p>
          </div>
          <div>
            <h4 style={{ color: 'white' }}>Plataforma</h4>
            <p style={{ margin: '0.2rem 0' }}>Institucional</p>
            <p style={{ margin: '0.2rem 0' }}>Termos de Uso</p>
            <p style={{ margin: '0.2rem 0' }}>Contato</p>
          </div>
        </div>
        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem' }}>© 2026 AR Help. Todos os direitos reservados. Projeto Acadêmico AV03.</p>
      </footer>
    </div>
  );
}

export default Home;