/* ================================
   PHASE — scoreboard.js
   Lógica da página de ranking e progresso
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.getUser();
  const loggedOut = document.getElementById('progressLoggedOut');
  const content   = document.getElementById('progressContent');

  if (!user || !loggedOut || !content) return;

  /* Usuário logado: exibe progresso via classes CSS */
  loggedOut.classList.add('progress-content--hidden');
  content.classList.remove('progress-content--hidden');

  /* Preenche avatar e nome */
  const avatar = document.getElementById('progressAvatar');
  const uname  = document.getElementById('progressUsername');
  const ptsLabel = document.getElementById('progressPtsLabel');

  if (avatar && user.name) avatar.textContent = user.name.charAt(0).toUpperCase();
  if (uname) uname.textContent = user.displayName || user.name || 'Estudante';

  /* Stats locais */
  const pts = parseInt(localStorage.getItem('phase1_points') || '0');
  const quiz = parseInt(localStorage.getItem('phase1_quizzes') || '0');

  if (ptsLabel) ptsLabel.textContent = pts + ' pontos acumulados';

  /* Status da PHASE 1 */
  const statusEl = document.getElementById('phase1Status');
  if (statusEl) {
    statusEl.textContent = (pts > 0 || quiz > 0)
      ? pts + ' pts · ' + quiz + ' quest.'
      : 'Não iniciado';
  }
});
