import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

function AdminDashboard({ navegarParaHome }) {
  const [dashboard, setDashboard] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [refugees, setRefugees] = useState([]);
  const [tab, setTab] = useState("organizations");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const loadData = useCallback(() => {
    setMessage("");
    return Promise.all([
      api.get("/plataforma/admin/dashboard"),
      api.get("/organizacoes"),
      api.get("/refugiados"),
    ])
      .then(([dash, orgs, refs]) => {
        setDashboard(dash.data);
        setOrganizations(orgs.data);
        setRefugees(refs.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => {
        if (!cancelled) return loadData();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  const remove = (type, id, name) => {
    const label = type === "organizations" ? "a organização" : "o registro de";
    if (
      !window.confirm(
        `Remover permanentemente ${label} “${name}”? Esta ação não pode ser desfeita.`,
      )
    )
      return;
    setMessage("Removendo registro…");
    api
      .delete(
        type === "organizations" ? `/organizacoes/${id}` : `/refugiados/${id}`,
      )
      .then(() => {
        setMessage("Registro removido com sucesso.");
        return loadData();
      })
      .catch(() =>
        setMessage(
          "Não foi possível remover o registro. Verifique se existem dados vinculados.",
        ),
      );
  };

  const activeItems = tab === "organizations" ? organizations : refugees;
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return activeItems;
    return activeItems.filter((item) =>
      [
        item.nomeFantasia,
        item.razaoSocial,
        item.nomeCompleto,
        item.nacionalidade,
        item.cidade,
        item.estado,
        item.email,
      ]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(term)),
    );
  }, [activeItems, query]);

  if (status === "loading" && !dashboard) {
    return (
      <div className="loading-page" role="status">
        Carregando painel administrativo…
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <h1 className="dashboard-title">AR Help · Administração</h1>
          <button className="button button-quiet" onClick={navegarParaHome}>
            Sair
          </button>
        </div>
      </header>
      <main className="container dashboard-main">
        <div className="dashboard-intro">
          <div>
            <p className="context-label">Visão operacional</p>
            <h2>Cadastros da plataforma</h2>
            <p>
              Consulte e administre organizações e solicitações registradas.
            </p>
          </div>
          <button
            className="button button-secondary"
            onClick={() => {
              setStatus("loading");
              loadData();
            }}
          >
            Atualizar dados
          </button>
        </div>

        {status === "error" && (
          <p className="status-message error" role="status">
            Não foi possível carregar todos os dados. Tente atualizar o painel.
          </p>
        )}
        {message && (
          <p className="status-message loading" role="status">
            {message}
          </p>
        )}

        <section className="summary-strip" aria-label="Resumo do sistema">
          <div className="summary-item">
            <span className="summary-label">Pessoas cadastradas</span>
            <p className="summary-value">
              {dashboard?.totalRefugiados ?? refugees.length}
            </p>
          </div>
          <div className="summary-item">
            <span className="summary-label">Organizações</span>
            <p className="summary-value">
              {dashboard?.totalOrganizacoes ?? organizations.length}
            </p>
          </div>
          <div className="summary-item">
            <span className="summary-label">Estado do serviço</span>
            <p className="summary-value" style={{ fontSize: "1rem" }}>
              {dashboard?.statusSistema || "Disponível"}
            </p>
          </div>
        </section>

        <div className="tabs" role="tablist" aria-label="Tipo de cadastro">
          <button
            className={`tab ${tab === "organizations" ? "active" : ""}`}
            role="tab"
            aria-selected={tab === "organizations"}
            onClick={() => {
              setTab("organizations");
              setQuery("");
            }}
          >
            Organizações ({organizations.length})
          </button>
          <button
            className={`tab ${tab === "refugees" ? "active" : ""}`}
            role="tab"
            aria-selected={tab === "refugees"}
            onClick={() => {
              setTab("refugees");
              setQuery("");
            }}
          >
            Solicitações ({refugees.length})
          </button>
        </div>

        <div className="toolbar">
          <label className="search-field" htmlFor="admin-search">
            <span>Buscar nesta lista</span>
            <input
              id="admin-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "organizations"
                  ? "Nome, cidade ou e-mail"
                  : "Nome, nacionalidade ou cidade"
              }
            />
          </label>
        </div>
        <p className="result-summary">
          {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
        </p>

        {filtered.length === 0 ? (
          <p className="empty-state">Nenhum registro corresponde à busca.</p>
        ) : (
          <div className="table-wrap">
            {tab === "organizations" ? (
              <table>
                <thead>
                  <tr>
                    <th>Organização</th>
                    <th>CNPJ</th>
                    <th>Localidade</th>
                    <th>Contato</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.nomeFantasia}</strong>
                        <div className="cell-muted">{item.tipo || "ONG"}</div>
                      </td>
                      <td>{item.cnpj || "Não informado"}</td>
                      <td>
                        {[item.cidade, item.estado]
                          .filter(Boolean)
                          .join(" — ") || "Não informada"}
                      </td>
                      <td>
                        {item.telefone || "Sem telefone"}
                        <div className="cell-muted">{item.email}</div>
                      </td>
                      <td>
                        <button
                          className="button button-danger table-action"
                          onClick={() =>
                            remove("organizations", item.id, item.nomeFantasia)
                          }
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Pessoa</th>
                    <th>Nacionalidade</th>
                    <th>Contato e local</th>
                    <th>Ajuda solicitada</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const needs = Array.isArray(item.necessidades)
                      ? item.necessidades
                      : [];
                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.nomeCompleto}</strong>
                          <div className="cell-muted">
                            {item.genero || "Gênero não informado"}
                          </div>
                        </td>
                        <td>{item.nacionalidade || "Não informada"}</td>
                        <td>
                          {item.telefone || "Sem telefone"}
                          <div className="cell-muted">
                            {[item.cidade, item.estado]
                              .filter(Boolean)
                              .join(" — ") || "Local não informado"}
                          </div>
                        </td>
                        <td>
                          {needs.length > 0 ? (
                            <ul className="need-list">
                              {needs.map((need) => (
                                <li key={need}>{need}</li>
                              ))}
                            </ul>
                          ) : (
                            "Não informada"
                          )}
                        </td>
                        <td>
                          <button
                            className="button button-danger table-action"
                            onClick={() =>
                              remove("refugees", item.id, item.nomeCompleto)
                            }
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
