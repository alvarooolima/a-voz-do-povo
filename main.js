// ---------- Dados ----------
const STORAGE_KEY = 'avozdopovo_reports';
const SUPPORTED_KEY = 'avozdopovo_supported';
const SESSION_KEY = 'avozdopovo_session';

const CATEGORIES = [
  {
    nome: 'Buraco na via',
    desc: 'Buracos, afundamentos e má conservação do asfalto.',
    icon: '<path d="M4 17c3-1 5-1 8 0s5 1 8 0" stroke="#1746D6" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="12" cy="16.4" rx="4.4" ry="1.6" stroke="#1746D6" stroke-width="1.6" fill="none"/>'
  },
  {
    nome: 'Poda de árvore',
    desc: 'Galhos em risco de queda ou vegetação invadindo a via.',
    icon: '<path d="M12 21v-7m0 0c4 0 6-2.5 6-6.5C18 4 15.5 3 12 3S6 4 6 7.5C6 11.5 8 14 12 14Z" stroke="#1746D6" stroke-width="1.6" fill="none" stroke-linejoin="round"/>'
  },
  {
    nome: 'Iluminação pública',
    desc: 'Postes apagados, piscando ou danificados.',
    icon: '<path d="M12 3a5 5 0 0 1 5 5c0 2.4-1.6 3.7-2.4 4.9-.5.8-.6 1.4-.6 2.1H10c0-.7-.1-1.3-.6-2.1C8.6 11.7 7 10.4 7 8a5 5 0 0 1 5-5Z" stroke="#1746D6" stroke-width="1.6" fill="none"/><path d="M10 18h4M10.5 20.5h3" stroke="#1746D6" stroke-width="1.6" stroke-linecap="round"/>'
  },
  {
    nome: 'Calçada e acessibilidade',
    desc: 'Calçadas quebradas, sem rampa ou obstruídas.',
    icon: '<path d="M4 20h16M6 20V9l4-2 4 2v11M6 20 3 20M18 20l3 0" stroke="#1746D6" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    nome: 'Lixo e limpeza',
    desc: 'Acúmulo de lixo, entulho ou terrenos sujos.',
    icon: '<path d="M6 7h12l-1 13H7L6 7Z" stroke="#1746D6" stroke-width="1.6" fill="none" stroke-linejoin="round"/><path d="M4 7h16M9 7 10 4h4l1 3" stroke="#1746D6" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    nome: 'Outro',
    desc: 'Qualquer outro problema que afete a sua rua ou bairro.',
    icon: '<circle cx="12" cy="12" r="8.5" stroke="#1746D6" stroke-width="1.6" fill="none"/><path d="M12 8v5" stroke="#1746D6" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16" r="0.9" fill="#1746D6"/>'
  }
];

const SEED_REPORTS = [
  {
    id: 'seed-1',
    categoria: 'Buraco na via',
    titulo: 'Buraco grande na Rua das Acácias',
    endereco: 'Rua das Acácias, 340 — Jardim Primavera',
    comentario: 'Buraco profundo próximo ao ponto de ônibus, já causou dois furos de pneu essa semana.',
    foto: null,
    anonimo: false,
    status: 'Em andamento',
    apoios: 24,
    data: '2026-09-12T10:00:00'
  },
  {
    id: 'seed-2',
    categoria: 'Poda de árvore',
    titulo: 'Galho ameaçando cair sobre a calçada',
    endereco: 'Av. Central, altura do nº 900',
    comentario: 'Um galho grande está rachado e pode cair a qualquer momento, bem em cima da calçada.',
    foto: null,
    anonimo: false,
    status: 'Em análise',
    apoios: 11,
    data: '2026-09-18T14:30:00'
  },
  {
    id: 'seed-3',
    categoria: 'Iluminação pública',
    titulo: 'Poste apagado há duas semanas',
    endereco: 'Rua Sete de Setembro, esquina com Rua Bahia',
    comentario: 'Rua fica bem escura à noite, moradores relatam insegurança para caminhar.',
    foto: null,
    anonimo: true,
    status: 'Resolvido',
    apoios: 8,
    data: '2026-08-30T20:15:00'
  }
];

