import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";

const refugeeInitial = {
  nomeCompleto: "",
  nacionalidade: "",
  dataNascimento: "",
  genero: "Masculino",
  documentoIdentificacao: "",
  numFamiliares: 0,
  telefone: "",
  estado: "",
  cidade: "",
  enderecoCompleto: "",
  relatoSituacao: "",
};

const orgInitial = {
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  tipo: "ONG",
  descricao: "",
  horarioFuncionamento: "",
  telefone: "",
  email: "",
  senha: "",
  website: "",
  idiomasAtendimento: "",
  cep: "",
  bairro: "",
  estado: "",
  cidade: "",
  enderecoCompleto: "",
};

const needsInitial = {
  Saúde: false,
  Abrigo: false,
  Emprego: false,
  Cursos: false,
  "Assistência Jurídica": false,
  Alimentação: false,
  Educação: false,
  Documentação: false,
};

const servicesInitial = {
  Saúde: false,
  Abrigo: false,
  "Emprego/Capacitação": false,
  Cursos: false,
  "Assistência Jurídica": false,
  Alimentação: false,
  Educação: false,
  Documentação: false,
};

function Field({ id, label, required, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function CheckGrid({ values, onChange }) {
  return (
    <div className="check-grid">
      {Object.keys(values).map((item) => (
        <label className="check-option" key={item}>
          <input
            type="checkbox"
            checked={values[item]}
            onChange={(e) => onChange(item, e.target.checked)}
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}

function Home({ navegarParaAdmin, navegarParaOng }) {
  const { t, i18n } = useTranslation();
  const dialogRef = useRef(null);
  const [login, setLogin] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginStatus, setLoginStatus] = useState({ type: "", message: "" });
  const [refugee, setRefugee] = useState(refugeeInitial);
  const [needs, setNeeds] = useState(needsInitial);
  const [org, setOrg] = useState(orgInitial);
  const [services, setServices] = useState(servicesInitial);
  const [refugeeStatus, setRefugeeStatus] = useState({ type: "", message: "" });
  const [orgStatus, setOrgStatus] = useState({ type: "", message: "" });
  const [query, setQuery] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [searchStatus, setSearchStatus] = useState("loading");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/organizacoes")
      .then((res) => {
        setOrganizations(res.data);
        setSearchStatus("success");
      })
      .catch(() => setSearchStatus("error"));

    api
      .get("/plataforma/estatisticas")
      .then((response) => setStats(response.data))
      .catch(() => setStats(null));
  }, []);

  useEffect(() => {
    if (login) {
      setTimeout(() => dialogRef.current?.focus(), 0);
    }
  }, [login]);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return organizations;
    return organizations.filter((item) =>
      [item.nomeFantasia, item.cidade, item.estado, ...(item.servicos || [])]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(term)),
    );
  }, [query, organizations]);

  const change =
    (setter) =>
    ({ target: { name, value } }) =>
      setter((current) => ({
        ...current,
        [name]:
          name === "numFamiliares" ? Number.parseInt(value, 10) || 0 : value,
      }));

  const openLogin = (type) => {
    setLogin(type);
    setCredentials({ email: "", password: "" });
    setLoginStatus({ type: "", message: "" });
  };

  const submitLogin = (event) => {
    event.preventDefault();
    setLoginStatus({ type: "loading", message: "Verificando acesso…" });
    localStorage.setItem(
      "basicAuth",
      btoa(`${credentials.email}:${credentials.password}`),
    );
    const request =
      login === "admin"
        ? api.get("/plataforma/admin/dashboard")
        : api.post("/organizacoes/login", credentials);

    request
      .then(() => {
        setLogin(null);
        login === "admin" ? navegarParaAdmin() : navegarParaOng();
      })
      .catch(() => {
        localStorage.removeItem("basicAuth");
        setLoginStatus({
          type: "error",
          message:
            "E-mail ou senha incorretos. Revise os dados e tente novamente.",
        });
      });
  };

  const submitRefugee = (event) => {
    event.preventDefault();
    setRefugeeStatus({ type: "loading", message: "Enviando solicitação…" });
    const payload = {
      ...refugee,
      necessidades: Object.keys(needs).filter((key) => needs[key]),
    };

    api
      .post("/refugiados", payload)
      .then(() => {
        setRefugee(refugeeInitial);
        setNeeds(needsInitial);
        setRefugeeStatus({
          type: "success",
          message:
            "Solicitação enviada. Uma organização poderá analisar as informações fornecidas.",
        });
      })
      .catch(() =>
        setRefugeeStatus({
          type: "error",
          message:
            "Não foi possível enviar agora. Seus dados continuam no formulário; tente novamente.",
        }),
      );
  };

  const submitOrg = (event) => {
    event.preventDefault();
    setOrgStatus({ type: "loading", message: "Enviando cadastro…" });
    const payload = {
      ...org,
      servicos: Object.keys(services).filter((key) => services[key]),
    };

    api
      .post("/organizacoes", payload)
      .then(() => {
        setOrg(orgInitial);
        setServices(servicesInitial);
        setOrgStatus({
          type: "success",
          message: "Organização cadastrada com sucesso.",
        });
        return api.get("/organizacoes");
      })
      .then((res) => res && setOrganizations(res.data))
      .catch(() =>
        setOrgStatus({
          type: "error",
          message:
            "Não foi possível concluir o cadastro. Revise os dados e tente novamente.",
        }),
      );
  };

  return (
    <div className="public-page">
      <a className="skip-link" href="#content">
        Ir para o conteúdo
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#start" aria-label="AR Help — início">
            <span className="brand-mark" aria-hidden="true">
              AR
            </span>
            <span>AR Help</span>
          </a>
          <nav className="primary-nav" aria-label="Navegação principal">
            <a href="#request">Solicitar ajuda</a>
            <a href="#find">Encontrar organização</a>
            <a href="#organizations">Cadastrar organização</a>
          </nav>
          <div className="header-actions">
            <select
              className="language"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              aria-label="Selecionar idioma"
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <button
              className="button button-quiet"
              onClick={() => openLogin("ong")}
            >
              Acessar painel
            </button>
          </div>
        </div>
      </header>

      <main id="content">
        <section className="intro" id="start">
          <div className="container intro-grid">
            <div className="intro-copy">
              <p className="context-label">
                Apoio para pessoas refugiadas no Brasil
              </p>
              <h1>{stats ? t("welcome") : "Precisa de ajuda?"}</h1>
              <p className="intro-lead">{t("subtitle")}</p>
              <div className="intro-actions">
                <a className="button button-primary" href="#request">
                  {t("btnRefugee")}
                </a>
                <a className="button button-secondary" href="#find">
                  {t("btnOng")}
                </a>
              </div>
              <p className="privacy-note">
                O cadastro é gratuito. Informe somente os dados necessários para
                receber atendimento.
              </p>
            </div>
            <aside className="how" aria-labelledby="how-title">
              <h2 id="how-title">Como funciona</h2>
              <ol>
                <li>
                  <span>1</span>
                  <p>
                    <strong>Informe o que precisa.</strong>
                    <br />
                    Preencha seus dados e selecione os tipos de ajuda.
                  </p>
                </li>
                <li>
                  <span>2</span>
                  <p>
                    <strong>Uma organização analisa.</strong>
                    <br />
                    Organizações cadastradas podem consultar a solicitação.
                  </p>
                </li>
                <li>
                  <span>3</span>
                  <p>
                    <strong>Você recebe contato.</strong>
                    <br />
                    Mantenha seu telefone atualizado para receber retorno.
                  </p>
                </li>
              </ol>
            </aside>
          </div>
        </section>

        <section className="section section-muted" id="request">
          <div className="container form-layout">
            <div className="section-heading">
              <p className="context-label">Para pessoas refugiadas</p>
              <h2>Solicitar ajuda</h2>
              <p>
                Os campos com * são obrigatórios. Seus dados serão usados para
                analisar a solicitação e entrar em contato.
              </p>
            </div>
            <form className="form-panel" onSubmit={submitRefugee}>
              <fieldset>
                <legend>Dados pessoais</legend>
                <div className="form-grid">
                  <Field id="name" label={t("fullName")} required>
                    <input
                      id="name"
                      name="nomeCompleto"
                      value={refugee.nomeCompleto}
                      onChange={change(setRefugee)}
                      autoComplete="name"
                      required
                    />
                  </Field>
                  <Field id="nationality" label={t("nationality")} required>
                    <input
                      id="nationality"
                      name="nacionalidade"
                      value={refugee.nacionalidade}
                      onChange={change(setRefugee)}
                      required
                    />
                  </Field>
                  <Field id="birth" label={t("birthDate")} required>
                    <input
                      id="birth"
                      type="date"
                      name="dataNascimento"
                      value={refugee.dataNascimento}
                      onChange={change(setRefugee)}
                      required
                    />
                  </Field>
                  <Field id="gender" label={t("gender")}>
                    <select
                      id="gender"
                      name="genero"
                      value={refugee.genero}
                      onChange={change(setRefugee)}
                    >
                      <option>Masculino</option>
                      <option>Feminino</option>
                      <option>Outro</option>
                    </select>
                  </Field>
                  <Field
                    id="document"
                    label="Documento de identificação"
                    hint="Passaporte, RNM, CPF ou outro documento disponível."
                    required
                  >
                    <input
                      id="document"
                      name="documentoIdentificacao"
                      value={refugee.documentoIdentificacao}
                      onChange={change(setRefugee)}
                      aria-describedby="document-hint"
                      required
                    />
                  </Field>
                  <Field id="family" label="Número de familiares no país">
                    <input
                      id="family"
                      type="number"
                      min="0"
                      name="numFamiliares"
                      value={refugee.numFamiliares}
                      onChange={change(setRefugee)}
                    />
                  </Field>
                </div>
              </fieldset>
              <fieldset>
                <legend>Contato e localização</legend>
                <div className="form-grid">
                  <Field
                    id="phone"
                    label={t("phone")}
                    hint="Inclua o DDD."
                    required
                  >
                    <input
                      id="phone"
                      type="tel"
                      name="telefone"
                      value={refugee.telefone}
                      onChange={change(setRefugee)}
                      autoComplete="tel"
                      aria-describedby="phone-hint"
                      required
                    />
                  </Field>
                  <Field id="state" label="Estado atual">
                    <input
                      id="state"
                      name="estado"
                      value={refugee.estado}
                      onChange={change(setRefugee)}
                      autoComplete="address-level1"
                    />
                  </Field>
                  <Field id="city" label="Cidade atual">
                    <input
                      id="city"
                      name="cidade"
                      value={refugee.cidade}
                      onChange={change(setRefugee)}
                      autoComplete="address-level2"
                    />
                  </Field>
                  <Field id="address" label="Endereço, se tiver">
                    <input
                      id="address"
                      name="enderecoCompleto"
                      value={refugee.enderecoCompleto}
                      onChange={change(setRefugee)}
                      autoComplete="street-address"
                    />
                  </Field>
                </div>
              </fieldset>
              <fieldset>
                <legend>Ajuda necessária</legend>
                <p className="fieldset-help">
                  Selecione todas as opções que se aplicam.
                </p>
                <CheckGrid
                  values={needs}
                  onChange={(item, checked) =>
                    setNeeds((current) => ({ ...current, [item]: checked }))
                  }
                />
                <Field
                  id="report"
                  label="Conte um pouco sobre a situação"
                  hint="Não inclua informações que não sejam necessárias para o atendimento."
                >
                  <textarea
                    id="report"
                    rows="5"
                    name="relatoSituacao"
                    value={refugee.relatoSituacao}
                    onChange={change(setRefugee)}
                    aria-describedby="report-hint"
                  />
                </Field>
              </fieldset>
              {refugeeStatus.message && (
                <p
                  className={`status-message ${refugeeStatus.type}`}
                  role="status"
                >
                  {refugeeStatus.message}
                </p>
              )}
              <button
                className="button button-primary submit-button"
                disabled={refugeeStatus.type === "loading"}
              >
                {refugeeStatus.type === "loading"
                  ? "Enviando…"
                  : t("btnSubmitRefugee")}
              </button>
            </form>
          </div>
        </section>

        <section className="section" id="find">
          <div className="container narrow-container">
            <div className="section-heading">
              <p className="context-label">Atendimento disponível</p>
              <h2>Encontrar uma organização</h2>
              <p>Busque pelo nome, cidade, estado ou tipo de serviço.</p>
            </div>
            <label className="search-field" htmlFor="org-search">
              <span>Buscar organização</span>
              <input
                id="org-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: abrigo ou São Paulo"
              />
            </label>
            <div className="result-summary" aria-live="polite">
              {searchStatus === "success" &&
                `${filtered.length} ${filtered.length === 1 ? "organização encontrada" : "organizações encontradas"}`}
            </div>
            {searchStatus === "loading" && (
              <p className="empty-state" role="status">
                Carregando organizações…
              </p>
            )}
            {searchStatus === "error" && (
              <p className="status-message error" role="status">
                Não foi possível carregar as organizações. Tente novamente mais
                tarde.
              </p>
            )}
            {searchStatus === "success" && filtered.length === 0 && (
              <p className="empty-state">
                Nenhuma organização encontrada. Tente outro nome, local ou
                serviço.
              </p>
            )}
            <div className="organization-list">
              {filtered.map((item) => (
                <article className="organization-row" key={item.id}>
                  <div>
                    <p className="org-type">{item.tipo || "Organização"}</p>
                    <h3>{item.nomeFantasia}</h3>
                    <p>
                      {[item.cidade, item.estado].filter(Boolean).join(" — ") ||
                        "Local não informado"}
                    </p>
                  </div>
                  <div className="org-contact">
                    <p>
                      <strong>Telefone</strong>
                      <br />
                      {item.telefone || "Não informado"}
                    </p>
                    {item.servicos?.length > 0 && (
                      <p>
                        <strong>Serviços</strong>
                        <br />
                        {item.servicos.join(", ")}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-muted" id="organizations">
          <div className="container form-layout">
            <div className="section-heading">
              <p className="context-label">Para organizações</p>
              <h2>Cadastrar organização</h2>
              <p>
                Cadastre a instituição e os serviços oferecidos. Depois, use o
                painel para consultar solicitações.
              </p>
              <button className="text-button" onClick={() => openLogin("ong")}>
                Já tem cadastro? Acessar painel
              </button>
            </div>
            <form className="form-panel" onSubmit={submitOrg}>
              <fieldset>
                <legend>Identificação</legend>
                <div className="form-grid">
                  <Field id="legalName" label="Razão social" required>
                    <input
                      id="legalName"
                      name="razaoSocial"
                      value={org.razaoSocial}
                      onChange={change(setOrg)}
                      required
                    />
                  </Field>
                  <Field id="tradeName" label="Nome da organização" required>
                    <input
                      id="tradeName"
                      name="nomeFantasia"
                      value={org.nomeFantasia}
                      onChange={change(setOrg)}
                      required
                    />
                  </Field>
                  <Field id="cnpj" label="CNPJ" required>
                    <input
                      id="cnpj"
                      name="cnpj"
                      value={org.cnpj}
                      onChange={change(setOrg)}
                      required
                    />
                  </Field>
                  <Field id="type" label="Tipo">
                    <select
                      id="type"
                      name="tipo"
                      value={org.tipo}
                      onChange={change(setOrg)}
                    >
                      <option>ONG</option>
                      <option>Fundação</option>
                      <option>Instituição Religiosa</option>
                      <option>Associação</option>
                    </select>
                  </Field>
                </div>
                <Field id="description" label="Descrição das atividades">
                  <textarea
                    id="description"
                    rows="4"
                    name="descricao"
                    value={org.descricao}
                    onChange={change(setOrg)}
                  />
                </Field>
              </fieldset>
              <fieldset>
                <legend>Localização e atendimento</legend>
                <div className="form-grid">
                  <Field id="postal" label="CEP">
                    <input
                      id="postal"
                      name="cep"
                      value={org.cep}
                      onChange={change(setOrg)}
                    />
                  </Field>
                  <Field id="orgState" label="Estado">
                    <input
                      id="orgState"
                      name="estado"
                      value={org.estado}
                      onChange={change(setOrg)}
                    />
                  </Field>
                  <Field id="orgCity" label="Cidade">
                    <input
                      id="orgCity"
                      name="cidade"
                      value={org.cidade}
                      onChange={change(setOrg)}
                    />
                  </Field>
                  <Field id="district" label="Bairro">
                    <input
                      id="district"
                      name="bairro"
                      value={org.bairro}
                      onChange={change(setOrg)}
                    />
                  </Field>
                  <Field id="orgAddress" label="Endereço">
                    <input
                      id="orgAddress"
                      name="enderecoCompleto"
                      value={org.enderecoCompleto}
                      onChange={change(setOrg)}
                    />
                  </Field>
                  <Field id="hours" label="Horário de atendimento">
                    <input
                      id="hours"
                      name="horarioFuncionamento"
                      value={org.horarioFuncionamento}
                      onChange={change(setOrg)}
                    />
                  </Field>
                  <Field id="languages" label="Idiomas de atendimento">
                    <input
                      id="languages"
                      name="idiomasAtendimento"
                      value={org.idiomasAtendimento}
                      onChange={change(setOrg)}
                    />
                  </Field>
                  <Field id="website" label="Site ou rede social">
                    <input
                      id="website"
                      name="website"
                      value={org.website}
                      onChange={change(setOrg)}
                    />
                  </Field>
                </div>
              </fieldset>
              <fieldset>
                <legend>Serviços oferecidos</legend>
                <CheckGrid
                  values={services}
                  onChange={(item, checked) =>
                    setServices((current) => ({ ...current, [item]: checked }))
                  }
                />
              </fieldset>
              <fieldset>
                <legend>Acesso ao painel</legend>
                <div className="form-grid">
                  <Field id="orgPhone" label="Telefone" required>
                    <input
                      id="orgPhone"
                      type="tel"
                      name="telefone"
                      value={org.telefone}
                      onChange={change(setOrg)}
                      required
                    />
                  </Field>
                  <Field id="orgEmail" label="E-mail institucional" required>
                    <input
                      id="orgEmail"
                      type="email"
                      name="email"
                      value={org.email}
                      onChange={change(setOrg)}
                      required
                    />
                  </Field>
                  <Field
                    id="orgPassword"
                    label="Senha"
                    hint="Use pelo menos 6 caracteres."
                    required
                  >
                    <input
                      id="orgPassword"
                      type="password"
                      minLength="6"
                      name="senha"
                      value={org.senha}
                      onChange={change(setOrg)}
                      aria-describedby="orgPassword-hint"
                      required
                    />
                  </Field>
                </div>
              </fieldset>
              {orgStatus.message && (
                <p className={`status-message ${orgStatus.type}`} role="status">
                  {orgStatus.message}
                </p>
              )}
              <button
                className="button button-primary submit-button"
                disabled={orgStatus.type === "loading"}
              >
                {orgStatus.type === "loading"
                  ? "Enviando…"
                  : "Cadastrar organização"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>AR Help</strong>
            <p>
              Conexão direta entre pessoas refugiadas e organizações de apoio.
            </p>
          </div>
          <div>
            <button className="footer-link" onClick={() => openLogin("admin")}>
              Acesso administrativo
            </button>
            <p>© 2026 AR Help</p>
          </div>
        </div>
      </footer>

      {login && (
        <div
          className="dialog-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setLogin(null)}
        >
          <section
            className="login-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            tabIndex="-1"
            ref={dialogRef}
            onKeyDown={(e) => e.key === "Escape" && setLogin(null)}
          >
            <button
              className="dialog-close"
              aria-label="Fechar"
              onClick={() => setLogin(null)}
            >
              ×
            </button>
            <p className="context-label">Acesso restrito</p>
            <h2 id="login-title">
              {login === "admin"
                ? "Painel administrativo"
                : "Painel da organização"}
            </h2>
            <p>Informe as credenciais cadastradas.</p>
            <form onSubmit={submitLogin}>
              <Field
                id="loginEmail"
                label={login === "admin" ? "Credencial" : "E-mail"}
                required
              >
                <input
                  id="loginEmail"
                  type={login === "admin" ? "text" : "email"}
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  autoComplete="username"
                  required
                />
              </Field>
              <Field id="loginPassword" label="Senha" required>
                <input
                  id="loginPassword"
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((current) => ({
                      ...current,
                      password: e.target.value,
                    }))
                  }
                  autoComplete="current-password"
                  required
                />
              </Field>
              {loginStatus.message && (
                <p
                  className={`status-message ${loginStatus.type}`}
                  role="status"
                >
                  {loginStatus.message}
                </p>
              )}
              <button
                className="button button-primary submit-button"
                disabled={loginStatus.type === "loading"}
              >
                {loginStatus.type === "loading" ? "Verificando…" : "Entrar"}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;
