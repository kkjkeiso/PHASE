# Plano de Desenvolvimento — PHASE
> **Plataforma Heurística de Avaliação, Suporte e Educação**

Este documento detalha o plano de desenvolvimento e refatoração de sete dias para a plataforma PHASE, visando a sua consolidação e preparação para apresentação no V Seminário de Projetos Integradores e II Colóquio de Informática.

---

## 1. Escopo e Objetivos do MVP

Para otimizar o tempo disponível (estimado em 3 a 4 horas diárias), o escopo de conteúdos será delimitado e focado nas seguintes áreas:

* **Bloco 1: Conteúdos Básicos**: Disciplinas de Matemática e Português.
* **Bloco 2: Ensino Técnico**: Disciplina de Informática.
* **Bloco 3: SAGE AI**:
  * **Módulo de Chat Real**: Integração funcional com a API do Groq (utilizando o modelo Llama 3.3) intermediada pelo backend Spring Boot.
  * **Módulo de Chat de Demonstração (Simulado)**: Interface interativa que simula o fluxo completo da plataforma. Apresentará logs de execução detalhados, exibição de ícones dos modelos processando (Llama, Claude, Whisper), mensagens de status do sistema ("Recuperando dados locais via RAG", "Processando imagem via Llama Vision", "Refinando resposta com Claude") e a visualização do processo de raciocínio lógico (bloco de pensamento estilo deep thinking).

---

## 2. Refatoração e Simplificação do Backend (Spring Boot)

O backend em Spring Boot passará por uma reestruturação para simplificar sua manutenção, reduzir acoplamentos desnecessários e tornar a arquitetura clara para apresentação técnica:
1. **Estrutura de Entidades**: Manutenção exclusiva das classes essenciais, especificamente `User` (atualizada para persistência de progresso) e as classes referentes a mensagens e sessões de chat.
2. **Simplificação de Camadas**: Redução de classes auxiliares e DTOs redundantes, priorizando estruturas diretas e tipos primitivos/Records quando aplicável.
3. **Gerenciamento de Segurança**: Padronização da segurança das rotas e das configurações de CORS no Spring Security para garantir chamadas de API seguras originadas do frontend local.

---

## 3. Cronograma de Atividades (Planejamento Diário)

### Dia 1: Ajuste de Entidades e Persistência de Dados do Usuário
* **Objetivo**: Integrar as colunas de pontuação e progresso ao banco de dados relacional.
* **Ações**:
  - Adicionar as colunas `pontos` e `quizzesRespondidos` à classe de entidade `User`.
  - Atualizar o controlador de usuário (`UserController`) para incluir e retornar essas métricas.
  - Implementar o endpoint `/api/users/ranking` para fornecer a ordenação dos estudantes com base no engajamento (Scoreboard).

### Dia 2: Proxy Seguro de IA no Servidor
* **Objetivo**: Eliminar requisições externas diretas do navegador do cliente e centralizar o consumo das APIs de IA no backend.
* **Ações**:
  - Criar o endpoint `POST /api/sage/ask` no Spring Boot.
  - Transferir as chaves de API e a lógica de comunicação externa para o backend, protegendo as credenciais de acesso.
  - Atualizar as chaves criptográficas de sessão (JWT) para as chamadas autenticadas do cliente.

### Dia 3: Dinamização de Matérias e Interface de Aula
* **Objetivo**: Otimizar a estrutura do frontend através de carregamentos dinâmicos e inclusão do mini-chat de suporte.
* **Ações**:
  - Centralizar as informações das disciplinas (Matemática, Português e Informática) em um arquivo de dados estruturado no frontend.
  - Renderizar o grid de seleção de matérias de forma dinâmica utilizando loops no JavaScript, eliminando códigos HTML redundantes.
  - Desenvolver o componente de mini-chat flutuante integrado na tela de leitura da aula para permitir consultas rápidas sobre o tópico atual.

### Dia 4: Integração de Quizzes e Atualização de Progresso
* **Objetivo**: Conectar as atividades pedagógicas ao sistema de recompensas do banco de dados.
* **Ações**:
  - Implementar o endpoint `/api/quiz/generate` no backend para entrega de questionários específicos de cada tópico.
  - Criar a lógica de recompensa que incrementa a pontuação no perfil do banco de dados após a conclusão das atividades.
  - Sincronizar os componentes visuais do painel de controle (Dashboard) com os dados persistidos no PostgreSQL.

### Dia 5: Interface Dedicada de Chat da SAGE AI
* **Objetivo**: Finalizar o layout e o gerenciamento de sessões na tela principal de suporte.
* **Ações**:
  - Desenvolver o layout da página dedicada de chat com suporte a histórico de conversas.
  - Integrar os endpoints de listagem e criação de sessões existentes do backend na interface do usuário.

### Dia 6: Implementação do Chat de Demonstração (Mecanismo Simulado)
* **Objetivo**: Desenvolver o fluxo visual e interativo de simulação multimodal para a banca examinadora.
* **Ações**:
  - Criar o componente de carregamento sequencial simulando análise de imagem, busca RAG de referências locais e processamento por múltiplos modelos.
  - Adicionar o bloco visual de raciocínio passo a passo (processo de pensamento da IA).
  - Incorporar a síntese de voz local (conversão de texto em áudio via navegador) para a resposta final demonstrada.

### Dia 7: Testes Integrados, Homologação e Preparação do Roteiro
* **Objetivo**: Garantir a estabilidade da aplicação local e estruturar a demonstração.
* **Ações**:
  - Executar testes de ponta a ponta simulando novos cadastros, logins e progressões.
  - Revisar a semântica do código, padronizando os identificadores em português.
  - Praticar o roteiro de execução do MVP para a banca avaliadora.
