/* ================================
   PHASE — early-auth.js
   Executa ANTES da renderização para definir
   o atributo data-auth e evitar flash de conteúdo.
   ================================ */
(function () {
  var token = localStorage.getItem('phase_token') || sessionStorage.getItem('phase_token');
  document.documentElement.setAttribute('data-auth', token ? 'true' : 'false');
})();
