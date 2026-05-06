/* ================================
   PHASE — app.js
   Lógica compartilhada de todas as páginas da plataforma
   ================================ */

/* ================================
   SIDEBAR COLAPSÁVEL
   Expande ao hover, colapsa ao sair (desktop)
   ================================ */
function initSidebarCollapse() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  /* Inicia colapsada em telas grandes */
  if (window.innerWidth > 768) sidebar.classList.add('collapsed');

  /* Expande ao passar o mouse */
  sidebar.addEventListener('mouseenter', () => {
    if (window.innerWidth > 768) sidebar.classList.remove('collapsed');
  });

  /* Colapsa ao retirar o mouse (fecha submenu também) */
  sidebar.addEventListener('mouseleave', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.add('collapsed');
      const submenu = document.getElementById('materiasSubmenu');
      const btn = document.getElementById('btnMaterias');
      if (submenu) submenu.classList.remove('open');
      if (btn) btn.classList.remove('open');
    }
  });
}

/* ================================
   DADOS DO USUÁRIO NA SIDEBAR
   Preenche avatar, nome e email com dados do Auth
   ================================ */
function initUserDisplay() {
  const user = Auth.getUser();
  if (!user) return;

  /* Atualiza sidebar */
  const nameDisplay  = document.getElementById('userNameDisplay');
  const emailDisplay = document.getElementById('userEmailDisplay');
  const avatarDisplay = document.getElementById('userAvatar');

  if (nameDisplay) nameDisplay.textContent = user.displayName || user.name || 'Estudante';
  if (emailDisplay) emailDisplay.textContent = user.email || '';
  if (avatarDisplay && user.name) avatarDisplay.textContent = user.name.charAt(0).toUpperCase();

  /* Atualiza página de perfil (se estiver nela) */
  const profileName     = document.getElementById('profileName');
  const profileEmail    = document.getElementById('profileEmail');
  const profileUsername = document.getElementById('profileUsername');
  const profileAvatar   = document.getElementById('profileAvatar');

  if (profileName)     profileName.textContent     = user.displayName || user.name || 'Estudante';
  if (profileEmail)    profileEmail.textContent    = user.email || '';
  if (profileUsername) profileUsername.textContent = '@' + (user.username || 'user');
  if (profileAvatar && user.name) profileAvatar.textContent = user.name.charAt(0).toUpperCase();
}

/* ================================
   LOGOUT
   Limpa sessão e redireciona para landing
   ================================ */
function initLogout() {
  const btnLogout = document.getElementById('btnLogout');
  if (!btnLogout) return;

  btnLogout.addEventListener('click', () => {
    Auth.clear();
    window.location.href = '../../index.html';
  });
}

/* ================================
   FAB (Floating Action Button)
   Redireciona para a página de Chat IA
   ================================ */
function initFab() {
  const fab = document.getElementById('fabChat');
  if (!fab) return;

  fab.addEventListener('click', () => {
    window.location.href = 'chat.html';
  });
}

/* ================================
   SIDEBAR USER → PERFIL
   Clica no avatar logado para ir ao perfil
   ================================ */
function initUserProfileClick() {
  const sidebarUser = document.getElementById('sidebarUser');
  if (!sidebarUser) return;

  sidebarUser.addEventListener('click', () => {
    window.location.href = 'perfil.html';
  });
}

/* ================================
   REVEAL INICIAL
   Anima os elementos .reveal da página ao carregar
   ================================ */
function initRevealOnLoad() {
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
  }, 100);
}

/* ================================
   INICIALIZAÇÃO
   Executa todas as funções de setup ao carregar
   ================================ */
document.addEventListener('DOMContentLoaded', () => {
  initSidebarCollapse();
  initUserDisplay();
  initLogout();
  initFab();
  initUserProfileClick();
  initRevealOnLoad();
});
