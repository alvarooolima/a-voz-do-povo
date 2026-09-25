// Apresentação em páginas: abre na primeira visita e pode ser reaberta a qualquer momento.
(function(){
  const SEEN_KEY = 'avozdopovo_intro_visto';
  const root = document.getElementById('intro');
  if(!root) return;

  const slides = [...root.querySelectorAll('.intro-slide')];
  const stage = document.getElementById('introStage');
  const prevBtn = document.getElementById('introPrev');
  const nextBtn = document.getElementById('introNext');
  const pageLabel = document.getElementById('introPage');
  const dotsWrap = document.getElementById('introDots');
  const skipBtn = document.getElementById('introSkip');
  const total = slides.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let lastFocus = null;

  function markSeen(){
    try{ localStorage.setItem(SEEN_KEY, '1'); }catch(e){}
  }
  function alreadySeen(){
    try{ return localStorage.getItem(SEEN_KEY) === '1'; }catch(e){ return false; }
  }

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'intro-dot';
    dot.setAttribute('aria-label', 'Página ' + (i + 1) + ' de ' + total);
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function go(index, moveFocus = true){
    const next = Math.max(0, Math.min(total - 1, index));
    const dir = next >= current ? 'forward' : 'back';
    slides.forEach((s, i) => { s.hidden = i !== next; });
    const slide = slides[next];
    slide.classList.remove('is-forward', 'is-back');
    if(!reduceMotion){
      void slide.offsetWidth;
      slide.classList.add(dir === 'forward' ? 'is-forward' : 'is-back');
    }
    current = next;

    pageLabel.textContent = 'Página ' + (current + 1) + ' de ' + total;
    dots.forEach((d, i) => {
      d.classList.toggle('is-current', i === current);
      if(i === current) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
    prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    nextBtn.style.visibility = current === total - 1 ? 'hidden' : 'visible';
    stage.scrollTop = 0;
    if(moveFocus){
      const title = slide.querySelector('h2');
      if(title) title.focus({ preventScroll: true });
    }
  }

  function open(){
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    go(0);
  }

  function close(afterClose){
    markSeen();
    root.hidden = true;
    document.body.style.overflow = '';
    if(lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
    if(typeof afterClose === 'function') afterClose();
  }

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));
  skipBtn.addEventListener('click', () => close());

  root.querySelectorAll('[data-intro-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.introAction;
      close(() => {
        const target = action === 'report' ? 'reportar' : action === 'feed' ? 'mapa' : null;
        if(target) document.getElementById(target).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  });

  document.querySelectorAll('[data-open-intro]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); open(); });
  });

  document.addEventListener('keydown', (e) => {
    if(root.hidden) return;
    if(e.key === 'Escape'){ close(); return; }
    if(e.key === 'ArrowRight'){ go(current + 1); return; }
    if(e.key === 'ArrowLeft'){ go(current - 1); return; }
    if(e.key === 'Tab'){
      const focusable = [...root.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.disabled && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden');
      if(!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if(e.shiftKey && (document.activeElement === first || document.activeElement === root)){
        e.preventDefault(); last.focus();
      }else if(!e.shiftKey && document.activeElement === last){
        e.preventDefault(); first.focus();
      }
    }
  });

  let touchX = null;
  root.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if(touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if(Math.abs(dx) < 60) return;
    go(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  const params = new URLSearchParams(window.location.search);
  if(params.get('intro') === '1'){
    open();
  }else if(!alreadySeen() && !window.location.hash){
    setTimeout(open, 350);
  }
})();
