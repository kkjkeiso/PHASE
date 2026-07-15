# Plano de Desenvolvimento — PHASE
> **Plataforma Heurística de Avaliação, Suporte e Educação**

Este documento detalha o cronograma datado de atividades para refatoração, simplificação de arquivos e preparação do MVP do projeto PHASE para o V Seminário de Projetos Integradores e II Colóquio de Informática. O objetivo é concluir todo o desenvolvimento até 20 de julho de 2026, reservando o dia 21 de julho de 2026 (dia da viagem) em diante para testes e gravação de mídias de emergência.

---

## 1. Escopo e Objetivos do MVP

* **Bloco 1: Conteúdos Básicos**: Matemática e Português.
* **Bloco 2: Ensino Técnico**: Informática.
* **Bloco 3: SAGE AI**:
  * **Módulo de Chat Real**: Integração funcional com a API do Groq (utilizando o modelo Llama 3.3) intermediada pelo backend Spring Boot.
  * **Módulo de Chat de Demonstração (Simulado)**: Interface interativa simulando fluxo multimodal, logs de execução ("Recuperando dados locais via RAG", "Processando imagem via Llama Vision", "Refinando resposta com Claude") e visualização do raciocínio lógico da IA.

---

## 2. Refatoração Estrutural e Clean Code (Frontend)

Para fins de organização, legibilidade de código para a banca avaliadora e aplicação das melhores práticas de desenvolvimento (Clean Code):
* **Eliminação de Código Duplicado**: Todas as estruturas repetitivas hardcoded em HTML (como o grid estático de disciplinas e as linhas estáticas da tabela de classificação) serão inteiramente reformuladas.
* **Componentização Dinâmica**: Os blocos estáticos duplicados serão substituídos por contêineres limpos preenchidos de forma dinâmica através de loops JavaScript, reduzindo a poluição visual dos arquivos fontes.
* **Padronização de Nomenclatura**: Identificadores de elementos (IDs) e classes CSS customizadas serão renomeados para o idioma português de forma clara e objetiva.

---

## 3. Refatoração e Simplificação do Backend (Spring Boot)

* **Entidades**: Manter apenas as classes `User` (atualizada para persistência de progresso e pontuação) e as classes referentes a mensagens e sessões de chat.
* **Simplificação de Camadas**: Exclusão de classes redundantes e DTOs excessivos, simplificando os fluxos e controladores.
* **Segurança e CORS**: Configuração no Spring Security para chamadas autenticadas do cliente sem bloqueios de CORS.

---

## 4. Refatoração dos Documentos de Conteúdo (JSON)

Para suportar o novo modelo de grid dinâmico e evitar duplicidade de código no HTML:
* **Padronização**: As matérias serão carregadas a partir de arquivos JSON estruturados na pasta /frontend/data/.
* **Criação de Arquivos**:
  - `portugues.json`: Limpeza e simplificação das estruturas atuais.
  - `matematica.json`: Criação com tópicos de matemática básica e cotidiana.
  - `informatica.json`: Criação com tópicos básicos de informática técnica e introdução ao desenvolvimento.

---

## 5. Cronograma Datado (Prazo Limite: 20 de Julho)

### 15 de Julho (Quarta-feira) — Dia 1: Banco de Dados e Entidade de Usuário
* **Objetivo**: Integrar as colunas de pontuação e progresso ao PostgreSQL.
* **Ações**:
  - Adicionar as colunas `pontos` e `quizzesRespondidos` à classe de entidade `User`.
  - Atualizar o controlador de usuário (`UserController`) para incluir e retornar essas métricas no perfil do estudante.
  - Implementar o endpoint `/api/users/ranking` para fornecer a ordenação dos estudantes com base no engajamento (Scoreboard).

### 16 de Julho (Quinta-feira) — Dia 2: Gateway Seguro de IA no Backend
* **Objetivo**: Remover chaves de API expostas no frontend e centralizar chamadas na API do Spring Boot.
* **Ações**:
  - Criar o endpoint `POST /api/sage/ask` no Spring Boot para processar dúvidas com a IA de forma segura.
  - Centralizar chaves da Groq e da Anthropic no arquivo `application.properties` (consumindo variáveis de ambiente locais).
  - Ajustar o frontend para fazer chamadas diretas a este endpoint local passando o cabeçalho de autenticação JWT.

### 17 de Julho (Sexta-feira) — Dia 3: Dinamização de Matérias e Refatoração de Documentos JSON
* **Objetivo**: Limpar o HTML duplicado e consolidar os dados das disciplinas básicas e técnica.
* **Ações**:
  - Criar e organizar as bases de dados nos arquivos `portugues.json`, `matematica.json` e `informatica.json`.
  - Atualizar o frontend para ler e desenhar o grid de matérias dinamicamente com loops JavaScript.
  - Desenvolver o componente do mini-chat flutuante lateral (suporte rápido) para abrir durante a leitura dos tópicos de aula.

### 18 de Julho (Sábado) — Dia 4: Integração dos Quizzes e Sincronização do Dashboard
* **Objetivo**: Persistir os resultados das autoavaliações e exibir dados dinâmicos no painel.
* **Ações**:
  - Implementar o endpoint `/api/quiz/generate` para fornecer as perguntas de cada tópico.
  - Atualizar a lógica do quiz para salvar o progresso e acumular pontos diretamente no banco de dados do usuário logado.
  - Substituir os números fixos do painel (`dashboard.html`) pelas estatísticas reais puxadas do banco de dados.

### 19 de Julho (Domingo) — Dia 5: Interface de Chat Dedicado da SAGE AI
* **Objetivo**: Implementar a UI interativa e o gerenciamento de sessões de chat.
* **Ações**:
  - Desenvolver o design da tela dedicada de chat (`chat-sage.html`) com suporte a histórico lateral.
  - Integrar os controladores de sessões e mensagens do backend para carregar conversas passadas.

### 20 de Julho (Segunda-feira) — Dia 6: O Chat de Demonstração (Mecanismo Gamer)
* **Objetivo**: Finalizar o fluxo simulado interativo para a apresentação presencial.
* **Ações**:
  - Implementar a animação gamer de carregamento (logs simulados, badges dos modelos em processamento e frases de status).
  - Adicionar o bloco de raciocínio passo a passo colapsável (deep thinking).
  - Integrar a síntese de voz (TTS do navegador) na resposta final.

---

## 6. Fase de Homologação e Preparação do Pitch (A partir de 21 de Julho)

Como o desenvolvedor viaja no dia 21 de Julho, o código fonte do MVP estará congelado. As seguintes atividades serão conduzidas a partir desta data:

* **Homologação Local**: Testes de novos fluxos de usuários em computadores distintos utilizando conexão local.
* **Gravação de Emergência**: Captura de vídeos demonstrativos da aplicação funcionando localmente (tela e voz). Isso servirá de contingência caso a infraestrutura de rede ou de internet do evento apresente instabilidade ou falhas durante a banca.
* **Refinamento do Pitch**: Praticar a apresentação focando na proposta de valor da plataforma e na arquitetura técnica limpa implementada.
