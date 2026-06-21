# 🛡️ Desafio Técnico — Automação de Testes Sênior (QA)

Repositório desenvolvido para o desafio técnico de automação de testes, contemplando validações de **API REST**, **UI Web**, **Performance** e **CI/CD**.

O projeto foi estruturado com foco em boas práticas de engenharia de qualidade, separação de responsabilidades, legibilidade, manutenção, estabilidade dos testes e geração de evidências para análise técnica.

---

## 📌 Sumário

- [Objetivos e Escopo](#-objetivos-e-escopo)
- [Critérios Atendidos](#-critérios-atendidos)
- [Decisões Técnicas](#-decisões-técnicas)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Configuração e Execução Local](#️-configuração-e-execução-local)
- [Execução via CI/CD](#️-execução-via-cicd)
- [Relatórios e Evidências](#-relatórios-e-evidências)
- [Melhorias Futuras](#-melhorias-futuras)

---

## 🎯 Objetivos e Escopo

### API — JSONPlaceholder

- Validar cenários de sucesso com status `200`.
- Validar criação de recurso com status `201 Created`.
- Validar estrutura do payload por meio de asserções e tipagem TypeScript.
- Simular cenários negativos com status `401`, `403` e `409`.
- Implementar fluxo encadeado de CRUD: `POST` ➜ `GET` ➜ `PUT` ➜ `DELETE`.

### UI — SauceDemo

- Automatizar fluxo de login.
- Validar carregamento do catálogo de produtos.
- Validar adição de produtos ao carrinho.
- Aplicar o padrão **Page Object Model (POM)**.
- Utilizar massa de dados externa para facilitar manutenção e reutilização.

### Performance — k6

- Executar teste de carga com rampa de usuários virtuais.
- Validar tempo de resposta e taxa de falha por meio de thresholds.
- Avaliar comportamento da API sob carga controlada.

### CI/CD — GitHub Actions

- Executar os testes automaticamente em eventos de `push` e `pull_request`.
- Montar o ambiente de execução de forma automatizada.
- Gerar relatório HTML do Playwright como artefato da pipeline.

---

## ✅ Critérios Atendidos

| Área | Implementação |
|---|---|
| API | Testes de sucesso, contrato estrutural, cenários negativos e fluxo CRUD |
| UI | Testes E2E com Page Object Model e massa externa |
| Performance | Script k6 com stages e thresholds |
| CI/CD | Pipeline GitHub Actions com execução automatizada e artefatos |
| Manutenibilidade | Separação por camadas, helpers, pages, config e massa de dados |
| Estabilidade | Uso de recursos nativos do Playwright, evitando waits fixos |

---

## 🧠 Decisões Técnicas

### 1. Validação de contrato e sucesso — API

A validação estrutural do payload foi implementada com asserções do Playwright e apoio da tipagem estática do TypeScript.

Essa abordagem reduz dependências externas, mantém o teste objetivo e facilita a identificação de quebras na estrutura esperada da resposta.

### 2. Fluxo dinâmico de CRUD — API

A API `JSONPlaceholder` é pública e não persiste dados criados via `POST`. Apesar de retornar o status `201 Created` e um novo identificador, o recurso criado não fica disponível para consultas posteriores.

Por esse motivo, o fluxo foi tratado da seguinte forma:

- `POST`: valida a criação simulada do recurso e o retorno `201 Created`.
- `GET`, `PUT` e `DELETE`: utilizam um ID já existente na base pública da API, garantindo estabilidade e previsibilidade na execução.

Essa decisão evita testes instáveis e mantém aderência ao comportamento real da API utilizada no desafio.

### 3. Cenários negativos — API

Como o `JSONPlaceholder` não possui autenticação, autorização ou controle real de conflito de estado, os cenários `401`, `403` e `409` foram simulados com o endpoint auxiliar `httpbin.org/status`.

Essa solução permite validar o comportamento esperado para códigos HTTP negativos sem criar dependência de uma API privada ou instável.

### 4. Estabilidade e anti-flakiness — UI

A automação de UI foi estruturada para evitar esperas fixas e reduzir falsos positivos ou falsos negativos.

Foram aplicadas as seguintes práticas:

- uso do padrão **Page Object Model**;
- centralização de ações comuns em uma `BasePage`;
- validações explícitas de visibilidade antes das interações críticas;
- uso de seletores estáveis;
- separação entre lógica de teste, páginas e massa de dados.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Finalidade |
|---|---|
| Playwright | Automação de testes de API e UI |
| TypeScript | Tipagem estática, legibilidade e redução de erros em desenvolvimento |
| k6 | Testes de performance e carga |
| dotenv | Gerenciamento de variáveis de ambiente |
| GitHub Actions | Integração contínua e geração de artefatos |

---

## 🏗️ Arquitetura do Projeto

A estrutura foi organizada por responsabilidade, facilitando manutenção, evolução e leitura do projeto.

```text
📦 desafio-qa-senior
 ┣ 📂 .github/workflows     # Definição da esteira de CI/CD
 ┣ 📂 k6                    # Scripts de performance
 ┣ 📂 src
 ┃ ┣ 📂 config              # Gerenciamento de variáveis de ambiente
 ┃ ┣ 📂 data                # Massa de dados parametrizada
 ┃ ┣ 📂 pages               # Page Object Model
 ┃ ┗ 📂 support             # Helpers e clientes de requisição
 ┣ 📂 tests
 ┃ ┣ 📂 api                 # Testes de API REST
 ┃ ┗ 📂 ui                  # Testes de UI Web
 ┣ 📜 .env.example          # Template de variáveis de ambiente
 ┣ 📜 playwright.config.ts  # Configuração global do Playwright
 ┗ 📜 package.json          # Dependências e scripts do projeto
```

---

## ⚙️ Configuração e Execução Local

### Pré-requisitos

Antes de executar o projeto, certifique-se de possuir os seguintes itens instalados:

- Node.js `v18` ou superior;
- Git;
- k6 CLI, necessário apenas para execução dos testes de performance.

Instalação do k6:

```bash
# Windows — WinGet
winget install k6

# macOS — Homebrew
brew install k6
```

> **Observação:** não é necessário instalar Chrome, Firefox ou Safari manualmente. O Playwright realiza o download dos navegadores utilizados na execução dos testes.

### 1. Clonar o repositório

```bash
git clone https://github.com/jucalha/desafio-qa-senior.git
cd desafio-qa-senior
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Instalar os navegadores do Playwright

```bash
npx playwright install
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como base.

```env
BASE_URL_API=https://jsonplaceholder.typicode.com
BASE_URL_UI=https://www.saucedemo.com
MOCK_URL_ERRORS=https://httpbin.org/status
USER_UI=standard_user
PASSWORD_UI=secret_sauce
```

---

## ▶️ Executando os Testes

### Executar todos os testes de API e UI

```bash
npx playwright test
```

### Executar apenas os testes de UI em modo visível

```bash
npx playwright test tests/ui/sauceDemo.spec.ts --project=chromium --headed
```

### Executar testes de performance

```bash
k6 run k6/performance.js
```

### Abrir o relatório HTML do Playwright

```bash
npx playwright show-report
```

---

## ☁️ Execução via CI/CD

O projeto possui uma pipeline configurada no **GitHub Actions**, executada automaticamente nos eventos de `push` e `pull_request` para a branch `main`.

Durante a execução, a pipeline realiza:

1. checkout do repositório;
2. instalação das dependências;
3. configuração das variáveis de ambiente;
4. instalação dos navegadores do Playwright;
5. execução dos testes automatizados;
6. publicação do relatório HTML como artefato.

---

## 📊 Relatórios e Evidências

Ao final da execução dos testes, o Playwright gera um relatório HTML com detalhes da execução, incluindo:

- testes executados;
- status de sucesso ou falha;
- tempo de execução;
- evidências para análise;
- rastreabilidade das falhas quando aplicável.

Na pipeline, a pasta `playwright-report` é disponibilizada como artefato para download, permitindo análise sem necessidade de executar o projeto localmente.

---

## 🚀 Melhorias Futuras

Como evolução contínua do projeto, poderiam ser implementadas as seguintes melhorias:

- **Testes de performance avançados:** inclusão de cenários de stress, spike e soak test.
- **Visual Regression Testing:** validação visual com `toHaveScreenshot()` para detectar quebras de layout.
- **Matriz cross-browser:** execução automatizada em Chromium, Firefox e WebKit.
- **Integração com Test Management:** envio dos resultados para Jira/Xray, TestRail ou ferramenta equivalente.
- **Relatórios avançados:** integração com Allure Report ou dashboards executivos.
- **Execução por tags:** separação de suítes por tipo, criticidade ou camada da pirâmide de testes.

---

## ✅ Considerações Finais

Este projeto demonstra uma abordagem completa de automação de testes para um cenário técnico sênior, cobrindo API, UI, performance e CI/CD.

As decisões adotadas priorizam estabilidade, clareza, manutenção, rastreabilidade e alinhamento com boas práticas modernas de Quality Engineering.
