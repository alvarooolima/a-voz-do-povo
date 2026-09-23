// ---------- Dados ----------
const STORAGE_KEY = 'avozdopovo_reports';
const SUPPORTED_KEY = 'avozdopovo_supported';
const SESSION_KEY = 'avozdopovo_session';
const COMMENTS_KEY = 'avozdopovo_comentarios';

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
    data: '2026-09-12T10:00:00',
    resposta: {
      texto: 'Equipe de tapa-buraco já foi acionada e deve concluir o serviço nesta semana.',
      data: '2026-09-13T09:00:00'
    }
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
    data: '2026-09-18T14:30:00',
    resposta: null
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
    data: '2026-08-30T20:15:00',
    resposta: {
      texto: 'Lâmpada substituída pela equipe de iluminação pública. Obrigado pelo relato!',
      data: '2026-09-02T11:20:00'
    }
  }
];

const SEED_COMMENTS = [
  {
    id: 'comment-seed-1',
    reportId: 'seed-1',
    autor: 'Morador da região',
    texto: 'Também passo por ali todo dia, já rodei o carro pra desviar desse buraco.',
    data: '2026-09-12T15:40:00'
  },
  {
    id: 'comment-seed-2',
    reportId: 'seed-1',
    autor: 'Vizinho da rua',
    texto: 'Boa que reportou! Vou apoiar também.',
    data: '2026-09-13T08:10:00'
  },
  {
    id: 'comment-seed-3',
    reportId: 'seed-3',
    autor: 'Moradora da região',
    texto: 'Que bom que resolveram rápido, essa rua estava bem perigosa à noite.',
    data: '2026-09-02T19:00:00'
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
function loadComments(){
  try{
    const raw = localStorage.getItem(COMMENTS_KEY);
    if(!raw){
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(SEED_COMMENTS));
      return [...SEED_COMMENTS];
    }
    return JSON.parse(raw);
  }catch(e){
    return [...SEED_COMMENTS];
  }
}
function saveComments(list){
  try{ localStorage.setItem(COMMENTS_KEY, JSON.stringify(list)); }catch(e){}
}
function getCommentsFor(reportId){
  return loadComments()
    .filter(c => c.reportId === reportId)
    .sort((a, b) => new Date(a.data) - new Date(b.data));
}
function addComment(reportId, autor, texto){
  const comments = loadComments();
  comments.push({ id: 'comment-' + Date.now(), reportId, autor, texto, data: new Date().toISOString() });
  saveComments(comments);
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
function getSession(){
  try{ return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }catch(e){ return null; }
}
function canManageAsPrefeitura(){
  const session = getSession();
  return !!session && (session.tipo === 'prefeitura' || session.tipo === 'prefeito');
}
function saveResponse(id, texto, status){
  const reports = loadReports();
  const idx = reports.findIndex(r => r.id === id);
  if(idx === -1) return;
  reports[idx].resposta = { texto, data: new Date().toISOString() };
  reports[idx].status = status;
  saveReports(reports);
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
let searchQuery = '';
const openComments = new Set();

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

  let filtered = currentFilter === 'todos'
    ? reports
    : currentFilter === 'Respondidos'
      ? reports.filter(r => !!r.resposta)
      : currentFilter === 'Não respondidos'
        ? reports.filter(r => !r.resposta)
        : reports.filter(r => r.status === currentFilter);

  const searchIndicator = document.getElementById('searchIndicator');
  if(searchQuery){
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(r =>
      r.titulo.toLowerCase().includes(q) ||
      r.endereco.toLowerCase().includes(q) ||
      r.categoria.toLowerCase().includes(q) ||
      r.comentario.toLowerCase().includes(q)
    );
    if(searchIndicator){
      document.getElementById('searchIndicatorTerm').textContent = searchQuery;
      searchIndicator.hidden = false;
    }
  }else if(searchIndicator){
    searchIndicator.hidden = true;
  }

  if(filtered.length === 0){
    grid.innerHTML = '';
    if(empty){
      empty.hidden = false;
      empty.textContent = searchQuery
        ? `Nenhuma ocorrência encontrada para "${searchQuery}".`
        : 'Nenhuma ocorrência encontrada para esse filtro.';
    }
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
          <button class="like-btn ${isSupported ? 'is-liked' : ''}" data-id="${r.id}" aria-pressed="${isSupported}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 10l4-7c.8-.3 2 .1 2 1.5V9h5.3a2 2 0 0 1 2 2.4l-1.2 6.5A2 2 0 0 1 17.1 19.5H10a3 3 0 0 1-3-3v-6.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            <span>${r.apoios}</span>
          </button>
          <button type="button" class="comment-toggle-btn" data-id="${r.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            <span>${getCommentsFor(r.id).length}</span>
          </button>
          <span class="report-date">${formatDate(r.data)}</span>
        </div>
        <div class="comments-panel" data-id="${r.id}" ${openComments.has(r.id) ? '' : 'hidden'}>
          <div class="comments-list">
            ${getCommentsFor(r.id).map(c => `
              <div class="comment-item">
                <div class="comment-item-top">
                  <p class="comment-author">${escapeHtml(c.autor)}</p>
                  <span class="comment-date">${formatDate(c.data)}</span>
                </div>
                <p class="comment-text">${escapeHtml(c.texto)}</p>
              </div>
            `).join('') || '<p class="muted comments-empty">Seja o primeiro a comentar.</p>'}
          </div>
          <form class="comment-form" data-id="${r.id}">
            <textarea rows="2" placeholder="Escreva um comentário..." required></textarea>
            <button type="submit" class="btn btn-primary">Comentar</button>
          </form>
        </div>
        ${r.resposta ? `
        <div class="official-response">
          <div class="official-response-head">
            <span class="verified-dot">✔</span> Resposta da Prefeitura
            <span class="response-date">${formatDate(r.resposta.data)}</span>
          </div>
          <p>${escapeHtml(r.resposta.texto)}</p>
        </div>` : ''}
        ${canManageAsPrefeitura() ? `
        <div class="prefeitura-panel">
          <button type="button" class="link-btn respond-btn" data-id="${r.id}">${r.resposta ? 'Editar resposta oficial' : 'Responder oficialmente'}</button>
          <form class="response-form" data-id="${r.id}" hidden>
            <textarea rows="3" placeholder="Escreva a resposta oficial..." required>${r.resposta ? escapeHtml(r.resposta.texto) : ''}</textarea>
            <select>
              <option value="Em análise" ${r.status === 'Em análise' ? 'selected' : ''}>Em análise</option>
              <option value="Em andamento" ${r.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
              <option value="Resolvido" ${r.status === 'Resolvido' ? 'selected' : ''}>Resolvido</option>
            </select>
            <div class="response-form-actions">
              <button type="submit" class="btn btn-primary">Salvar resposta</button>
              <button type="button" class="link-btn cancel-response">Cancelar</button>
            </div>
          </form>
        </div>` : ''}
      </div>
    </article>`;
  }).join('');

  grid.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleSupport(btn.dataset.id));
  });

  grid.querySelectorAll('.comment-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if(openComments.has(id)) openComments.delete(id);
      else openComments.add(id);
      renderFeed();
    });
  });
  grid.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const textarea = form.querySelector('textarea');
      const texto = textarea.value.trim();
      if(!texto) return;
      const autor = getSession()?.nome || 'Morador da cidade';
      addComment(form.dataset.id, autor, texto);
      openComments.add(form.dataset.id);
      renderFeed();
    });
  });

  grid.querySelectorAll('.respond-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const form = btn.parentElement.querySelector('.response-form');
      if(form) form.hidden = !form.hidden;
    });
  });
  grid.querySelectorAll('.cancel-response').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.response-form').hidden = true;
    });
  });
  grid.querySelectorAll('.response-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = form.querySelector('textarea').value.trim();
      const status = form.querySelector('select').value;
      if(!texto) return;
      saveResponse(form.dataset.id, texto, status);
      renderFeed();
      showToast('Resposta oficial publicada!');
    });
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
  const dropdown = document.getElementById('filterDropdown');
  const trigger = document.getElementById('filterTrigger');
  const label = document.getElementById('filterTriggerLabel');
  if(!dropdown || !trigger) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('is-open');
  });

  dropdown.querySelectorAll('.filter-option').forEach(btn => {
    btn.addEventListener('click', () => {
      dropdown.querySelectorAll('.filter-option').forEach(o => o.classList.remove('is-active'));
      btn.classList.add('is-active');
      label.textContent = btn.textContent;
      currentFilter = btn.dataset.filter;
      dropdown.classList.remove('is-open');
      renderFeed();
    });
  });

  document.addEventListener('click', () => dropdown.classList.remove('is-open'));
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
    document.querySelectorAll('.filter-option').forEach(o => o.classList.toggle('is-active', o.dataset.filter === 'todos'));
    const filterLabel = document.getElementById('filterTriggerLabel');
    if(filterLabel) filterLabel.textContent = 'Todos';
    renderFeed();
    showToast('Relato enviado com sucesso!');
    document.getElementById('ocorrencias').scrollIntoView({ behavior:'smooth' });
  });
}

// ---------- Sessão (login) ----------
const ROLE_LABELS = { prefeitura: 'Prefeitura', prefeito: 'Prefeito' };

function setupSession(){
  const chip = document.getElementById('userChip');
  const loginLink = document.getElementById('loginLink');
  const criarContaLink = document.querySelector('.header-actions .btn-primary');
  const navResponderLink = document.getElementById('navResponderLink');
  const navEntrarPrefeituraLink = document.getElementById('navEntrarPrefeituraLink');
  const session = getSession();

  if(session && session.nome && chip){
    const papel = ROLE_LABELS[session.tipo];
    chip.textContent = 'Olá, ' + session.nome.split(' ')[0] + (papel ? ' (' + papel + ')' : '');
    chip.hidden = false;
    if(criarContaLink) criarContaLink.hidden = true;
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

  if(canManageAsPrefeitura()){
    if(navResponderLink) navResponderLink.hidden = false;
    if(navEntrarPrefeituraLink) navEntrarPrefeituraLink.hidden = true;
  }
}

// ---------- Busca do hero ----------
function setupHeroSearch(){
  const form = document.getElementById('heroSearchForm');
  const clearBtn = document.getElementById('searchIndicatorClear');
  if(!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = document.getElementById('heroSearchInput').value.trim();
    renderFeed();
    document.getElementById('ocorrencias').scrollIntoView({ behavior: 'smooth' });
  });

  if(clearBtn){
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      document.getElementById('heroSearchInput').value = '';
      renderFeed();
    });
  }

  const heroPrefeituraTool = document.getElementById('heroPrefeituraTool');
  if(heroPrefeituraTool){
    heroPrefeituraTool.addEventListener('click', (e) => {
      if(canManageAsPrefeitura()){
        e.preventDefault();
        document.getElementById('ocorrencias').scrollIntoView({ behavior: 'smooth' });
      }
      // Se não estiver logado com essa permissão, o link segue normalmente para o login.
    });
  }
}

// ---------- Busca compacta no cabeçalho (mobile/tablet, ao rolar) ----------
// Em telas <=920px, quando a busca do hero sai de vista, o cabeçalho troca a
// marca por um campo de busca compacto — igual ao comportamento do Reclame Aqui.
// Em telas maiores nada muda: a regra que exibe esse campo só existe dentro do
// media query, então a classe .is-visible não tem efeito no desktop.
function setupHeaderScrollSearch(){
  const heroSearchForm = document.getElementById('heroSearchForm');
  const headerBrand = document.getElementById('headerBrand');
  const compactSearch = document.getElementById('headerSearchCompact');
  const compactInput = document.getElementById('headerSearchCompactInput');
  if(!heroSearchForm || !headerBrand || !compactSearch) return;

  const mq = window.matchMedia('(max-width: 920px)');
  const HEADER_HEIGHT = 72;
  let ticking = false;

  function update(){
    ticking = false;
    // Só colapsa depois que o usuário rolar para além do fim da busca do hero
    // (não ao carregar a página, mesmo que a busca já comece abaixo da dobra).
    const collapsed = mq.matches && heroSearchForm.getBoundingClientRect().bottom < HEADER_HEIGHT;
    headerBrand.hidden = collapsed;
    compactSearch.classList.toggle('is-visible', collapsed);
  }

  window.addEventListener('scroll', () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  if(mq.addEventListener) mq.addEventListener('change', update);
  update();

  compactSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = compactInput.value.trim();
    renderFeed();
    document.getElementById('ocorrencias').scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------- Menu dropdown do header ----------
function setupNavDropdowns(){
  const triggers = document.querySelectorAll('.nav-dropdown-trigger');
  if(!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = trigger.closest('.nav-dropdown');
      const wasOpen = dropdown.classList.contains('is-open');
      document.querySelectorAll('.nav-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
      if(!wasOpen) dropdown.classList.add('is-open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  });
}

// ---------- Menu mobile ----------
function setupNavToggle(){
  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('navPanel');
  if(!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
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
  setupNavDropdowns();
  setupHeroSearch();
  setupHeaderScrollSearch();
  renderFeed();
});
