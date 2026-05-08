// Map of subjects
const MATERIAS = {
  portugues:      { label: 'Português',       icon: 'fa-book',                 dataFile: 'portugues' },
  redacao:        { label: 'Redação',          icon: 'fa-pen-nib',              dataFile: null },
  literatura:     { label: 'Literatura',       icon: 'fa-book-open',            dataFile: null },
  ingles:         { label: 'Inglês',           icon: 'fa-language',             dataFile: null },
  espanhol:       { label: 'Espanhol',         icon: 'fa-globe',                dataFile: null },
  artes:          { label: 'Artes',            icon: 'fa-palette',              dataFile: null },
  educacaofisica: { label: 'Educação Física',  icon: 'fa-dumbbell',             dataFile: null },
  matematica:     { label: 'Matemática',       icon: 'fa-calculator',           dataFile: null },
  biologia:       { label: 'Biologia',         icon: 'fa-leaf',                 dataFile: null },
  quimica:        { label: 'Química',          icon: 'fa-flask',                dataFile: null },
  fisica:         { label: 'Física',           icon: 'fa-atom',                 dataFile: null },
  historia:       { label: 'História',         icon: 'fa-landmark',             dataFile: null },
  geografia:      { label: 'Geografia',        icon: 'fa-earth-americas',       dataFile: null },
  filosofia:      { label: 'Filosofia',        icon: 'fa-scale-balanced',       dataFile: null },
  sociologia:     { label: 'Sociologia',       icon: 'fa-users',                dataFile: null },
};

let SUBJECT_DATA = null;
let ACTIVE_TOPIC = null;
let SUBJECT_KEY  = '';

document.addEventListener('DOMContentLoaded', async () => {
  // Check URL on initial load
  checkUrlAndRender();

  // Intercept link clicks to avoid file:// reload issues
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href') && link.getAttribute('href').includes('enem.html?s=')) {
      if (window.location.pathname.endsWith('enem.html')) {
        e.preventDefault();
        const href = link.getAttribute('href');
        const s = new URLSearchParams(href.split('?')[1]).get('s');
        try {
          window.history.pushState({ s }, '', href);
        } catch (err) {
          console.warn('pushState failed, proceeding anyway:', err);
        }
        checkUrlAndRender(s);
      }
    }
  });

  // Handle back button
  window.addEventListener('popstate', () => {
    checkUrlAndRender();
  });
});

async function checkUrlAndRender(overrideKey) {
  const params = new URLSearchParams(window.location.search);
  SUBJECT_KEY = overrideKey || params.get('s');

  const gridView = document.getElementById('enem-grid');
  const subjectView = document.getElementById('subject-view');

  if (SUBJECT_KEY && MATERIAS[SUBJECT_KEY]) {
    // Hide grid and show subject view
    if(gridView) gridView.style.display = 'none';
    if(subjectView) subjectView.style.display = 'block';

    const info = MATERIAS[SUBJECT_KEY];
    document.title = 'PHASE | ' + info.label;

    if (info.dataFile) {
      try {
        const res = await fetch('../data/' + info.dataFile + '.json');
        if (!res.ok) throw new Error('not found');
        SUBJECT_DATA = await res.json();
      } catch (e) {
        console.warn('JSON não encontrado para', info.dataFile);
      }
    } else {
      SUBJECT_DATA = null;
    }

    renderPage(info, subjectView);
  } else {
    // Show grid and hide subject view
    if(gridView) gridView.style.display = 'block';
    if(subjectView) subjectView.style.display = 'none';
    document.title = 'PHASE | PHASES';
  }
}

