// ============================================================
// nav.ts — Navegação global do PHASE
// Plataforma Heurística de Avaliação, Suporte e Educação
//
// Responsabilidades:
//   - Injetar a sidebar e a top bar em todas as páginas
//   - Detectar páginas de auth e exibir top bar mínima
//   - Gerenciar estado de sessão (login / logout)
//   - Expandir/recolher o submenu de matérias
//   - Destacar o item ativo conforme a página atual
//
// Compilar com: tsc
// Saída:        js/nav.js
// ============================================================

interface NavSession {
  username: string;
  token:    string;
}

// Calcula profundidade do path para montar caminhos relativos
const depth:      number = window.location.pathname.split('/').filter(Boolean).length;
const base:       string = depth <= 5 ? './'        : '../';
const phasesBase: string = depth <= 5 ? './phases/' : './';

// ── Detecta páginas de autenticação (sem sidebar) ────────────
const authPages: string[] = ['login.html', 'register.html'];
const isAuthPage: boolean = authPages.some(p => window.location.pathname.endsWith(p));

// Em páginas de auth sem usuário logado, injeta apenas a top bar mínima
if (isAuthPage && !localStorage.getItem('usuarioLogado')) {

  document.body.insertAdjacentHTML('afterbegin', `
    <div class="top-bar top-bar--auth">
      <a href="${base}welcome.html" class="logo">
        <span class="logo-text">PHASE</span>
      </a>
      <a href="${base}welcome.html" class="btn btn-login">
        <i class="fa-solid fa-arrow-left"></i> Voltar
      </a>
    </div>
  `);

  document.body.classList.add('no-sidebar');

} else {

  // ── Sidebar + Top Bar completas ──────────────────────────
  document.body.insertAdjacentHTML('afterbegin', `
    <aside id="sidebar">
      <nav id="nav-icons">

        <!-- Home -->
        <a href="${base}index.html" class="nav-item" data-label="Home">
          <i class="fa-solid fa-house"></i>
        </a>

        <!-- Scoreboard -->
        <a href="${base}scoreboard.html" class="nav-item" data-label="Scoreboard">
          <i class="fa-solid fa-ranking-star"></i>
        </a>

        <!-- PHASES hub -->
        <a href="${base}phases.html" class="nav-item" data-label="PHASES">
          <i class="fa-solid fa-layer-group"></i>
        </a>

        <!-- Matérias (submenu expansível) -->
        <a href="#" class="nav-item nav-phases nav-expandable" data-label="Matérias">
          <i class="fa-solid fa-book-open"></i>
          <i class="fa-solid fa-chevron-down nav-chevron"></i>
        </a>

        <!-- Submenu de matérias -->
        <div class="nav-submenu" id="phases-submenu">
          <a href="${phasesBase}phase1.html?s=portugues"  class="nav-subitem" data-label="Português"><i class="fa-solid fa-book"></i></a>
          <a href="${phasesBase}phase1.html?s=redacao"    class="nav-subitem" data-label="Redação"><i class="fa-solid fa-pen-nib"></i></a>
          <a href="${phasesBase}phase1.html?s=matematica" class="nav-subitem" data-label="Matemática"><i class="fa-solid fa-square-root-variable"></i></a>
          <a href="${phasesBase}phase1.html?s=biologia"   class="nav-subitem" data-label="Biologia"><i class="fa-solid fa-leaf"></i></a>
          <a href="${phasesBase}phase1.html?s=quimica"    class="nav-subitem" data-label="Química"><i class="fa-solid fa-flask"></i></a>
          <a href="${phasesBase}phase1.html?s=fisica"     class="nav-subitem" data-label="Física"><i class="fa-solid fa-atom"></i></a>
          <a href="${phasesBase}phase1.html?s=historia"   class="nav-subitem" data-label="História"><i class="fa-solid fa-landmark"></i></a>
          <a href="${phasesBase}phase1.html?s=geografia"  class="nav-subitem" data-label="Geografia"><i class="fa-solid fa-earth-americas"></i></a>
          <a href="${phasesBase}phase1.html?s=ingles"     class="nav-subitem" data-label="Inglês"><i class="fa-solid fa-language"></i></a>
        </div>

        <!-- Perfil (só aparece logado) -->
        <a href="${base}account.html" class="nav-item nav-profile" data-label="Perfil">
          <i class="fa-solid fa-user"></i>
        </a>

      </nav>
      <div class="sidebar-version">v1.0</div>
    </aside>

    <div class="top-bar">
      <a href="${base}index.html" class="logo">
        <span class="logo-text">PH<span>A</span>SE</span>
      </a>
      <div class="top-bar-actions" id="top-actions"></div>
    </div>
  `);

  // ── Gerenciamento de sessão ────────────────────────────────

  function getSession(): NavSession | null {
    const username: string | null = localStorage.getItem('usuarioLogado');
    const token:    string | null = localStorage.getItem('token');
    if (username && token) return { username, token };
    return null;
  }

  /** Renderiza a top bar para usuário logado */
  function renderLoggedIn(username: string): void {
    const topActions:  HTMLElement | null = document.getElementById('top-actions');
    const profileItem: HTMLElement | null = document.querySelector('.nav-profile');
    if (!topActions) return;

    topActions.innerHTML = `
      <span class="topbar-greeting">Olá, ${username}</span>
      <button class="btn btn-logout" id="logout-btn">Sair</button>
    `;

    document.getElementById('logout-btn')?.addEventListener('click', (): void => {
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('token');
      window.location.href = base + 'welcome.html';
    });

    // Exibe o item de perfil na sidebar
    if (profileItem instanceof HTMLElement) profileItem.style.display = 'flex';
  }

  /** Renderiza a top bar para usuário deslogado */
  function renderLoggedOut(): void {
    const topActions:  HTMLElement | null = document.getElementById('top-actions');
    const profileItem: HTMLElement | null = document.querySelector('.nav-profile');
    if (!topActions) return;

    topActions.innerHTML = `
      <a href="${base}login.html"    class="btn btn-login">Login</a>
      <a href="${base}register.html" class="btn btn-register">Cadastrar-se</a>
    `;

    // Oculta o item de perfil quando não há sessão
    if (profileItem instanceof HTMLElement) profileItem.style.display = 'none';
  }

  const session: NavSession | null = getSession();
  if (session) { renderLoggedIn(session.username); }
  else         { renderLoggedOut(); }

  // ── Submenu de matérias (expansível) ──────────────────────

  const expandable: HTMLElement | null = document.querySelector('.nav-expandable');
  const submenu:    HTMLElement | null = document.getElementById('phases-submenu');
  const sidebar:    HTMLElement | null = document.getElementById('sidebar');

  expandable?.addEventListener('click', (e: Event): void => {
    e.preventDefault();
    const isOpen: boolean = submenu?.classList.contains('open') ?? false;
    submenu?.classList.toggle('open',     !isOpen);
    expandable.classList.toggle('open',   !isOpen);
    sidebar?.classList.toggle('expanded', !isOpen);
  });

  // ── Destaque do item ativo ─────────────────────────────────
  // Marca como "active" o item cuja href inclui o nome da página atual
  const currentPage: string = window.location.pathname.split('/').pop() ?? '';

  document.querySelectorAll<HTMLAnchorElement>('.nav-item').forEach((item): void => {
    const href: string = item.getAttribute('href') ?? '';
    if (href !== '#' && currentPage !== '' && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });

} // fim do bloco principal (auth check)
