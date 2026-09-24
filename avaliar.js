// ---------- Configuração do prefeito ----------
// Perfil de demonstração, usado só até alguém se cadastrar como "Prefeito" (login.html).
// Para usar uma foto real nesse perfil demo, troque `foto` por um caminho de imagem.
const MAYOR = {
  nome: 'João Silva',
  partido: 'Partido Progressista Municipal (PPM)',
  mandato: 'Mandato 2025–2028',
  foto: null
};

function loadRegisteredUsers(){
  try{ return JSON.parse(localStorage.getItem('avozdopovo_users') || '[]'); }catch(e){ return []; }
}
function getMayorAccount(){
  const prefeitos = loadRegisteredUsers().filter(u => u.tipo === 'prefeito' && u.partido);
  if(!prefeitos.length) return null;
  prefeitos.sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0));
  return prefeitos[0];
}

const RATINGS_KEY = 'avozdopovo_prefeito_avaliacoes';
const MY_RATING_KEY = 'avozdopovo_minha_avaliacao';

const SEED_RATINGS = [
  {
    id: 'rate-seed-1',
    nome: 'Morador da região',
    nota: 4,
    comentario: 'Resolveram o poste apagado da Rua Sete de Setembro rapidinho depois do relato.',
    data: '2026-09-01T09:00:00'
  },
  {
    id: 'rate-seed-2',
    nome: 'Moradora do bairro',
    nota: 3,
    comentario: 'Melhorou, mas ainda falta resolver os buracos na via principal.',
    data: '2026-09-05T18:20:00'
  }
];

// ---------- Helpers ----------
function loadRatings(){
  try{
    const raw = localStorage.getItem(RATINGS_KEY);
    if(!raw){
      localStorage.setItem(RATINGS_KEY, JSON.stringify(SEED_RATINGS));
      return [...SEED_RATINGS];
    }
    return JSON.parse(raw);
  }catch(e){
    return [...SEED_RATINGS];
  }
}
function saveRatings(list){
  try{ localStorage.setItem(RATINGS_KEY, JSON.stringify(list)); }catch(e){}
}
function getMyRatingId(){
  try{ return localStorage.getItem(MY_RATING_KEY); }catch(e){ return null; }
}
function setMyRatingId(id){
  try{ localStorage.setItem(MY_RATING_KEY, id); }catch(e){}
}
function getSessionName(){
  try{
    const session = JSON.parse(localStorage.getItem('avozdopovo_session') || 'null');
    return session && session.nome ? session.nome : null;
  }catch(e){ return null; }
}
function getInitials(nome){
  return nome.trim().split(/\s+/).slice(0,2).map(p => p[0].toUpperCase()).join('');
}
function starsMarkup(value, max = 5){
  let out = '';
  for(let i = 1; i <= max; i++){
    out += `<span class="star ${i <= value ? 'is-filled' : ''}">★</span>`;
  }
  return out;
}
function formatRatingDate(iso){
  const d = new Date(iso);
  if(isNaN(d)) return '';
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
}
function escapeHtmlLocal(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ---------- Perfil do prefeito ----------
function renderMayorProfile(){
  const nomeEl = document.getElementById('mayorNome');
  const partidoEl = document.getElementById('mayorPartido');
  const mandatoEl = document.getElementById('mayorMandato');
  const photoEl = document.getElementById('mayorPhoto');
  if(!nomeEl) return;

  const account = getMayorAccount();
  const nome = account ? account.nome : MAYOR.nome;
  const partido = account ? account.partido : MAYOR.partido;
  const mandato = account ? 'Em exercício' : MAYOR.mandato;

  nomeEl.textContent = nome;
  partidoEl.textContent = partido;
  mandatoEl.textContent = mandato;

  if(MAYOR.foto && !account){
    photoEl.innerHTML = `<img src="${MAYOR.foto}" alt="Foto de ${escapeHtmlLocal(nome)}">`;
  }else{
    photoEl.textContent = getInitials(nome);
  }

  renderAverageScore();
}

function renderAverageScore(){
  const ratings = loadRatings();
  const starsEl = document.getElementById('avgStars');
  const numberEl = document.getElementById('avgScoreNumber');
  const countEl = document.getElementById('avgScoreCount');
  if(!starsEl) return;

  if(ratings.length === 0){
    starsEl.innerHTML = starsMarkup(0);
    numberEl.textContent = '—';
    countEl.textContent = 'Nenhuma avaliação ainda';
    return;
  }

  const sum = ratings.reduce((acc, r) => acc + r.nota, 0);
  const avg = sum / ratings.length;
  starsEl.innerHTML = starsMarkup(Math.round(avg));
  numberEl.textContent = avg.toFixed(1);
  countEl.textContent = `com base em ${ratings.length} avaliaç${ratings.length === 1 ? 'ão' : 'ões'}`;
}

// ---------- Seletor de estrelas ----------
function setupStarPicker(){
  const picker = document.getElementById('starPicker');
  const hiddenValue = document.getElementById('rateValue');
  if(!picker) return;

  const buttons = [...picker.querySelectorAll('.star-btn')];

  function paint(value){
    buttons.forEach(btn => {
      const isFilled = Number(btn.dataset.value) <= value;
      btn.classList.toggle('is-filled', isFilled);
      btn.setAttribute('aria-checked', String(Number(btn.dataset.value) === value));
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = Number(btn.dataset.value);
      hiddenValue.value = value;
      paint(value);
    });
    btn.addEventListener('mouseenter', () => paint(Number(btn.dataset.value)));
  });
  picker.addEventListener('mouseleave', () => paint(Number(hiddenValue.value)));

  // Se o usuário já avaliou antes neste navegador, pré-preenche.
  const myId = getMyRatingId();
  if(myId){
    const mine = loadRatings().find(r => r.id === myId);
    if(mine){
      hiddenValue.value = mine.nota;
      paint(mine.nota);
      document.getElementById('rateComentario').value = mine.comentario || '';
    }
  }
}

