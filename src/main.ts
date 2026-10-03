type ModalId = 'modal-solicitar' | 'modal-proponer';
type FormField = readonly [label: string, name: string];

interface Particle {
  x: number; y: number; radius: number; color: string; speedX: number; speedY: number;
  opacity: number; isPetal: boolean; angle: number; spin: number;
}


const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let modalReturnFocus: HTMLElement | null = null;

const tabContent: Record<number, string> = {
  1: `<div>
    <span class="leading-relaxed">Infórmate sobre la convocatoria institucional de Servicio Social y participa en proyectos comunitarios con propósito.</span>
    <div class="mt-3 text-xs font-bold text-coral bg-coral/10 p-3 rounded-2xl border border-coral/20 flex items-start gap-2">
      <i class="fa-solid fa-circle-info text-coral text-sm mt-0.5" aria-hidden="true"></i>
      <span><strong>Aviso oficial:</strong> Para acreditar Servicio Social es indispensable esperar la convocatoria institucional que se habilita al inicio de cada semestre.</span>
    </div>
  </div>`,
  2: 'Te invitamos a actividades institucionales con créditos complementarios; los requisitos, el cupo y la validación dependen de cada convocatoria.',
  3: 'Desarrolla habilidades blandas indispensables: trabajo en equipo, resolución de problemas y conciencia ciudadana.',
};

function byId<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

function initParticles(): void {
  const canvas = byId<HTMLCanvasElement>('hero-particles');
  const context = canvas?.getContext('2d');
  const parent = canvas?.parentElement;
  if (!canvas || !context || !parent || reducedMotion.matches) return;

  let width = 0;
  let height = 0;
  let resizeTimer = 0;
  const resize = (): void => {
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
  };
  resize();
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 150);
  }, { passive: true });

  const particles: Particle[] = Array.from({ length: 14 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.5 + 1,
    color: Math.random() > 0.5 ? '#E05A36' : Math.random() > 0.5 ? '#E8B13B' : '#14332A',
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -Math.random() * 0.4 - 0.15,
    opacity: Math.random() * 0.4 + 0.2,
    isPetal: Math.random() > 0.6,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.015,
  }));

  const animate = (): void => {
    context.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.angle += particle.spin;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      context.save();
      context.globalAlpha = particle.opacity;
      context.translate(particle.x, particle.y);
      context.rotate(particle.angle);
      context.fillStyle = particle.color;
      context.beginPath();
      if (particle.isPetal) context.ellipse(0, 0, particle.radius * 2.2, particle.radius * 1.1, 0, 0, Math.PI * 2);
      else context.arc(0, 0, particle.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
    window.requestAnimationFrame(animate);
  };
  animate();
}

function initRevealAnimations(): void {
  const revealItems = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add('active'));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        currentObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  revealItems.forEach((item) => observer.observe(item));
}

function initSectionNavigation(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(
    'header nav a[href^="#"], .mobile-dock a[href^="#"]',
  ));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
  if (links.length === 0 || sections.length === 0) return;

  const setCurrentSection = (id: string): void => {
    for (const link of links) {
      const linkId = link.hash === '#top' ? 'nosotros' : link.hash.slice(1);
      if (linkId === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  let animationFrame = 0;
  const updateCurrentSection = (): void => {
    animationFrame = 0;
    const header = document.querySelector<HTMLElement>('header');
    const marker = Math.max((header?.offsetHeight ?? 0) + 24, window.innerHeight * 0.35);
    let currentSection = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top > marker) break;
      currentSection = section;
    }
    setCurrentSection(currentSection.id);
  };
  const scheduleSectionUpdate = (): void => {
    if (animationFrame !== 0) return;
    animationFrame = window.requestAnimationFrame(updateCurrentSection);
  };

  window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
  window.addEventListener('resize', scheduleSectionUpdate, { passive: true });
  scheduleSectionUpdate();

  for (const link of links) {
    link.addEventListener('click', () => {
      const id = link.hash === '#top' ? 'nosotros' : link.hash.slice(1);
      const target = document.getElementById(id);
      if (!target || reducedMotion.matches) return;
      target.classList.remove('section-arrival');
      void target.offsetWidth;
      target.classList.add('section-arrival');
      window.setTimeout(() => target.classList.remove('section-arrival'), 1000);
    });
  }
}

