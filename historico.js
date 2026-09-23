// ---------- Histórico de administrações ----------
// Período atual: puxa o partido de quem estiver cadastrado como "Prefeito" (login.html).
// Sem cadastro real, cai no perfil de demonstração (mesmo fallback de avaliar.js).
const MANDATO_ATUAL_INICIO = 2025;

const HISTORICO_PASSADO = [
  {
    partido: 'MDC — Movimento Democrático da Cidade',
    inicio: 2009,
    fim: 2012,
    feitos: [
      'Criação do primeiro plano diretor de mobilidade urbana',
      'Reforma de 12 escolas municipais'
    ]
  },
  {
    partido: 'PSC — Partido Social da Cidade',
    inicio: 2013,
    fim: 2016,
    feitos: [
      'Revitalização da praça central',
      'Ampliação da coleta seletiva de lixo para 30% dos bairros'
    ]
  },
  {
    partido: 'PPM — Partido Progressista Municipal',
    inicio: 2017,
    fim: 2024,
    feitos: [
      'Construção de 3 novas UBS (Unidades Básicas de Saúde)',
      'Pavimentação de 40km de vias',
      'Programa de iluminação em LED em toda a cidade'
    ]
  }
];

function loadRegisteredUsersLocal(){
  try{ return JSON.parse(localStorage.getItem('avozdopovo_users') || '[]'); }catch(e){ return []; }
}
function getCurrentPartyInfo(){
  const prefeitos = loadRegisteredUsersLocal().filter(u => u.tipo === 'prefeito' && u.partido);
  if(prefeitos.length){
    prefeitos.sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0));
    return prefeitos[0].partido;
  }
  return 'PPM — Partido Progressista Municipal'; // mesmo fallback demo de avaliar.js
}

function buildHistorico(){
  const anoAtual = new Date().getFullYear();
  const atual = {
    partido: getCurrentPartyInfo(),
    inicio: MANDATO_ATUAL_INICIO,
    fim: null,
    emExercicio: true,
    feitos: []
  };
  return [...HISTORICO_PASSADO, atual].map(item => ({
    ...item,
    anos: (item.fim || anoAtual) - item.inicio + 1
  }));
}

function escapeHtmlHist(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ---------- Gráfico: anos no poder por partido ----------
function renderPartyChart(historico){
  const chart = document.getElementById('partyChart');
  if(!chart) return;

  const maxAnos = Math.max(...historico.map(h => h.anos));

  chart.innerHTML = historico.map(h => {
    const pct = Math.round((h.anos / maxAnos) * 100);
    return `
    <div class="party-bar-row">
      <div class="party-bar-label">
        <span>${escapeHtmlHist(h.partido)}</span>
        ${h.emExercicio ? '<span class="tag">Atual</span>' : ''}
      </div>
      <div class="party-bar-track">
        <div class="party-bar-fill ${h.emExercicio ? 'is-current' : ''}" style="width:${pct}%">
          <span class="party-bar-value">${h.anos} ano${h.anos === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ---------- Linha do tempo ----------
function renderTimeline(historico){
  const list = document.getElementById('timelineList');
  if(!list) return;

  const ordenado = [...historico].sort((a, b) => b.inicio - a.inicio);

  list.innerHTML = ordenado.map(h => `
    <article class="timeline-item ${h.emExercicio ? 'is-current' : ''}">
      <div class="timeline-period">
        <strong>${h.inicio}–${h.emExercicio ? 'atual' : h.fim}</strong>
        <span>${h.anos} ano${h.anos === 1 ? '' : 's'} no poder</span>
      </div>
      <div class="timeline-body">
        <div class="timeline-top">
          <h3>${escapeHtmlHist(h.partido)}</h3>
          ${h.emExercicio ? '<span class="tag">Gestão atual</span>' : ''}
        </div>
        ${h.feitos.length ? `
          <ul class="timeline-feitos">
            ${h.feitos.map(f => `<li>${escapeHtmlHist(f)}</li>`).join('')}
          </ul>
        ` : '<p class="muted">Mandato em andamento — os relatos resolvidos aparecem em <a href="prefeito.html">Avalie o prefeito</a>.</p>'}
      </div>
    </article>
  `).join('');
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  const historico = buildHistorico();
  renderPartyChart(historico);
  renderTimeline(historico);
});
