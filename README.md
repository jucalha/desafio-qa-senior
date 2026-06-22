# 🛡️ Desafio Técnico — Automação de Testes Sênior (QA)

Repositório desenvolvido para o desafio técnico de automação de testes, contemplando validações de **API REST**, **UI Web**, **Performance** e **CI/CD**.

O projeto foi estruturado com foco em boas práticas de engenharia de qualidade, separação de responsabilidades, legibilidade, manutenção, estabilidade dos testes e geração de evidências para análise técnica.

---

## 📌 Sumário

- [Objetivos e Escopo](#-objetivos-e-escopo)
- [Critérios Atendidos](#-critérios-atendidos)
- [Decisões Técnicas](#-decisões-técnicas)
- [Stack Tecnológica](#️-stack-tecnológica)
- [Arquitetura do Projeto](#️-arquitetura-do-projeto)
- [Configuração e Execução Local](#️-configuração-e-execução-local)
- [Executando os Testes](#️-executando-os-testes)
- [Execução via CI/CD](#️-execução-via-cicd)
- [Relatórios e Evidências](#-relatórios-e-evidências)
- [Uso de Inteligência Artificial](#-uso-de-inteligência-artificial-ai-pair-programming)
- [Melhorias Futuras](#-melhorias-futuras)
- [Considerações Finais](#-considerações-finais)

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
- Aplicar boas práticas para estabilidade, evitando esperas fixas e reduzindo riscos de *flakiness*.

### Performance — k6

- Executar teste de carga com rampa de usuários virtuais.
- Validar tempo de resposta e taxa de falha por meio de thresholds.
- Avaliar comportamento da API sob carga controlada.
- Permitir execução independente dos testes funcionais dentro da esteira de CI/CD.

### CI/CD — GitHub Actions

- Executar os testes automaticamente em eventos de `push` e `pull_request`.
- Montar o ambiente de execução de forma automatizada.
- Executar testes funcionais e testes de performance em jobs independentes.
- Gerar relatório HTML do Playwright como artefato da pipeline.
- Exibir status da execução diretamente na esteira.

---

## ✅ Critérios Atendidos

| Área | Implementação |
|---|---|
| API | Testes de sucesso, contrato estrutural, cenários negativos e fluxo CRUD adaptado |
| UI | Testes E2E com Page Object Model, validações visuais/funcionais e massa externa |
| Performance | Script k6 com múltiplos usuários virtuais, stages e thresholds |
| CI/CD | Pipeline GitHub Actions com jobs independentes, execução automatizada e artefatos |
| Manutenibilidade | Separação por camadas, helpers, pages, config e massa de dados |
| Estabilidade | Uso de recursos nativos do Playwright, auto-waiting e ausência de waits fixos |
| Documentação | Instruções de execução, decisões técnicas, arquitetura, relatórios e melhorias futuras |

---

## 🧠 Decisões Técnicas

### 1. Validação de contrato e sucesso — API

A validação estrutural do payload foi implementada com asserções explícitas do Playwright e apoio da tipagem estática do TypeScript.

Essa abordagem reduz dependências externas, mantém o teste objetivo e facilita a identificação de quebras na estrutura esperada da resposta.

Foram validados pontos como:

- presença de campos obrigatórios;
- tipos esperados dos atributos;
- estrutura mínima do payload;
- status code esperado para cada operação;
- consistência entre dados enviados e dados retornados pela API.

Embora não tenha sido utilizada uma biblioteca externa de JSON Schema, a combinação de asserções do Playwright com tipagem TypeScript garante uma validação objetiva e de fácil manutenção para o contexto do desafio.

### 2. Fluxo dinâmico de CRUD — API

A API `JSONPlaceholder` é pública e não persiste dados criados via `POST`. Apesar de retornar o status `201 Created` e um novo identificador, o recurso criado não fica disponível para consultas posteriores.

Por esse motivo, o fluxo foi tratado da seguinte forma:

- `POST`: valida a criação simulada do recurso e o retorno `201 Created`.
- `GET`, `PUT` e `DELETE`: utilizam um ID já existente na base pública da API, garantindo estabilidade e previsibilidade na execução.

Essa decisão evita testes instáveis, respeita o comportamento real da API utilizada e demonstra adaptação consciente diante das limitações de uma API pública.

### 3. Cenários negativos — API

Como o `JSONPlaceholder` não possui autenticação, autorização ou controle real de conflito de estado, os cenários `401`, `403` e `409` foram simulados com o endpoint auxiliar `postman-echo.com/status`.

Essa solução permite validar o comportamento esperado para códigos HTTP negativos sem criar dependência de uma API privada, instável ou fora do escopo do desafio.

A URL utilizada para simulação dos cenários negativos é parametrizada por variável de ambiente:

```env
MOCK_URL_ERRORS=https://postman-echo.com/status
```

### 4. Estabilidade, validações visuais e anti-flakiness — UI

A automação de UI foi estruturada para evitar esperas fixas e reduzir falsos positivos ou falsos negativos.

Foram aplicadas as seguintes práticas:

- uso do padrão **Page Object Model**;
- centralização de ações comuns em uma `BasePage`;
- validações explícitas de visibilidade antes das interações críticas;
- uso de seletores estáveis;
- separação entre lógica de teste, páginas e massa de dados;
- uso dos mecanismos nativos de espera do Playwright.

Nas validações de UI, foram consideradas condições visuais e funcionais, como:

- exibição da tela de produtos após login;
- visibilidade dos itens do catálogo;
- disponibilidade dos botões de ação;
- adição de produto ao carrinho;
- atualização do badge/contador do carrinho;
- manutenção do fluxo esperado após interações do usuário.

Essa abordagem prioriza estabilidade, clareza e confiabilidade, em vez de quantidade excessiva de cenários automatizados.

### 5. Escolha do framework — Playwright

A escolha do Playwright como motor principal de automação foi baseada em ganhos arquiteturais específicos para o contexto do projeto.

- **Unificação de camadas:** o Playwright permite testar tanto a interface gráfica (UI) quanto os serviços de rede (API) utilizando a mesma biblioteca nativa, reduzindo a curva de aprendizado e simplificando a stack.
- **Auto-waiting e estabilidade:** o mecanismo nativo de espera por acionabilidade (*actionability checks*) garante que o teste só interaja com elementos quando estiverem visíveis, habilitados e estáveis, reduzindo *flaky tests* causados por esperas fixas.
- **Paralelismo assíncrono:** a execução baseada em *workers* isolados e `BrowserContexts` independentes evita compartilhamento de cookies ou estado entre testes, permitindo execução simultânea e redução do tempo total de CI/CD.
- **Network interception:** a capacidade de escutar e manipular o tráfego de rede da página facilita o isolamento de componentes, a interceptação de chamadas de API e a criação de cenários mais controlados.
- **Relatório nativo:** o Playwright oferece geração de relatório HTML de forma integrada, facilitando análise de falhas e consulta de evidências sem depender obrigatoriamente de ferramentas externas.

### 6. Integração entre testes de API e UI — Cross-layer

A escolha do Playwright também considerou a possibilidade de integração entre testes de API e UI dentro do mesmo ecossistema técnico.

O framework permite utilizar recursos como `APIRequestContext` em conjunto com as specs de interface, viabilizando estratégias mais avançadas em cenários reais, como:

- preparação de massa de dados via API antes da execução de um teste de UI;
- limpeza de dados após a execução dos cenários;
- validações cruzadas entre ações realizadas na interface e respostas obtidas pela API;
- redução do tempo de execução de fluxos longos por meio de *state injection*;
- maior controle sobre pré-condições e dados necessários para os testes.

Em um contexto produtivo, essa abordagem permitiria, por exemplo, preparar um pedido via API, acessá-lo pela interface e validar seu comportamento no fluxo visual da aplicação. Também seria possível realizar uma ação na UI e confirmar, via API, se a informação foi corretamente persistida ou refletida no backend.

**Adaptação aplicada neste desafio:** as aplicações utilizadas, **SauceDemo** para UI e **JSONPlaceholder** para API, pertencem a domínios distintos e não possuem integração real entre seus backends. Por esse motivo, as suítes de API e UI foram mantidas independentes, evitando a criação de uma integração artificial que não representaria um fluxo real de negócio.

Ainda assim, a fundação técnica para uma estratégia *cross-layer* está presente no projeto: API e UI utilizam o mesmo runner, a mesma stack de automação, a mesma linguagem, a mesma estrutura de execução e o mesmo relatório do Playwright para os testes funcionais.

### 7. Estratégia de performance — k6

O k6 foi utilizado por ser uma ferramenta leve, orientada a código e adequada para validar endpoints de API sob carga controlada.

A estratégia adotada contempla:

- execução com múltiplos usuários virtuais;
- rampa gradual de carga;
- validação de status code;
- validação de thresholds de tempo de resposta;
- validação de taxa de falha das requisições.

O objetivo não foi reproduzir carga real de produção, mas demonstrar uma abordagem inicial de performance testing com critérios objetivos de aceite.

> **⚡ Destaque de Arquitetura — Paralelismo na Esteira**
>
> Na configuração do GitHub Actions, os testes funcionais com Playwright e os testes de carga com k6 foram desenhados para rodar em **jobs paralelos e independentes**.
>
> Essa decisão garante que o código receba validação funcional e validação de performance a cada novo commit, sem engarrafar a pipeline ou aumentar desnecessariamente o tempo total de execução. Dessa forma, o feedback sobre degradação da API e possíveis quebras na UI chega ao desenvolvedor de forma rápida e simultânea.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Finalidade |
|---|---|
| Playwright | Automação de testes de API e UI |
| TypeScript | Tipagem estática, legibilidade e redução de erros em desenvolvimento |
| k6 | Testes de performance e carga |
| dotenv | Gerenciamento de variáveis de ambiente |
| GitHub Actions | Integração contínua, execução automatizada e geração de artefatos |

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
 ┣ 📜 package.json          # Dependências e scripts do projeto
 ┗ 📜 playwright.config.ts  # Configuração global do Playwright
```

### Separação de responsabilidades

- `tests/api`: concentra os cenários automatizados de API.
- `tests/ui`: concentra os cenários E2E da aplicação web.
- `src/pages`: centraliza os Page Objects da aplicação.
- `src/data`: armazena massa de dados parametrizada.
- `src/config`: concentra configurações e variáveis externalizadas.
- `src/support`: mantém helpers e recursos reutilizáveis.
- `k6`: concentra os scripts de performance.
- `.github/workflows`: define a pipeline de CI/CD.

---

## ⚙️ Configuração e Execução Local

### Pré-requisitos

Antes de executar o projeto, certifique-se de possuir os seguintes itens instalados:

- Node.js `v18` ou superior;
- Git;
- k6 CLI, necessário para execução dos testes de performance.

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

> Caso o projeto seja executado sem o arquivo `package-lock.json`, utilize `npm install`.

### 3. Instalar os navegadores do Playwright

```bash
npx playwright install
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como base.

```env
BASE_URL_API=https://jsonplaceholder.typicode.com
BASE_URL_UI=https://www.saucedemo.com
MOCK_URL_ERRORS=https://postman-echo.com/status
USER_UI=standard_user
PASSWORD_UI=secret_sauce
```

---

## ▶️ Executando os Testes

### Executar todos os testes de API e UI

```bash
npx playwright test
```

### Executar apenas os testes de API

```bash
npx playwright test tests/api
```

### Executar apenas os testes de UI

```bash
npx playwright test tests/ui
```

### Executar apenas os testes de UI em modo visível

```bash
npx playwright test tests/ui/sauceDemo.spec.ts --project=chromium --headed
```

### Executar testes de performance

```bash
mkdir -p test-results/k6
k6 run --summary-export test-results/k6/k6-summary.json k6/performance.js
```

Esse comando executa o teste de carga e gera o arquivo `test-results/k6/k6-summary.json`, que pode ser utilizado como evidência técnica da execução de performance.

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
5. execução dos testes funcionais com Playwright;
6. execução dos testes de performance com k6;
7. geração do resumo de performance em `test-results/k6/k6-summary.json`;
8. publicação dos artefatos `playwright-report` e `k6-summary`;
9. exibição do status da execução na própria esteira.

> **⚡ Estratégia de paralelismo**
>
> Os testes funcionais e os testes de performance foram separados em jobs independentes no GitHub Actions. Essa separação permite feedbacks simultâneos, melhora a eficiência da pipeline e evita que uma suíte bloqueie a execução da outra.

### Artefatos da pipeline

Ao final da execução, são disponibilizados os seguintes artefatos para download:

- `playwright-report`: relatório HTML dos testes funcionais de API e UI, permitindo análise detalhada dos cenários executados, falhas e evidências geradas pelo Playwright;
- `k6-summary`: artefato gerado a partir da pasta `test-results/k6`, contendo o arquivo `k6-summary.json` com o resumo técnico da execução dos testes de performance, incluindo métricas de requisições, duração, taxa de falha e validação dos thresholds.

Essa separação garante rastreabilidade tanto da camada funcional quanto da camada de performance, permitindo análise dos resultados sem necessidade de executar o projeto localmente.

---

## 📊 Relatórios e Evidências

Ao final da execução dos testes funcionais, o Playwright gera um relatório HTML com detalhes da execução, incluindo:

- testes executados;
- status de sucesso ou falha;
- tempo de execução;
- evidências para análise;
- rastreabilidade das falhas quando aplicável.

O relatório funcional pode ser acessado localmente com o comando:

```bash
npx playwright show-report
```

Para os testes de performance, o k6 gera um resumo técnico em formato JSON por meio do comando:

```bash
mkdir -p test-results/k6
k6 run --summary-export test-results/k6/k6-summary.json k6/performance.js
```

Esse arquivo registra as principais métricas da execução, como duração das requisições, quantidade de iterações, taxa de falha, checks executados e resultado dos thresholds configurados no script.

Na pipeline, são publicados os seguintes artefatos:

- `playwright-report`: evidência dos testes funcionais de API e UI;
- `k6-summary`: evidência técnica dos testes de performance executados com k6, publicada a partir da pasta `test-results/k6`.

Dessa forma, a esteira mantém evidências separadas e rastreáveis para validação funcional e validação de performance.

---

## 🤖 Uso de Inteligência Artificial (AI Pair Programming)

Neste projeto, a Inteligência Artificial foi adotada estritamente sob a ótica de **Sparring Arquitetural** e **aceleradora de boilerplate**, mantendo a concepção intelectual, a tomada de decisão e a auditoria do código sob responsabilidade humana.

A IA não foi utilizada como mecanismo de geração automática de código pronto, mas como apoio para estressar hipóteses de engenharia, revisar decisões técnicas e aprimorar a clareza da documentação.

### 📌 Como a IA foi utilizada

1. **Validação de padrões de projeto:** discussão teórica sobre a simetria de design entre o front-end, por meio do **Page Object Model (POM)**, e a camada de rede, por meio do **Service Object Model (SOM)**.
2. **Refatoração semântica:** conversão de especificações escritas em BDD imperativo/promissório, como "O sistema deve...", para um padrão declarativo de **Auditoria de Homologação**, como "Validar a busca...".
3. **Revisão de trade-offs:** análise de prós e contras entre manter estruturas de testes aninhadas (*nested*) versus planificadas (*flat*), considerando legibilidade, manutenção e escalabilidade.
4. **Otimização lexical:** apoio na estruturação formal, revisão gramatical e lapidação do Markdown desta documentação.

---

### 💬 Prompts principais de referência

Abaixo estão os principais estímulos (*prompts*) utilizados durante o ciclo de desenvolvimento:

#### Prompt 1: Validação do padrão SOM na camada de serviços

> "Estou implementando uma suíte de testes de API com Playwright e criei uma classe Helper para encapsular a infraestrutura de rede, de modo que a spec chame apenas métodos limpos como `api.createPost()`. Em analogia ao Page Object Model (POM) do Front-end, faz sentido conceituar esse padrão no Back-end como 'Service Object Model' (SOM)? Como posso defender essa escolha arquitetural?"

#### Prompt 2: Refatoração para linguagem de auditoria

> "Meus testes estão escritos no formato tradicional de BDD focado em comportamento, por exemplo: 'Então o sistema deve exibir a vitrine'. Quero refatorar os títulos dos `test.step` para uma linguagem orientada à auditoria de qualidade e carimbo de execução, por exemplo: 'Validar...'. Como podemos reescrever este bloco mantendo a rastreabilidade no log do CI/CD?"

#### Prompt 3: Aplicação do princípio da responsabilidade única (SRP) em massas

> "Possuo um arquivo `testData.json` unificado centralizando as massas de UI e de API. Pensando em escalabilidade para 500 specs e na prevenção de merge conflicts entre times de front-end e back-end trabalhando em paralelo, qual é a estratégia ideal para segregar esse arquivo mantendo a injeção estática do TypeScript?"

---

## 🚀 Melhorias Futuras

Como evolução contínua do projeto, poderiam ser implementadas as seguintes melhorias:

- **Testes de performance avançados:** inclusão de cenários de stress, spike e soak test.
- **Visual Regression Testing:** validação visual com `toHaveScreenshot()` para detectar quebras de layout.
- **Matriz cross-browser:** execução automatizada em Chromium, Firefox e WebKit.
- **Integração com Test Management:** envio dos resultados para Jira/Xray, TestRail ou ferramenta equivalente.
- **Relatórios avançados:** integração com Allure Report ou dashboards executivos.
- **Execução por tags:** separação de suítes por tipo, criticidade ou camada da pirâmide de testes.
- **Relatório visual de performance:** evolução do resumo JSON do k6 para um relatório HTML mais amigável para leitura executiva.
- **Integração com quality gates:** inclusão de critérios mínimos para bloquear merges em caso de falhas críticas.

---

## ✅ Considerações Finais

Este projeto demonstra uma abordagem completa de automação de testes para um cenário técnico sênior, cobrindo API, UI, performance e CI/CD.

As decisões adotadas priorizam estabilidade, clareza, manutenção, rastreabilidade e alinhamento com boas práticas modernas de Quality Engineering.

A solução também demonstra pensamento crítico ao adaptar cenários às limitações de APIs públicas, documentar decisões técnicas e estruturar uma esteira capaz de fornecer feedback rápido sobre qualidade funcional e performance.
