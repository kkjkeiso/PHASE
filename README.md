# PHASE
> Plataforma Heurística de Avaliação, Suporte e Educação

---

### Sobre o Projeto

O **PHASE** é uma plataforma educacional responsiva concebida para modernizar e direcionar o ensino de estudantes de todas as idades. O projeto combina trilhas de estudo tradicionais com o suporte contínuo de inteligência artificial generativa, adaptando-se ao ritmo de cada estudante.

Este projeto foi idealizado e desenvolvido inteiramente por **Keyrrison Vinícius** no âmbito da **Escola Estadual Professor Antônio Dantas**.

---

### Recursos Principais

- **Trilhas de Estudo**: Conteúdos estruturados para Ensino Fundamental, Ensino Médio, Vestibulares e um bloco separado para Cursos Técnicos.
- **SAGE AI**: Tutor particular inteligente integrado ao chat para tirar dúvidas e explicar matérias passo a passo.
- **Suporte Multimodal**: Reconhecimento de voz (transcrição de áudio) e envio de imagens (visão computacional) para resolver questões.
- **Quizzes Dinâmicos**: Autoavaliação interativa gerada para testar o aprendizado do aluno em tempo real.
- **Gamificação**: Painel de progresso e ranking (Scoreboard) para incentivar a constância nos estudos.

---

### Tecnologias Utilizadas

- **Front-end**: HTML5, CSS3 e JavaScript (puros, sem frameworks)
- **Back-end**: Java com Spring Boot
- **Banco de Dados**: PostgreSQL
- **Integração de IA**: APIs da Groq (modelos Llama e Whisper) e Anthropic (Claude)

---

### Como Executar

#### 1. Configurações Iniciais
- **Java JDK** (versão 25 recomendada).
- **PostgreSQL** instalado e ativo.
- Variáveis de ambiente configuradas no terminal do back-end:
    * `GROQ_API_KEY` (Chave de API do serviço de IA).
    * `JWT_SECRET` (Chave de segurança de tokens de sessão).

#### 2. Inicialização do Back-end
* Crie o banco de dados chamado `phase` no PostgreSQL.
* Navegue até a pasta `backend/` e execute:
  ```bash
  ./mvnw spring-boot:run
  ```

#### 3. Inicialização do Front-end
* Abra o arquivo `index.html` diretamente no seu navegador, ou sirva a pasta com um servidor local básico.

---

### Autor e Desenvolvedor

- **Keyrrison Vinícius de Freitas Costa** (Idealizador e Desenvolvedor Único)

---

### Licença

Este projeto é de propriedade intelectual de seu desenvolvedor. Para mais detalhes sobre as permissões de uso, consulte o arquivo [LICENSE](LICENSE).


> Aprenda no seu ritmo. Evolua com PHASE.
