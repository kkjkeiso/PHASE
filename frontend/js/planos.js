/* ================================
   PHASE — planos.js
   Lógica da página de planos: toggle e FAQ
   ================================ */

/* Preços dos planos */
const prices = {
  basic: { monthly: 19, annual: 15 },
  pro:   { monthly: 39, annual: 31 },
  ultra: { monthly: 69, annual: 55 },
};

/* Alterna preços entre mensal e anual */
function toggleBilling() {
  const toggle = document.getElementById('billingToggle');
  if (!toggle) return;

  const isAnnual = toggle.checked;
  const lblM = document.getElementById('lblMonthly');
  const lblA = document.getElementById('lblAnnual');

  if (lblM) lblM.classList.toggle('active', !isAnnual);
  if (lblA) lblA.classList.toggle('active', isAnnual);

  for (const [key, p] of Object.entries(prices)) {
    const val = document.getElementById('val' + key.charAt(0).toUpperCase() + key.slice(1));
    const ann = document.getElementById('annual' + key.charAt(0).toUpperCase() + key.slice(1));
    if (!val) continue;

    if (isAnnual) {
      val.textContent = p.annual;
      if (ann) ann.textContent = 'R$' + (p.annual * 12) + '/ano — economize R$' + ((p.monthly - p.annual) * 12);
    } else {
      val.textContent = p.monthly;
      if (ann) ann.textContent = '';
    }
  }
}

/* Abre/fecha item do FAQ */
function toggleFaq(item) {
  item.classList.toggle('open');
}

/* Inicialização */
document.addEventListener('DOMContentLoaded', () => {
  /* Toggle de billing */
  const toggle = document.getElementById('billingToggle');
  if (toggle) toggle.addEventListener('change', toggleBilling);

  /* FAQ: adiciona click em cada item */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => toggleFaq(item));
  });
});
