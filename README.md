# 🕊️ AR Help - Plataforma de Apoio e Acolhimento a Refugiados

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<blockquote>
  Conectando organizações humanitárias a refugiados e solicitantes de asilo para centralizar demandas de suporte, serviços e monitoramento global de integridade.
</blockquote>

---

## 💻 Sobre o Projeto

O **AR Help** é um ecossistema digital desenvolvido para solucionar a falta de centralização e a dificuldade de comunicação entre refugiados e entidades de apoio (ONGs e órgãos governamentais). 

A plataforma divide-se em duas grandes frentes operacionais:
1. **Cadastro e Triagem:** Permite o mapeamento de demandas críticas de refugiados (necessidades de acolhimento, saúde, documentação) e o registro de serviços oferecidos por instituições parceiras.
2. **Painel de Controle Operacional (Admin):** Um painel restrito e centralizado para gerenciamento global do ecossistema, permitindo auditoria, monitoramento do status do servidor e a deleção/limpeza em cascata de dados obsoletos.

---

## 🛠️ Stack Tecnológica

### Back-end (API REST)
* **Java 21** & **Spring Boot 3**
* **Spring Data JPA** (Persistência e mapeamento ORM)
* **Bean Validation** (Validação rigorosa de payloads com `@Valid` e `@NotBlank`)
* **PostgreSQL** (Banco de dados relacional de alta performance)

### Front-end
* **React.js** (Componentização reativa)
* **Axios** (Cliente HTTP com gerenciamento de `baseURL` global)
* **i18next** (Suporte nativo a internacionalização de idiomas)

### Infraestrutura & Ferramentas
* **Postman** (Testes automatizados de endpoints)

---

## 📐 Arquitetura de Endpoints (API REST)

A API do back-end segue rigidamente as boas práticas RESTful, utilizando os verbos HTTP corretos e códigos de status apropriados (ex: `201 Created`, `204 No Content` para deleções de sucesso).

### 🏢 Organizações (`/api/organizacoes`)
* `POST /api/organizacoes` - Cadastra uma nova entidade jurídica.
* `GET /api/organizacoes` - Lista todas as organizações parceiras ativas.
* `GET /api/organizacoes/busca?tipo={ONG}` - Busca dinâmica de instituições por tipo.
* `POST /api/organizacoes/login` - Autenticação e validação de credenciais de acesso.
* `DELETE /api/organizacoes/{id}` - Remove permanentemente uma organização e limpa tabelas dependentes no banco.

### 🕊️ Refugiados (`/api/refugiados`)
* `POST /api/refugiados` - Registra um acolhido e armazena suas necessidades iniciais.
* `GET /api/refugiados` - Lista todos os casos cadastrados.
* `GET /api/refugiados/{id}` - Busca detalhada de um caso específico por ID.
* `PUT /api/refugiados/{id}` - Atualização completa dos dados cadastrais e relatos de situação.
* `DELETE /api/refugiados/{id}` - Exclusão lógica/física com deleção automática das coleções filhas (`@ElementCollection`).

### 🛡️ Painel Administrativo
* `GET /plataforma/admin/dashboard` - Consolida métricas globais, contagem de registros e monitoramento de integridade do PostgreSQL.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Java 21 ou superior instalado
* Node.js instalado


