/* ================================
   PHASE — landing.js
   Animação do mockup, tabs de metodologia e auth-aware buttons
   ================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* Inicializa animações de reveal por scroll e comportamento da navbar */
  initReveal();
  initNav();

  /* ================================
     TABS DE METODOLOGIA
     Alterna entre painéis (Aulas, Quiz, PHASES, Revisão)
     ================================ */
  const tabs = document.querySelectorAll('.metodo__tab');
  const panels = document.querySelectorAll('.metodo__panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ================================
     AUTH-AWARE BUTTONS
     Troca botões de login/registro por atalhos quando logado
     ================================ */
  const loggedIn = Auth.isLoggedIn();
  const user = Auth.getUser();
  const dashUrl = 'frontend/html/dashboard.html';

  if (loggedIn) {
    /* Navbar */
    const navAuth = document.getElementById('navAuthBtns');
    if (navAuth) {
      navAuth.innerHTML = `
        <a href="${dashUrl}" class="btn btn--primary btn--sm">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> Acessar plataforma
        </a>`;
    }

    /* Hero */
    const heroAuth = document.getElementById('heroAuthBtns');
    if (heroAuth) {
      heroAuth.innerHTML = `
        <a href="${dashUrl}" class="btn btn--primary">
          <i class="fa-solid fa-rocket"></i> Continuar estudando
        </a>
        <a href="frontend/html/planos.html" class="btn btn--ghost">
          <i class="fa-solid fa-crown"></i> Ver planos
        </a>`;
    }

    /* CTA final */
    const ctaAuth = document.getElementById('ctaAuthBtns');
    if (ctaAuth) {
      ctaAuth.innerHTML = `
        <a href="${dashUrl}" class="btn btn--primary">
          <i class="fa-solid fa-layer-group"></i> Prosseguir para minhas PHASES
        </a>
        <a href="frontend/html/planos.html" class="btn btn--ghost">
          <i class="fa-solid fa-crown"></i> Ver planos
        </a>`;
    }
  }

  /* ================================
     MOCK SCENARIOS — PHASE (educação)
     Cada cenário simula uma interação real da plataforma
     ================================ */
  const chatScenarios = [
    [
      { type: 'user', text: 'Qual é a diferença entre "mas" e "mais"?' },
      { type: 'phase', text: '<b>Mas</b> = conjunção adversativa (porém).<br><br><b>Mais</b> = advérbio de intensidade (adição).<br><br>Ex: "Estudei muito, <em>mas</em> preciso de <em>mais</em> prática."' },
    ]
  ];

  /* Renderiza um cenário no mockup com delay escalonado */
  function runScenario(scenarioIndex) {
    const body = document.getElementById('mockupBody');
    if (!body) return;

    body.innerHTML = '';
    const scenario = chatScenarios[scenarioIndex];

    scenario.forEach((msg, i) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = `msg msg--${msg.type}`;
        el.innerHTML = `${msg.text}<span class="msg__time">${now()}</span>`;
        body.appendChild(el);

        /* Força reflow antes de adicionar .visible para garantir a transição CSS */
        requestAnimationFrame(() => el.classList.add('visible'));
        body.scrollTop = body.scrollHeight;
      }, 600 + i * 2200);
    });
  }

  let currScenario = 0;
  runScenario(currScenario);

  /* A cada 8s faz fade out e carrega o próximo cenário */
  setInterval(() => {
    const body = document.getElementById('mockupBody');
    if (!body) return;

    Array.from(body.children).forEach(child => child.style.opacity = '0');

    setTimeout(() => {
      currScenario = (currScenario + 1) % chatScenarios.length;
      runScenario(currScenario);
    }, 400);
  }, 8000);

});