function renderPage(info, root) {
  root.innerHTML = `
    <div class="phase-stack-page">
      <!-- Breadcrumb -->
      <nav class="phase-breadcrumb">
        <a href="dashboard.html">PHASES</a>
        <i class="fa-solid fa-chevron-right"></i>
        <a href="enem.html">PHASE 1 — ENEM</a>
        <i class="fa-solid fa-chevron-right"></i>
        <span style="color:var(--text);">${info.label}</span>
      </nav>

      <!-- Hero da matéria -->
      <div class="hero-card">
        <div class="subject-header">
          <div class="subject-header-left">
            <span class="subject-badge">
              <i class="fa-solid ${info.icon}"></i> PHASE 1 — ENEM
            </span>
            <h1 class="subject-main-title">${info.label}</h1>
            ${
              SUBJECT_DATA
                ? `<p class="hero-sub" style="max-width:520px; margin-top:8px;">${SUBJECT_DATA.description || ''}</p>`
                : `<p class="hero-sub" style="max-width:520px; margin-top:8px;">Conteúdo em desenvolvimento. Em breve disponível!</p>`
            }
          </div>
          <span class="phase-score-badge" id="score-badge">
            <i class="fa-solid fa-star"></i>
            <span id="score-val">${localStorage.getItem('phase1_points') || '0'}</span> pts
          </span>
        </div>

        ${SUBJECT_DATA && SUBJECT_DATA.topics ? `
          <div class="topic-scroller" style="margin-top:24px;">
            <div class="subject-nav">
              ${SUBJECT_DATA.topics.map((t, i) => `
                <button class="subject-pill ${i === 0 ? 'active' : ''}"
                        onclick="selectTopic('${t.id}')"
                        data-topic="${t.id}">
                  ${t.name}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div id="content-area">
        ${
          SUBJECT_DATA && SUBJECT_DATA.topics && SUBJECT_DATA.topics.length > 0
            ? '' // preenchido por selectTopic()
            : renderNoContent()
        }
      </div>
    </div>
  `;

  if (SUBJECT_DATA && SUBJECT_DATA.topics && SUBJECT_DATA.topics.length > 0) {
    selectTopic(SUBJECT_DATA.topics[0].id);
  }
}

window.selectTopic = function(topicId) {
  if (!SUBJECT_DATA) return;
  const topic = SUBJECT_DATA.topics.find(t => t.id === topicId);
  if (!topic) return;
  ACTIVE_TOPIC = topic;

  document.querySelectorAll('.subject-pill').forEach(pill => {
    if(pill.dataset.topic === topicId) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  document.getElementById('content-area').innerHTML = renderTopicContent(topic);
}

function renderTopicContent(topic) {
  return `
    <div class="content-animate" style="display:flex; flex-direction:column; gap:24px;">
      <div class="card">
        <p class="section-label">
          <i class="fa-brands fa-youtube" style="color:#ff4444;"></i> Videoaulas recomendadas
        </p>
        <div class="videos-grid">
          ${topic.videos.map(v => `
            <a href="${v.url}" target="_blank" rel="noopener" class="video-card">
              <div class="video-icon"><i class="fa-brands fa-youtube"></i></div>
              <div class="video-info">
                <span class="video-title">${v.title}</span>
                <span class="video-channel">${v.channel}</span>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square video-ext-icon"></i>
            </a>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="content-header" style="margin-bottom:20px;">
          <p class="section-label" style="margin-bottom:0;">
            <i class="fa-solid fa-file-lines"></i> Conteúdo verificado
          </p>
          <span class="sources-badge">
            <i class="fa-solid fa-shield-halved"></i>
            ${topic.sources ? topic.sources.length + ' fontes' : 'Curado'}
          </span>
        </div>

        <div class="phase-text-content">
          ${topic.content}
        </div>

        ${topic.sources ? `
          <div class="phase-bibliography">
            <p class="bib-header">
              <i class="fa-solid fa-book-bookmark"></i> Referências
            </p>
            ${topic.sources.map(s => `<p>• ${s}</p>`).join('')}
          </div>
        ` : ''}
      </div>

      <div class="interaction-grid">
        <div class="interaction-card ai-card">
          <p class="interaction-card-title">
            <i class="fa-solid fa-robot"></i> Tirar dúvida com a SAGE AI
          </p>
          <p>Tem alguma dúvida sobre <strong style="color:var(--text);">${topic.name}</strong>? Pergunte à SAGE.</p>
          <textarea class="phase-input" style="min-height:80px; resize:none;" id="ai-question-input" placeholder="Ex: Qual a diferença entre adjetivo e advérbio?"></textarea>
          <div class="ai-loading" id="ai-loading">
            <i class="fa-solid fa-circle-notch fa-spin"></i><span>SAGE AI pensando...</span>
          </div>
          <div class="ai-response-area" id="ai-response"></div>
          <button class="btn btn--primary" onclick="askSageAI()" style="align-self:flex-start;">
            <i class="fa-solid fa-paper-plane"></i> Perguntar
          </button>
        </div>

        <div class="interaction-card quiz-card">
          <p class="interaction-card-title">
            <i class="fa-solid fa-clipboard-question"></i> Questionário
          </p>
          <p>Teste seus conhecimentos sobre <strong style="color:var(--text);">${topic.name}</strong>.</p>
          <div style="display:flex; gap:12px; flex-wrap:wrap; font-size:0.8rem; color:var(--muted); margin:8px 0;">
            <span><i class="fa-solid fa-circle-question"></i> 5 questões</span>
            <span><i class="fa-solid fa-star"></i> +10 pts/acerto</span>
            <span><i class="fa-solid fa-trophy"></i> +50 pts bônus</span>
          </div>
          <div id="quiz-area">
            <button class="btn btn--primary" onclick="startQuiz()" style="background:var(--green); border-color:var(--green); align-self:flex-start;">
              <i class="fa-solid fa-play"></i> Iniciar questionário
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderNoContent() {
  return `
    <div class="card">
      <div class="no-topic">
        <i class="fa-solid fa-book-open-reader"></i>
        <p>Conteúdo para esta matéria está sendo desenvolvido.</p>
        <a href="enem.html" class="btn btn--ghost" style="margin-top:8px;">
          <i class="fa-solid fa-arrow-left"></i> Voltar às matérias
        </a>
      </div>
    </div>
  `;
}

window.askSageAI = async function() {
  const input = document.getElementById('ai-question-input');
  const response = document.getElementById('ai-response');
  const loading = document.getElementById('ai-loading');
  const question = input ? input.value.trim() : '';

  if (!question) { alert('Digite sua dúvida antes de enviar.'); return; }
  if (!ACTIVE_TOPIC) return;

  loading.style.display = 'flex';
  response.style.display = 'none';

  const contextText = ACTIVE_TOPIC.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Você é a SAGE AI, assistente de estudos do PHASE. Responda APENAS com base no conteúdo abaixo. CONTEÚDO: ${contextText}`,
        messages: [{ role: 'user', content: question }]
      })
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    response.innerHTML = data.content.map(c => c.text).join('<br>');
    response.style.display = 'block';
  } catch (err) {
    response.innerHTML = 'Integração real exigiria chave de API configurada no backend, mas o componente está pronto.';
    response.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

window.startQuiz = async function() {
  const quizArea = document.getElementById('quiz-area');
  if (!ACTIVE_TOPIC) return;

  quizArea.innerHTML = `<div class="ai-loading" style="display:flex;"><i class="fa-solid fa-circle-notch fa-spin" style="color:var(--green);"></i><span>Gerando questionário com a SAGE AI...</span></div>`;

  try {
    // Simulate generation with a timeout
    setTimeout(() => {
      const mockQuestions = [
        {
          question: "Com base no conteúdo de " + ACTIVE_TOPIC.name + ", qual a principal característica abordada?",
          options: ["Opção A", "Opção B", "Opção C", "Opção D"],
          answer: 1,
          explanation: "A Opção B está correta conforme explicado no texto."
        }
      ];
      renderQuiz(mockQuestions, quizArea);
    }, 1500);
  } catch (err) {
    quizArea.innerHTML = `<p style="color:var(--danger);">Erro ao gerar.</p>`;
  }
}

function renderQuiz(questions, container) {
  container.innerHTML = `<div class="phase-questions" id="questions-list"></div><div id="quiz-result" style="display:none; margin-top:16px;"></div>`;
  const list = container.querySelector('#questions-list');

  questions.forEach((q, qi) => {
    const qEl = document.createElement('div');
    qEl.innerHTML = `
      <p class="question-text">${qi + 1}. ${q.question}</p>
      ${q.options.map((opt, oi) => `
        <button class="option-btn" data-q="${qi}" data-o="${oi}" onclick="pickOption(this, ${qi}, ${oi}, ${q.answer})">
          ${opt}
        </button>
      `).join('')}
      <div class="question-explanation" id="exp-${qi}" style="display:none;">${q.explanation}</div>
    `;
    list.appendChild(qEl);
  });
  window._quizData = { questions, score: 0, answered: 0, total: questions.length };
}

window.pickOption = function(btn, qIndex, oIndex, correctIndex) {
  const allBtns = document.querySelectorAll(`[data-q="${qIndex}"]`);
  allBtns.forEach(b => b.disabled = true);
  if (oIndex === correctIndex) {
    btn.classList.add('correct');
    window._quizData.score++;
  } else {
    btn.classList.add('wrong');
    allBtns[correctIndex].classList.add('correct');
  }
  const exp = document.getElementById('exp-' + qIndex);
  if (exp) exp.style.display = 'block';
  window._quizData.answered++;
  if (window._quizData.answered === window._quizData.total) {
    setTimeout(showQuizResult, 500);
  }
}

function showQuizResult() {
  const { score, total } = window._quizData;
  const pct = Math.round((score / total) * 100);
  const pts = score * 10 + (score === total ? 100 : 50);
  const prevPts = parseInt(localStorage.getItem('phase1_points') || '0');
  localStorage.setItem('phase1_points', prevPts + pts);
  
  const scoreVal = document.getElementById('score-val');
  if (scoreVal) scoreVal.textContent = prevPts + pts;

  const resultEl = document.getElementById('quiz-result');
  if (resultEl) {
    resultEl.style.display = 'block';
    resultEl.innerHTML = `
      <div class="result-box card">
        <span class="result-emoji">🎉</span>
        <p class="result-msg">Quiz concluído!</p>
        <p class="result-sub">${score} de ${total} corretas</p>
        <div class="result-badges">
          <span class="badge--accent" style="padding:4px 12px; border-radius:999px; font-size:0.8rem;">+${pts} pontos</span>
        </div>
      </div>
    `;
  }
}