// ---------- Envio da avaliação ----------
function setupRateForm(){
  const form = document.getElementById('rateForm');
  if(!form) return;
  const msg = document.getElementById('rateMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nota = Number(document.getElementById('rateValue').value);
    const comentario = document.getElementById('rateComentario').value.trim();

    if(!nota){
      msg.classList.add('is-error');
      msg.textContent = 'Escolha uma nota de 1 a 5 estrelas.';
      return;
    }

    const ratings = loadRatings();
    const nome = getSessionName() || 'Morador da cidade';
    const myId = getMyRatingId();
    const existingIdx = myId ? ratings.findIndex(r => r.id === myId) : -1;

    if(existingIdx !== -1){
      ratings[existingIdx] = { ...ratings[existingIdx], nota, comentario, data: new Date().toISOString() };
    }else{
      const id = 'rate-' + Date.now();
      ratings.unshift({ id, nome, nota, comentario, data: new Date().toISOString() });
      setMyRatingId(id);
    }

    saveRatings(ratings);
    renderAverageScore();
    renderRatingList();
    renderReputationPanel();

    msg.classList.remove('is-error');
    msg.textContent = 'Avaliação enviada. Obrigado por participar!';
    setTimeout(() => { msg.textContent = ''; }, 4000);
    showToast('Avaliação registrada!');
  });
}

// ---------- Lista de avaliações ----------
function renderRatingList(){
  const list = document.getElementById('ratingList');
  const empty = document.getElementById('ratingEmpty');
  if(!list) return;

  const ratings = loadRatings().sort((a,b) => new Date(b.data) - new Date(a.data));

  if(ratings.length === 0){
    list.innerHTML = '';
    if(empty) empty.hidden = false;
    return;
  }
  if(empty) empty.hidden = true;

  list.innerHTML = ratings.map(r => `
    <article class="rating-item">
      <div class="rating-top">
        <span class="rating-stars">${starsMarkup(r.nota)}</span>
        <span class="rating-date">${formatRatingDate(r.data)}</span>
      </div>
      <p class="rating-author">${escapeHtmlLocal(r.nome)}</p>
      ${r.comentario ? `<p class="rating-comment">${escapeHtmlLocal(r.comentario)}</p>` : ''}
    </article>
  `).join('');
}

