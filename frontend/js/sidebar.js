/* ================================
   PHASE — sidebar.js
   Gera a sidebar dinamicamente em todas as páginas
   Ícones: Font Awesome (original PHASE)
   Estilo: SAGE AI (colapsável com hover)
   ================================ */

/* Detecta a página atual pelo nome do arquivo */
function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || '';
  return file.replace('.html', '');
}

/* Gera o HTML da sidebar e injeta no container */
function buildSidebar() {
  const container = document.getElementById('sidebar');
  if (!container) return;

  const page = getCurrentPage();

  /* Helper: retorna 'active' se a página atual é a indicada */
  const isActive = (p) => page === p ? 'active' : '';

  container.innerHTML = `
    <!-- Topo: Logo PHASE -->
    <div class="sidebar__top-action">
      <a href="../../index.html" class="sidebar__branding" title="Página Inicial">
        <span class="logo__text">PHA</span><span class="logo__ai">SE</span>
      </a>
    </div>

    <!-- Navegação principal -->
    <nav class="sidebar__nav">
      <div class="sidebar__label">Menu</div>

      <!-- Home / Dashboard -->
      <a href="dashboard.html" class="sidebar__link ${isActive('dashboard')}" data-label="Home">
        <i class="fa-solid fa-house"></i>
        <span class="truncate">Dashboard</span>
      </a>

      <!-- Scoreboard -->
      <a href="scoreboard.html" class="sidebar__link ${isActive('scoreboard')}" data-label="Scoreboard">
        <i class="fa-solid fa-ranking-star"></i>
        <span class="truncate">Scoreboard</span>
      </a>

      <!-- PHASES / Módulo ENEM -->
      <a href="enem.html" class="sidebar__link ${isActive('enem')}" data-label="PHASES">
        <i class="fa-solid fa-layer-group"></i>
        <span class="truncate">PHASES</span>
      </a>

      <!-- Matérias (submenu expansível) -->
      <a href="#" class="sidebar__link nav-expandable ${page === 'materia' ? 'active' : ''}" data-label="Matérias" id="btnMaterias">
        <i class="fa-solid fa-book-open"></i>
        <span class="truncate">Matérias</span>
        <i class="fa-solid fa-chevron-down nav-chevron"></i>
      </a>

      <!-- Submenu de matérias -->
      <div class="nav-submenu" id="materiasSubmenu">
        <a href="enem.html?s=portugues"  class="sidebar__sublink" data-label="Português"><i class="fa-solid fa-book"></i> <span>Português</span></a>
        <a href="enem.html?s=redacao"    class="sidebar__sublink" data-label="Redação"><i class="fa-solid fa-pen-nib"></i> <span>Redação</span></a>
        <a href="enem.html?s=matematica" class="sidebar__sublink" data-label="Matemática"><i class="fa-solid fa-square-root-variable"></i> <span>Matemática</span></a>
        <a href="enem.html?s=biologia"   class="sidebar__sublink" data-label="Biologia"><i class="fa-solid fa-leaf"></i> <span>Biologia</span></a>
        <a href="enem.html?s=quimica"    class="sidebar__sublink" data-label="Química"><i class="fa-solid fa-flask"></i> <span>Química</span></a>
        <a href="enem.html?s=fisica"     class="sidebar__sublink" data-label="Física"><i class="fa-solid fa-atom"></i> <span>Física</span></a>
        <a href="enem.html?s=historia"   class="sidebar__sublink" data-label="História"><i class="fa-solid fa-landmark"></i> <span>História</span></a>
        <a href="enem.html?s=geografia"  class="sidebar__sublink" data-label="Geografia"><i class="fa-solid fa-earth-americas"></i> <span>Geografia</span></a>
        <a href="enem.html?s=ingles"     class="sidebar__sublink" data-label="Inglês"><i class="fa-solid fa-language"></i> <span>Inglês</span></a>
      </div>

      <div class="sidebar__label" style="margin-top: 12px;">Plataforma</div>

      <!-- Chat IA -->
      <a href="chat.html" class="sidebar__link ${isActive('chat')}" data-label="Chat IA">
        <i class="fa-solid fa-robot"></i>
        <span class="truncate">Chat IA</span>
      </a>

      <!-- Planos -->
      <a href="planos.html" class="sidebar__link ${isActive('planos')}" data-label="Planos">
        <i class="fa-solid fa-crown"></i>
        <span class="truncate">Planos</span>
      </a>

      <!-- Perfil (visível apenas quando logado via CSS) -->
      <a href="perfil.html" class="sidebar__link ${isActive('perfil')}" data-label="Perfil">
        <i class="fa-solid fa-user"></i>
        <span class="truncate">Meu Perfil</span>
      </a>
    </nav>

    <!-- Versão + Footer -->
    <div class="sidebar__footer">

      <!-- Branding no footer (guest) -->
      <a href="../../index.html" class="sidebar__branding" id="sidebarBranding">
        <span class="logo__text">PHA</span><span class="logo__ai">SE</span>
      </a>

      <!-- Estado Guest -->
      <div class="sidebar__guest" id="sidebarGuest">
        <div class="guest-icon" title="Visitante">
          <i class="fa-solid fa-user" style="font-size: 14px;"></i>
        </div>
        <div class="guest-actions">
          <a href="login.html" class="btn btn--ghost btn--sm">Entrar</a>
          <a href="register.html" class="btn btn--primary btn--sm">Criar conta</a>
        </div>
      </div>

      <!-- Estado Logado -->
      <div class="sidebar__user" id="sidebarUser" title="Abrir Perfil">
        <div class="user-avatar" id="userAvatar">
          <i class="fa-solid fa-user" style="font-size: 13px;"></i>
        </div>
        <div class="user-info">
          <span class="user-name" id="userNameDisplay">Usuário</span>
          <span class="user-email" id="userEmailDisplay"></span>
        </div>
      </div>
    </div>
  `;

  /* Submenu expansível de matérias */
  initSubmenu();
}

/* Inicializa o submenu expansível de matérias */
function initSubmenu() {
  const btn = document.getElementById('btnMaterias');
  const submenu = document.getElementById('materiasSubmenu');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !submenu) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = submenu.classList.contains('open');
    submenu.classList.toggle('open', !isOpen);
    btn.classList.toggle('open', !isOpen);
    /* Mantém sidebar expandida enquanto submenu aberto */
    if (sidebar && !isOpen) sidebar.classList.remove('collapsed');
  });
}

/* Executa ao carregar */
document.addEventListener('DOMContentLoaded', buildSidebar);
