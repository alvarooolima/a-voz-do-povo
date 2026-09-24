// Mapa das ocorrências + seletor de local do formulário (Leaflet + OpenStreetMap).
// Os relatos precisam de lat/lng para aparecer no mapa; os relatos de demonstração
// ganham coordenadas abaixo. Troque CITY pelo centro da sua cidade.
(function(){
  const CITY = { lat: -15.7801, lng: -47.9292, zoom: 14 };
  const RADIUS = 400; // metros
  const SEED_COORDS = {
    'seed-1': { lat: -15.7842, lng: -47.9218 },
    'seed-2': { lat: -15.7795, lng: -47.9330 },
    'seed-3': { lat: -15.7826, lng: -47.9235 }
  };
  const COLORS = { 'Em análise': '#B4790A', 'Em andamento': '#0C3B79', 'Resolvido': '#1D8A5A' };

  const mapEl = document.getElementById('occMap');
  const sideEl = document.getElementById('mapSide');
  if(!mapEl || !sideEl) return;
  if(typeof L === 'undefined'){
    sideEl.innerHTML = '<p class="muted">Não foi possível carregar o mapa agora. Tente recarregar a página.</p>';
    return;
  }

  function coordsOf(r){
    if(typeof r.lat === 'number' && typeof r.lng === 'number') return { lat: r.lat, lng: r.lng };
    return SEED_COORDS[r.id] || null;
  }
  function distance(a, b){
    const R = 6371000, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function pinIcon(color){
    return L.divIcon({
      className: 'occ-pin',
      html: '<svg width="32" height="40" viewBox="0 0 32 40" aria-hidden="true"><path d="M16 1C8 1 2 7 2 14.5 2 25 16 39 16 39s14-14 14-24.5C30 7 24 1 16 1z" fill="' + color + '" stroke="#fff" stroke-width="2"/><circle cx="16" cy="14.5" r="5.5" fill="#fff"/></svg>',
      iconSize: [32, 40], iconAnchor: [16, 39], popupAnchor: [0, -36]
    });
  }
  function tiles(){
    return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    });
  }
  function locate(onOk){
    if(!navigator.geolocation){ showToast('Seu navegador não permite obter a localização.'); return; }
    navigator.geolocation.getCurrentPosition(
      p => onOk({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => showToast('Não foi possível obter sua localização. Você pode tocar no mapa.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
  function scrollToId(id){
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  // ---------- Mapa principal ----------
  const map = L.map(mapEl, { scrollWheelZoom: false }).setView([CITY.lat, CITY.lng], CITY.zoom);
  tiles().addTo(map);
  const markers = L.layerGroup().addTo(map);
  let circle = null;
  let youMarker = null;
  let selected = null;

  function renderMarkers(){
    markers.clearLayers();
    loadReports().forEach(r => {
      const c = coordsOf(r);
      if(!c) return;
      const m = L.marker([c.lat, c.lng], {
        icon: pinIcon(COLORS[r.status] || COLORS['Em análise']),
        title: r.titulo + ' (' + r.status + ')',
        alt: r.titulo
      });
      m.on('click', () => select(c, r.id));
      m.addTo(markers);
    });
  }

  function select(latlng, focusId){
    selected = { lat: latlng.lat, lng: latlng.lng, focusId: focusId || null };
    if(circle) circle.setLatLng([selected.lat, selected.lng]);
    else circle = L.circle([selected.lat, selected.lng], { radius: RADIUS, color: '#0C3B79', weight: 2, fillColor: '#0C3B79', fillOpacity: 0.08 }).addTo(map);
    renderSide();
    sideEl.scrollTop = 0;
  }
  function clearSelection(){
    selected = null;
    if(circle){ map.removeLayer(circle); circle = null; }
    renderSide();
  }

  function itemHtml(r, dist, focus){
    const comments = getCommentsFor(r.id);
    const last = comments.slice(-2).map(c =>
      '<li><strong>' + escapeHtml(c.autor) + ':</strong> ' + escapeHtml(c.texto) + '</li>').join('');
    return '<article class="map-item' + (focus ? ' is-focus' : '') + '">' +
      '<div class="map-item-top"><span class="tag">' + escapeHtml(r.categoria) + '</span>' +
      '<span class="status ' + statusClass(r.status) + '">' + r.status + '</span></div>' +
      '<h4>' + escapeHtml(r.titulo) + '</h4>' +
      '<p class="map-item-meta">' + escapeHtml(r.endereco) + (dist != null ? ' · a ' + Math.round(dist) + ' m' : '') + '</p>' +
      '<p class="map-item-text">' + escapeHtml(r.comentario) + '</p>' +
      (comments.length
        ? '<div class="map-comments"><p class="map-comments-title">O que estão dizendo (' + comments.length + ')</p><ul>' + last + '</ul></div>'
        : '') +
      '<div class="map-item-foot"><span>' + r.apoios + ' curtidas · ' + comments.length + ' comentários</span>' +
      '<span class="map-item-actions"><button type="button" class="link-btn" data-center="' + r.id + '">Ver no mapa</button>' +
      '<button type="button" class="link-btn" data-feed="' + r.id + '">Abrir relato</button></span></div>' +
      '</article>';
  }

  function renderSide(){
    const all = loadReports().map(r => ({ r, c: coordsOf(r) })).filter(x => x.c);
    if(selected){
      const near = all
        .map(x => ({ r: x.r, d: distance(selected, x.c) }))
        .filter(x => x.d <= RADIUS)
        .sort((a, b) => a.d - b.d);
      let html = '<div class="map-side-head"><h3>Perto deste ponto</h3><span>até ' + RADIUS + ' m</span>' +
        '<button type="button" class="link-btn" data-clear>Limpar</button></div>';
      if(near.length === 0){
        html += '<p class="muted map-empty">Nenhum relato por aqui ainda.</p>' +
          '<button type="button" class="btn btn-primary" data-report-here>Reportar neste ponto</button>';
      }else{
        html += near.map(x => itemHtml(x.r, x.d, x.r.id === selected.focusId)).join('');
        html += '<button type="button" class="link-btn map-report-link" data-report-here>Reportar um problema neste ponto →</button>';
      }
      sideEl.innerHTML = html;
    }else{
      const list = all.sort((a, b) => new Date(b.r.data) - new Date(a.r.data)).slice(0, 6);
      let html = '<div class="map-side-head"><h3>Ocorrências no mapa</h3><span>' + all.length + '</span></div>' +
        '<p class="muted map-hint">Toque em um pino ou em qualquer ponto do mapa para ver o que a vizinhança relata por perto.</p>';
      html += list.length ? list.map(x => itemHtml(x.r, null, false)).join('') : '<p class="muted map-empty">Ainda não há relatos com localização. Ao reportar, marque o local no mapa.</p>';
      sideEl.innerHTML = html;
    }
  }

  sideEl.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if(!t) return;
    if(t.hasAttribute('data-clear')) return clearSelection();
    if(t.hasAttribute('data-report-here')){
      if(selected) setPicker({ lat: selected.lat, lng: selected.lng }, true);
      return scrollToId('reportar');
    }
    const findReport = id => loadReports().find(r => r.id === id);
    if(t.dataset.center){
      const r = findReport(t.dataset.center); const c = r && coordsOf(r);
      if(c){ map.setView([c.lat, c.lng], Math.max(map.getZoom(), 16)); select(c, r.id); mapEl.scrollIntoView({ block: 'nearest' }); }
    }
    if(t.dataset.feed){
      const r = findReport(t.dataset.feed);
      if(r){ searchQuery = r.titulo; categoryFilter = ''; renderFeed(); scrollToId('ocorrencias'); }
    }
  });

  map.on('click', (e) => select(e.latlng));

  document.getElementById('mapLocate').addEventListener('click', () => {
    locate(p => {
      map.setView([p.lat, p.lng], 16);
      if(youMarker) youMarker.setLatLng([p.lat, p.lng]);
      else youMarker = L.circleMarker([p.lat, p.lng], { radius: 8, color: '#fff', weight: 3, fillColor: '#0C3B79', fillOpacity: 1 }).addTo(map).bindTooltip('Você está aqui');
      select(p);
    });
  });

  // ---------- Seletor de local do formulário ----------
  const pickEl = document.getElementById('pickMap');
  const pickHint = document.getElementById('pickHint');
  const pickClear = document.getElementById('pickClear');
  const DEFAULT_HINT = 'Ou toque no mapa para marcar onde está o problema. Assim os vizinhos o veem no mapa.';
  let pickMap = null, pickMarker = null;
  window.reportLocation = null;

  function setPicker(latlng, pan){
    window.reportLocation = { lat: latlng.lat, lng: latlng.lng };
    if(pickMap){
      if(!pickMarker){
        pickMarker = L.marker([latlng.lat, latlng.lng], { draggable: true, icon: pinIcon('#0C3B79'), title: 'Local do problema' }).addTo(pickMap);
        pickMarker.on('dragend', () => { const p = pickMarker.getLatLng(); window.reportLocation = { lat: p.lat, lng: p.lng }; });
      }else{
        pickMarker.setLatLng([latlng.lat, latlng.lng]);
      }
      if(pan) pickMap.setView([latlng.lat, latlng.lng], Math.max(pickMap.getZoom(), 16));
    }
    pickHint.textContent = 'Local marcado. Você pode arrastar o pino para ajustar.';
    pickClear.hidden = false;
  }
  window.resetReportLocation = function(){
    window.reportLocation = null;
    if(pickMarker && pickMap){ pickMap.removeLayer(pickMarker); pickMarker = null; }
    if(pickMap) pickMap.setView([CITY.lat, CITY.lng], CITY.zoom);
    pickHint.textContent = DEFAULT_HINT;
    pickClear.hidden = true;
  };

  if(pickEl){
    pickMap = L.map(pickEl, { scrollWheelZoom: false }).setView([CITY.lat, CITY.lng], CITY.zoom);
    tiles().addTo(pickMap);
    pickMap.on('click', (e) => setPicker(e.latlng, false));
    document.getElementById('pickLocate').addEventListener('click', () => locate(p => setPicker(p, true)));
    pickClear.addEventListener('click', () => window.resetReportLocation());
  }

  window.refreshMap = function(){ renderMarkers(); renderSide(); };
  renderMarkers();
  renderSide();

  const fixSizes = () => { map.invalidateSize(); if(pickMap) pickMap.invalidateSize(); };
  window.addEventListener('load', fixSizes);
  setTimeout(fixSizes, 400);
})();
