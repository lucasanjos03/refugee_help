import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function formatarDataISO(value) {
  if (!value) return null;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("pt-BR");
  } catch {
    return null;
  }
}

function calcularFaixaEtaria(value) {
  if (!value) return null;
  try {
    const nasc = new Date(value);
    if (Number.isNaN(nasc.getTime())) return null;
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade -= 1;
    if (idade < 0) return null;
    if (idade < 18) return idade + " anos (menor de idade)";
    return idade + " anos";
  } catch {
    return null;
  }
}

function extrairNecessidades(ref) {
  if (Array.isArray(ref?.necessidades) && ref.necessidades.length > 0) {
    return ref.necessidades.filter(Boolean);
  }
  if (Array.isArray(ref?.needs) && ref.needs.length > 0) {
    return ref.needs.filter(Boolean);
  }
  if (typeof ref?.necessidades === "string" && ref.necessidades.trim()) {
    return ref.necessidades
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function limparTelefone(tel) {
  if (!tel) return "";
  return String(tel).replace(/\D/g, "");
}

async function copiarTexto(texto) {
  if (!texto) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function Field({ label, children, htmlFor }) {
  return (
    <div className="field">
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
    </div>
  );
}

function OngDashboard({ navegarParaHome }) {
  const [todos, setTodos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroNecessidade, setFiltroNecessidade] = useState("");
  const [mensagemContato, setMensagemContato] = useState("");

  const carregar = () => {
    setCarregando(true);
    setErro("");
    api
      .get("/refugiados")
      .then((resp) => {
        const lista = Array.isArray(resp?.data) ? resp.data : [];
        setTodos(lista);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setErro("Sessão expirada. Faça login novamente.");
        } else {
          setErro(
            "Não foi possível carregar a lista de solicitantes no momento.",
          );
        }
        setTodos([]);
      })
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => {
        if (!cancelled) carregar();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const todasNecessidades = useMemo(() => {
    const set = new Set();
    for (const r of todos) {
      for (const n of extrairNecessidades(r)) set.add(n);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [todos]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return todos.filter((r) => {
      if (filtroNecessidade) {
        const necessidades = extrairNecessidades(r);
        if (!necessidades.includes(filtroNecessidade)) return false;
      }
      if (!termo) return true;
      const hay = [r.nomeCompleto, r.nacionalidade, r.cidade, r.estado]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(termo);
    });
  }, [todos, busca, filtroNecessidade]);

  const selecionado = useMemo(
    () => filtrados.find((r) => String(r.id) === String(selecionadoId)) ?? null,
    [filtrados, selecionadoId],
  );

  const abrirDetalhe = (id) => {
    setSelecionadoId(id);
    setMensagemContato("");
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        document
          .getElementById("painel-detalhe")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const fecharDetalhe = () => {
    setSelecionadoId(null);
    setMensagemContato("");
  };

  const handleCopiarTelefone = async (ref) => {
    const ok = await copiarTexto(ref.telefone);
    setMensagemContato(
      ok
        ? "Telefone de " + ref.nomeCompleto + " copiado."
        : "Não foi possível copiar o telefone.",
    );
  };

  const handleAbrirWhatsApp = (ref) => {
    const numero = limparTelefone(ref.telefone);
    if (!numero) {
      setMensagemContato("Telefone não disponível para WhatsApp.");
      return;
    }
    const url = "https://wa.me/55" + numero;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="page">
      <a className="skip-link" href="#conteudo-painel">
        Pular para o conteúdo
      </a>

      <header className="hero">
        <div className="container hero-inner">
          <div>
            <h1>Painel de Atendimento</h1>
            <p className="hero-sub">
              Visualize, compreenda e entre em contato com quem solicitou
              auxílio.
            </p>
          </div>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={navegarParaHome}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main id="conteudo-painel" className="container stack-lg" tabIndex={-1}>
        <section className="summary-strip" aria-label="Resumo de atendimento">
          <div>
            <span className="summary-label">Solicitações cadastradas</span>
            <span className="summary-value">{todos.length}</span>
          </div>
          <div>
            <span className="summary-label">Exibindo agora</span>
            <span className="summary-value">{filtrados.length}</span>
          </div>
          <div>
            <span className="summary-label">Tipos de ajuda registrados</span>
            <span className="summary-value">{todasNecessidades.length}</span>
          </div>
        </section>

        <section className="panel" aria-label="Busca e filtros">
          <div className="toolbar">
            <div className="toolbar-left">
              <Field label="Buscar por nome, origem ou cidade">
                <input
                  type="search"
                  id="busca-painel"
                  placeholder="Ex.: Ahmed, Síria, São Paulo…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  autoComplete="off"
                />
              </Field>
              <Field label="Tipo de ajuda">
                <select
                  id="filtro-ajuda"
                  value={filtroNecessidade}
                  onChange={(e) => setFiltroNecessidade(e.target.value)}
                >
                  <option value="">Todos os tipos</option>
                  {todasNecessidades.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="toolbar-right">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={carregar}
              >
                Atualizar
              </button>
            </div>
          </div>
          <div
            id="result-summary"
            className="result-summary"
            role="status"
            aria-live="polite"
          >
            {carregando
              ? "Carregando solicitantes…"
              : erro
                ? erro
                : filtrados.length === 0
                  ? todos.length === 0
                    ? "Nenhum solicitante cadastrado ainda."
                    : "Nenhum resultado para os filtros selecionados."
                  : filtrados.length + " solicitante(s) encontrado(s)."}
          </div>
        </section>

        {!carregando && !erro && filtrados.length > 0 && (
          <section className="panel" aria-label="Lista de solicitantes">
            <ul className="case-list" role="list">
              {filtrados.map((ref) => {
                const necessidades = extrairNecessidades(ref);
                const local =
                  [ref.cidade, ref.estado].filter(Boolean).join(" - ") ||
                  "Localização não informada";
                const familia =
                  typeof ref.numFamiliares === "number" &&
                  ref.numFamiliares >= 0
                    ? ref.numFamiliares === 0
                      ? "Apoio individual"
                      : ref.numFamiliares +
                        " " +
                        (ref.numFamiliares === 1 ? "pessoa" : "pessoas") +
                        " no grupo familiar"
                    : null;
                const selecionado = String(ref.id) === String(selecionadoId);
                return (
                  <li
                    key={ref.id}
                    className={"case-row " + (selecionado ? "is-selected" : "")}
                    aria-current={selecionado ? "true" : undefined}
                  >
                    <div className="case-main">
                      <div className="case-title-row">
                        <h3 className="case-title">
                          {ref.nomeCompleto || "Nome não informado"}
                        </h3>
                        {ref.nacionalidade && (
                          <span className="case-meta">{ref.nacionalidade}</span>
                        )}
                      </div>
                      {necessidades.length > 0 ? (
                        <div
                          className="need-tags"
                          aria-label="Tipos de ajuda solicitada"
                        >
                          {necessidades.slice(0, 3).map((n) => (
                            <span key={n} className="need-tag">
                              {n}
                            </span>
                          ))}
                          {necessidades.length > 3 && (
                            <span className="need-tag need-tag--muted">
                              +{necessidades.length - 3} mais
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="case-muted">
                          Nenhum tipo de ajuda informado.
                        </p>
                      )}
                      <div className="case-subrow">
                        <span className="case-meta" aria-label="Localização">
                          📍 {local}
                        </span>
                        {familia && (
                          <span className="case-meta">👥 {familia}</span>
                        )}
                      </div>
                    </div>
                    <div className="case-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => abrirDetalhe(ref.id)}
                        aria-expanded={selecionado}
                        aria-controls={
                          selecionado ? "painel-detalhe" : undefined
                        }
                      >
                        {selecionado ? "Detalhes abertos" : "Ver detalhes"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {selecionado && (
          <section
            id="painel-detalhe"
            className="detail-panel"
            aria-labelledby="detalhe-titulo"
            tabIndex={-1}
          >
            <div className="detail-head">
              <div>
                <h2 id="detalhe-titulo" className="detail-title">
                  {selecionado.nomeCompleto || "Solicitante"}
                </h2>
                <p className="detail-sub">
                  Informações para tomada de decisão e contato.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={fecharDetalhe}
              >
                Fechar detalhes
              </button>
            </div>

            {mensagemContato && (
              <div
                className="status-message status-message--info"
                role="status"
              >
                {mensagemContato}
              </div>
            )}

            <div className="detail-grid">
              <div className="detail-block">
                <h3>Identificação</h3>
                <dl>
                  <div>
                    <dt>Nome completo</dt>
                    <dd>{selecionado.nomeCompleto || "Não informado"}</dd>
                  </div>
                  {selecionado.nacionalidade && (
                    <div>
                      <dt>Nacionalidade</dt>
                      <dd>{selecionado.nacionalidade}</dd>
                    </div>
                  )}
                  {selecionado.genero && (
                    <div>
                      <dt>Gênero</dt>
                      <dd>{selecionado.genero}</dd>
                    </div>
                  )}
                  {(formatarDataISO(selecionado.dataNascimento) ||
                    calcularFaixaEtaria(selecionado.dataNascimento)) && (
                    <div>
                      <dt>Data de nascimento</dt>
                      <dd>
                        {formatarDataISO(selecionado.dataNascimento)}
                        {calcularFaixaEtaria(selecionado.dataNascimento) && (
                          <span className="muted-inline">
                            {" "}
                            · {calcularFaixaEtaria(selecionado.dataNascimento)}
                          </span>
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="detail-block">
                <h3>Localização</h3>
                <dl>
                  <div>
                    <dt>Cidade / UF</dt>
                    <dd>
                      {[selecionado.cidade, selecionado.estado]
                        .filter(Boolean)
                        .join(" - ") || "Não informado"}
                    </dd>
                  </div>
                  {selecionado.enderecoCompleto && (
                    <div>
                      <dt>Endereço</dt>
                      <dd>{selecionado.enderecoCompleto}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="detail-block detail-block--wide">
                <h3>Ajuda solicitada</h3>
                {extrairNecessidades(selecionado).length > 0 ? (
                  <div className="need-tags">
                    {extrairNecessidades(selecionado).map((n) => (
                      <span key={n} className="need-tag">
                        {n}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="case-muted">
                    Nenhum tipo de ajuda foi marcado no cadastro.
                  </p>
                )}
              </div>

              <div className="detail-block detail-block--wide">
                <h3>Situação relatada</h3>
                {selecionado.relatoSituacao ? (
                  <p className="detail-text">{selecionado.relatoSituacao}</p>
                ) : (
                  <p className="case-muted">
                    A pessoa não descreveu a situação no momento do cadastro.
                  </p>
                )}
              </div>

              <div className="detail-block">
                <h3>Contato</h3>
                <dl>
                  <div>
                    <dt>Telefone</dt>
                    <dd>{selecionado.telefone || "Não informado"}</dd>
                  </div>
                </dl>
                {selecionado.telefone && (
                  <div className="detail-actions">
                    <a
                      className="btn btn-primary"
                      href={"tel:" + limparTelefone(selecionado.telefone)}
                    >
                      Ligar
                    </a>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleCopiarTelefone(selecionado)}
                    >
                      Copiar telefone
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleAbrirWhatsApp(selecionado)}
                    >
                      Abrir WhatsApp
                    </button>
                  </div>
                )}
              </div>

              <div className="detail-block">
                <h3>Dados para atendimento</h3>
                <dl>
                  {typeof selecionado.numFamiliares === "number" && (
                    <div>
                      <dt>Pessoas no núcleo familiar</dt>
                      <dd>
                        {selecionado.numFamiliares === 0
                          ? "Apoio individual (sem dependentes informados)"
                          : selecionado.numFamiliares +
                            " " +
                            (selecionado.numFamiliares === 1
                              ? "pessoa"
                              : "pessoas")}
                      </dd>
                    </div>
                  )}
                  {selecionado.documentoIdentificacao && (
                    <div>
                      <dt>Documento de identificação</dt>
                      <dd>{selecionado.documentoIdentificacao}</dd>
                    </div>
                  )}
                  {typeof selecionado.numFamiliares !== "number" &&
                    !selecionado.documentoIdentificacao && (
                      <div>
                        <dd className="case-muted">
                          Nenhum dado complementar informado.
                        </dd>
                      </div>
                    )}
                </dl>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default OngDashboard;
