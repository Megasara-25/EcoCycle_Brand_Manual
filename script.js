document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const menu = document.getElementById('menu');
  const toggle = document.getElementById('menuToggle');
  const progress = document.getElementById('progress');
  const toast = document.getElementById('toast');
  let toastTimeout;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  document.addEventListener('scroll', updateScroll, {passive: true});
  updateScroll();
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const hex = button.dataset.copy;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(hex);
        } else {
          const area = document.createElement('textarea');
          area.value = hex;
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          area.select();
          const copied = document.execCommand('copy');
          area.remove();
          if (!copied) throw new Error('Copia no disponible');
        }
        toast.textContent = hex + ' copiado al portapapeles';
      } catch {
        toast.textContent = 'No fue posible copiar automáticamente: ' + hex;
      }
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
    });
  });
});