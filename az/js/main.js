/* Tecnología e Insumos Rápidos BOL S.R.L. — interacción de la página (sin dependencias) */
(function () {
  'use strict';

  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  // ---- Cabecera: sombra al desplazarse ----
  var cabecera = $('#cabecera');
  var pendiente = false;
  function actualizarCabecera() {
    pendiente = false;
    cabecera.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', function () {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(actualizarCabecera);
  }, { passive: true });
  actualizarCabecera();

  // ---- Menú en celular ----
  var menu = $('#menu');
  var menuBtn = $('.menu-btn');
  function cerrarMenu() {
    menu.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.firstElementChild.textContent = 'Abrir menú';
  }
  menuBtn.addEventListener('click', function () {
    var abierto = menu.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(abierto));
    menuBtn.firstElementChild.textContent = abierto ? 'Cerrar menú' : 'Abrir menú';
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) cerrarMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      cerrarMenu();
      menuBtn.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('is-open') && !e.target.closest('.cabecera')) cerrarMenu();
  });

  // ---- Enlace activo del menú según la sección visible ----
  var enlaces = $$('.menu a');
  var secciones = enlaces
    .map(function (a) { return $(a.getAttribute('href')); })
    .filter(Boolean);

  function marcarActivo(id) {
    enlaces.forEach(function (a) {
      if (id && a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    var obsSecciones = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) marcarActivo(en.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(function (s) { obsSecciones.observe(s); });

    // En el hero no hay ninguna sección del menú activa
    var inicio = $('#inicio');
    if (inicio) {
      new IntersectionObserver(function (entradas) {
        if (entradas[0].isIntersecting) marcarActivo(null);
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(inicio);
    }
  }

  // ---- Rubros: las tarjetas entran una tras otra y los íconos se dibujan al llegar a la sección ----
  var rubros = $('.rubros__lista');
  var conMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (rubros && conMovimiento && 'IntersectionObserver' in window) {
    rubros.classList.add('animar');
    var obsRubros = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      rubros.classList.add('is-visible');
      obsRubros.disconnect();
    }, { rootMargin: '0px 0px -15% 0px' });
    obsRubros.observe(rubros);
  }

  // ---- WhatsApp flotante: elegir a qué departamento escribir ----
  var wa = $('.wa-flotante');
  if (wa) {
    var waBtn = $('.wa-flotante__btn', wa);
    var abrirWa = function (abrir) {
      wa.classList.toggle('is-open', abrir);
      waBtn.setAttribute('aria-expanded', String(abrir));
    };
    waBtn.addEventListener('click', function () {
      abrirWa(!wa.classList.contains('is-open'));
    });
    // Al elegir un número se abre WhatsApp y el menú se cierra
    $$('.wa-flotante__lista a', wa).forEach(function (a) {
      a.addEventListener('click', function () { abrirWa(false); });
    });
    document.addEventListener('click', function (e) {
      if (wa.classList.contains('is-open') && !wa.contains(e.target)) abrirWa(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wa.classList.contains('is-open')) {
        abrirWa(false);
        waBtn.focus();
      }
    });
  }

  // ---- Año del pie ----
  var anio = $('#anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