// ---------- Helpers ----------
function loadReports(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REPORTS));
      return [...SEED_REPORTS];
    }
    return JSON.parse(raw);
  }catch(e){
    return [...SEED_REPORTS];
  }
}
function saveReports(list){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }catch(e){}
}
function loadSupported(){
  try{ return JSON.parse(localStorage.getItem(SUPPORTED_KEY) || '[]'); }catch(e){ return []; }
}
function saveSupported(list){
  try{ localStorage.setItem(SUPPORTED_KEY, JSON.stringify(list)); }catch(e){}
}
function statusClass(status){
  if(status === 'Resolvido') return 'status-resolvido';
  if(status === 'Em andamento') return 'status-andamento';
  return 'status-analise';
}
function formatDate(iso){
  const d = new Date(iso);
  if(isNaN(d)) return '';
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
}
function showToast(msg){
  const toast = document.getElementById('toast');
  if(!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> toast.classList.remove('is-visible'), 2800);
}

// ---------- Categorias ----------
function renderCategories(){
  const grid = document.getElementById('catGrid');
  if(!grid) return;
  grid.innerHTML = CATEGORIES.map(c => `
    <div class="cat-card">
      <div class="cat-icon"><svg width="22" height="22" viewBox="0 0 24 24">${c.icon}</svg></div>
      <h3>${c.nome}</h3>
      <p>${c.desc}</p>
    </div>
  `).join('');
}

// ---------- Feed ----------
let currentFilter = 'todos';

function renderStats(reports){
  const total = reports.length;
  const andamento = reports.filter(r => r.status === 'Em andamento').length;
  const resolvido = reports.filter(r => r.status === 'Resolvido').length;
  const elTotal = document.getElementById('statTotal');
  const elAnd = document.getElementById('statAndamento');
  const elRes = document.getElementById('statResolvido');
  if(elTotal) elTotal.textContent = total;
  if(elAnd) elAnd.textContent = andamento;
  if(elRes) elRes.textContent = resolvido;
}