function showToast(title: string, message: string): void {
  const toast = byId('toast');
  const titleElement = byId('toast-title');
  const messageElement = byId('toast-message');
  if (!toast || !titleElement || !messageElement) return;
  titleElement.textContent = title;
  messageElement.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0');
  window.setTimeout(() => toast.classList.add('translate-y-24', 'opacity-0'), 4200);
}

function openModal(id: ModalId): void {
  const modal = byId<HTMLDivElement>(id);
  if (!modal) return;
  modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.inert = false;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.remove('opacity-0', 'pointer-events-none');
  const content = modal.querySelector('.modal-content');
  content?.classList.remove('scale-95', 'opacity-0');
  content?.classList.add('scale-100', 'opacity-100');
  modal.querySelector<HTMLElement>('input, textarea, button:not([disabled])')?.focus();
}

function closeModal(id: ModalId): void {
  const modal = byId<HTMLDivElement>(id);
  if (!modal) return;
  const content = modal.querySelector('.modal-content');
  content?.classList.remove('scale-100', 'opacity-100');
  content?.classList.add('scale-95', 'opacity-0');
  window.setTimeout(() => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    modalReturnFocus?.focus();
    modalReturnFocus = null;
  }, 200);
}

function initModalKeyboardSupport(): void {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    const modal = document.querySelector<HTMLDivElement>('.modal[aria-hidden="false"]');
    if (!modal) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal(modal.id as ModalId);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(modal.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])',
    ));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function switchTab(index: number): void {
  const content = tabContent[index];
  const selectedButton = byId<HTMLButtonElement>(`tab-${index}`);
  const contentBox = byId('tab-content');
  if (!content || !selectedButton || !contentBox) return;
  document.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach((button) => {
    const selected = button === selectedButton;
    button.classList.toggle('active-tab', selected);
    button.classList.toggle('text-forest/60', !selected);
    button.setAttribute('aria-selected', String(selected));
  });
  contentBox.setAttribute('aria-labelledby', selectedButton.id);
  contentBox.style.opacity = '0';
  window.setTimeout(() => {
    contentBox.innerHTML = content;
    contentBox.style.opacity = '1';
  }, 180);
}

function copyEmail(): void {
  const email = 'lincesporelservicio@itcelaya.edu.mx';
  if (!navigator.clipboard?.writeText) {
    showToast('Correo electrónico', email);
    return;
  }
  void navigator.clipboard.writeText(email)
    .then(() => showToast('¡Correo copiado!', email))
    .catch(() => showToast('Correo electrónico', email));
}

function handleFormSubmit(event: SubmitEvent, modalId: ModalId): void {
  event.preventDefault();
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement) || !form.reportValidity() || form.dataset.submitting === 'true') return;
  const values = new FormData(form);
  const support = modalId === 'modal-solicitar';
  const organization = String(values.get(support ? 'organizacion' : 'entidad') ?? '').replace(/[\r\n]+/g, ' ').trim();
  const subject = support ? 'Solicitud de apoyo comunitario' : 'Propuesta de colaboración';
  const fields: readonly FormField[] = support
    ? [['Organización / Comunidad', 'organizacion'], ['Persona de contacto', 'contacto'], ['Teléfono', 'telefono'], ['Correo', 'correo'], ['Descripción', 'descripcion']]
    : [['Institución / Colectivo', 'entidad'], ['Idea o proyecto', 'propuesta'], ['Contacto', 'contacto'], ['Correo', 'correo']];
  const body = fields.map(([label, name]) => `${label}: ${String(values.get(name) ?? '').trim()}`).join('\n');
  const recipient = 'lincesporelservicio@itcelaya.edu.mx';
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(`${subject}${organization ? ` — ${organization}` : ''}`)}&body=${encodeURIComponent(body)}`;
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  form.dataset.submitting = 'true';
  if (submitButton) submitButton.disabled = true;
  showToast('Borrador preparado', 'Revisa el correo y envíalo desde tu aplicación. Este sitio no guarda la solicitud.');
  closeModal(modalId);
  window.location.href = mailto;
  form.reset();
  window.setTimeout(() => {
    form.dataset.submitting = 'false';
    if (submitButton) submitButton.disabled = false;
  }, 1500);
}

Object.assign(window, { openModal, closeModal, switchTab, copyEmail, handleFormSubmit });

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initRevealAnimations();
  initSectionNavigation();
  initModalKeyboardSupport();
});