// ---------- Problemas resolvidos ----------
function renderResolvedGrid(){
  const grid = document.getElementById('resolvedGrid');
  const empty = document.getElementById('resolvedEmpty');
  if(!grid || typeof loadReports !== 'function') return;

  const resolved = loadReports()
    .filter(r => r.status === 'Resolvido')
    .sort((a,b) => new Date(b.data) - new Date(a.data));

  if(resolved.length === 0){
    grid.innerHTML = '';
    if(empty) empty.hidden = false;
    return;
  }
  if(empty) empty.hidden = true;

  grid.innerHTML = resolved.map(r => `
    <article class="report-card">
      <div class="report-photo">
        ${r.foto
          ? `<img src="${r.foto}" alt="Foto do problema resolvido: ${escapeHtmlLocal(r.titulo)}">`
          : `<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M4 17.5 8.5 12l3 3.5L15 11l5 6.5" stroke="#0C3B79" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="8" r="2" stroke="#0C3B79" stroke-width="1.5"/><rect x="3" y="4" width="18" height="16" rx="2" stroke="#0C3B79" stroke-width="1.5"/></svg>`
        }
      </div>
      <div class="report-body">
        <div class="report-top">
          <span class="tag">${escapeHtmlLocal(r.categoria)}</span>
          <span class="status status-resolvido">Resolvido</span>
        </div>
        <h3>${escapeHtmlLocal(r.titulo)}</h3>
        <p class="report-meta">${escapeHtmlLocal(r.endereco)}</p>
        <p class="report-comment">${escapeHtmlLocal(r.comentario)}</p>
      </div>
    </article>
  `).join('');
}

// ---------- Reputação e desempenho ----------
function computeReputation(){
  const reports = typeof loadReports === 'function' ? loadReports() : [];
  const ratings = loadRatings();

  const recebidos = reports.length;
  const respondidos = reports.filter(r => !!r.resposta).length;
  const aguardando = recebidos - respondidos;
  const resolvidos = reports.filter(r => r.status === 'Resolvido').length;
  const pctRespondidos = recebidos ? Math.round((respondidos / recebidos) * 100) : 0;
  const pctResolvidos = recebidos ? Math.round((resolvidos / recebidos) * 100) : 0;

  const notaMedia = ratings.length ? ratings.reduce((acc, r) => acc + r.nota, 0) / ratings.length : 0;
  const notaDez = notaMedia * 2;

  const tempos = reports
    .filter(r => r.resposta)
    .map(r => Math.max(0, (new Date(r.resposta.data) - new Date(r.data)) / (1000 * 60 * 60 * 24)));
  const tempoMedioDias = tempos.length ? tempos.reduce((a, b) => a + b, 0) / tempos.length : null;

  let tier = 'sem-dados';
  let label = 'Reputação em formação';
  if(ratings.length > 0){
    if(notaDez >= 9 && pctResolvidos >= 70){ tier = 'voz1000'; label = 'Voz 1000'; }
    else if(notaDez >= 7){ tier = 'otima'; label = 'Reputação Ótima'; }
    else if(notaDez >= 5){ tier = 'boa'; label = 'Reputação Boa'; }
    else if(notaDez >= 3){ tier = 'regular'; label = 'Reputação Regular'; }
    else{ tier = 'ruim'; label = 'Reputação Ruim'; }
  }

  return { recebidos, respondidos, aguardando, resolvidos, pctRespondidos, pctResolvidos, notaMedia, notaDez, tempoMedioDias, tier, label };
}

function renderReputationPanel(){
  const badge = document.getElementById('reputationBadge');
  if(!badge) return;
  const rep = computeReputation();

  badge.textContent = rep.label;
  badge.className = 'reputation-badge tier-' + rep.tier;

  document.getElementById('statRecebidos').textContent = rep.recebidos;
  document.getElementById('statRespondidos').textContent = rep.recebidos ? rep.pctRespondidos + '%' : '—';
  document.getElementById('statAguardando').textContent = rep.aguardando;
  document.getElementById('statResolvidosPct').textContent = rep.recebidos ? rep.pctResolvidos + '%' : '—';
  document.getElementById('statNotaDez').textContent = rep.notaMedia ? rep.notaDez.toFixed(1) : '—';
  document.getElementById('statTempoResposta').textContent = rep.tempoMedioDias === null
    ? '—'
    : (rep.tempoMedioDias < 1 ? '< 1 dia' : Math.round(rep.tempoMedioDias) + ' dias');
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderMayorProfile();
  setupStarPicker();
  setupRateForm();
  renderRatingList();
  renderResolvedGrid();
  renderReputationPanel();
});