function renderFeed(){
  const reports = loadReports().sort((a,b) => new Date(b.data) - new Date(a.data));
  renderStats(reports);

  const grid = document.getElementById('feedGrid');
  const empty = document.getElementById('feedEmpty');
  if(!grid) return;

  const filtered = currentFilter === 'todos'
    ? reports
    : reports.filter(r => r.status === currentFilter);

  if(filtered.length === 0){
    grid.innerHTML = '';
    if(empty) empty.hidden = false;
    return;
  }
  if(empty) empty.hidden = true;

  const supported = loadSupported();

  grid.innerHTML = filtered.map(r => {
    const isSupported = supported.includes(r.id);
    const author = r.anonimo ? 'Relato anônimo' : 'Morador da região';
    return `
    <article class="report-card">
      <div class="report-photo">
        ${r.foto
          ? `<img src="${r.foto}" alt="Foto enviada do problema: ${escapeHtml(r.titulo)}">`
          : `<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M4 17.5 8.5 12l3 3.5L15 11l5 6.5" stroke="#1746D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="8" r="2" stroke="#1746D6" stroke-width="1.5"/><rect x="3" y="4" width="18" height="16" rx="2" stroke="#1746D6" stroke-width="1.5"/></svg>`
        }
      </div>
      <div class="report-body">
        <div class="report-top">
          <span class="tag">${escapeHtml(r.categoria)}</span>
          <span class="status ${statusClass(r.status)}">${r.status}</span>
        </div>
        <h3>${escapeHtml(r.titulo)}</h3>
        <p class="report-meta">${escapeHtml(r.endereco)} · ${author}</p>
        <p class="report-comment">${escapeHtml(r.comentario)}</p>
        <div class="report-footer">
          <button class="support-btn ${isSupported ? 'is-supported' : ''}" data-id="${r.id}">
            ▲ <span>${r.apoios}</span>
          </button>
          <span class="report-date">${formatDate(r.data)}</span>
        </div>
      </div>
    </article>`;
  }).join('');

  grid.querySelectorAll('.support-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleSupport(btn.dataset.id));
  });
}

function toggleSupport(id){
  const reports = loadReports();
  const supported = loadSupported();
  const idx = reports.findIndex(r => r.id === id);
  if(idx === -1) return;
  const alreadySupported = supported.includes(id);

  if(alreadySupported){
    reports[idx].apoios = Math.max(0, reports[idx].apoios - 1);
    saveSupported(supported.filter(s => s !== id));
  }else{
    reports[idx].apoios += 1;
    supported.push(id);
    saveSupported(supported);
  }
  saveReports(reports);
  renderFeed();
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ---------- Filtros ----------
function setupFilters(){
  const filters = document.getElementById('filters');
  if(!filters) return;
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if(!btn) return;
    filters.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentFilter = btn.dataset.filter;
    renderFeed();
  });
}

// ---------- Upload de foto ----------
let pendingPhoto = null;

function setupUpload(){
  const input = document.getElementById('foto');
  const empty = document.getElementById('uploadEmpty');
  const preview = document.getElementById('uploadPreview');
  if(!input) return;

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      pendingPhoto = e.target.result;
      preview.src = pendingPhoto;
      preview.hidden = false;
      empty.hidden = true;
    };
    reader.readAsDataURL(file);
  });
}

// ---------- Formulário de relato ----------
function setupReportForm(){
  const form = document.getElementById('reportForm');
  if(!form) return;
  const msg = document.getElementById('formMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const categoria = document.getElementById('categoria').value;
    const titulo = document.getElementById('titulo').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    const anonimo = document.getElementById('anonimo').checked;

    if(!categoria || !titulo || !endereco || !comentario){
      msg.textContent = 'Preencha todos os campos obrigatórios.';
      msg.classList.add('is-error');
      return;
    }

    const reports = loadReports();
    reports.unshift({
      id: 'r-' + Date.now(),
      categoria, titulo, endereco, comentario,
      foto: pendingPhoto,
      anonimo,
      status: 'Em análise',
      apoios: 0,
      data: new Date().toISOString()
    });
    saveReports(reports);

    form.reset();
    pendingPhoto = null;
    document.getElementById('uploadPreview').hidden = true;
    document.getElementById('uploadEmpty').hidden = false;
    msg.classList.remove('is-error');
    msg.textContent = 'Relato enviado! Obrigado por contribuir.';
    setTimeout(() => { msg.textContent = ''; }, 4000);

    currentFilter = 'todos';
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c.dataset.filter === 'todos'));
    renderFeed();
    showToast('Relato enviado com sucesso!');
    document.getElementById('ocorrencias').scrollIntoView({ behavior:'smooth' });
  });
}

// ---------- Sessão (login) ----------
function setupSession(){
  const chip = document.getElementById('userChip');
  const loginLink = document.getElementById('loginLink');
  try{
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if(session && session.nome && chip){
      chip.textContent = 'Olá, ' + session.nome.split(' ')[0];
      chip.hidden = false;
      if(loginLink){
        loginLink.textContent = 'Sair';
        loginLink.href = '#';
        loginLink.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem(SESSION_KEY);
          location.reload();
        });
      }
    }
  }catch(e){}
}

// ---------- Menu mobile ----------
function setupNavToggle(){
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';
    nav.style.display = isOpen ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '72px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = '#fff';
    nav.style.padding = '16px 24px';
    nav.style.borderBottom = '1px solid var(--line)';
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  renderCategories();
  setupFilters();
  setupUpload();
  setupReportForm();
  setupSession();
  setupNavToggle();
  renderFeed();
});
