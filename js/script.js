// Actualiza automáticamente el año del pie de página en todas las páginas
document.addEventListener('DOMContentLoaded', function () {
  var anioSpan = document.getElementById('anio');
  if (anioSpan) {
    anioSpan.textContent = new Date().getFullYear();
  }

  // Añade el submenú de "Quiénes somos" de forma coherente en todas las páginas.
  var enlaceQuienes = document.querySelector('.nav-principal a[href="quienes-somos.html"]');
  if (enlaceQuienes) {
    var elementoMenu = enlaceQuienes.closest('li');
    var idSubmenu = 'submenu-quienes-somos';
    elementoMenu.classList.add('menu-con-desplegable');
    elementoMenu.insertAdjacentHTML('beforeend',
      '<button class="boton-submenu" type="button" aria-expanded="false" aria-controls="' + idSubmenu + '">' +
      '<span class="sr-only">Abrir submenú de Quiénes somos</span><span aria-hidden="true">⌄</span></button>' +
      '<ul class="submenu" id="' + idSubmenu + '">' +
      '<li><a href="quienes-somos.html">Resumen</a></li>' +
      '<li><a href="proposito.html">Propósito</a></li>' +
      '<li><a href="historia.html">Historia</a></li>' +
      '<li><a href="sede-social.html">Sede social</a></li>' +
      '<li><a href="estructura.html">Estructura</a></li></ul>'
    );
    var paginaActualQuienes = window.location.pathname.split('/').pop() || 'index.html';
    var enlaceSubmenuActual = elementoMenu.querySelector('.submenu a[href="' + paginaActualQuienes + '"]');
    if (enlaceSubmenuActual) {
      enlaceSubmenuActual.setAttribute('aria-current', 'page');
    }
    var botonSubmenu = elementoMenu.querySelector('.boton-submenu');
    botonSubmenu.addEventListener('click', function () {
      var abierto = elementoMenu.classList.toggle('submenu-abierto');
      botonSubmenu.setAttribute('aria-expanded', abierto);
    });
  }

  // Ofrece acceso directo a cada vía de ayuda desde "Qué hacemos".
  var enlaceQueHacemos = document.querySelector('.nav-principal a[href="que-hacemos.html"]');
  if (enlaceQueHacemos) {
    var elementoAyudas = enlaceQueHacemos.closest('li');
    var idSubmenuAyudas = 'submenu-que-hacemos';
    elementoAyudas.classList.add('menu-con-desplegable');
    elementoAyudas.insertAdjacentHTML('beforeend',
      '<button class="boton-submenu" type="button" aria-expanded="false" aria-controls="' + idSubmenuAyudas + '">' +
      '<span class="sr-only">Abrir submenú de Qué hacemos</span><span aria-hidden="true">⌄</span></button>' +
      '<ul class="submenu" id="' + idSubmenuAyudas + '">' +
      '<li><a href="ayuda-profesional.html">Ayuda profesional</a></li>' +
      '<li><a href="ayuda-testimonial.html">Ayuda testimonial</a></li>' +
      '<li><a href="actividades-guiadas.html">Actividades guiadas</a></li>' +
      '<li><a href="sensibilizacion.html">Educación y divulgación</a></li>' +
      '<li><a href="investigacion.html">Solidaridad e investigación</a></li></ul>'
    );
    var botonSubmenuAyudas = elementoAyudas.querySelector('.boton-submenu');
    botonSubmenuAyudas.addEventListener('click', function () {
      var abiertoAyudas = elementoAyudas.classList.toggle('submenu-abierto');
      botonSubmenuAyudas.setAttribute('aria-expanded', abiertoAyudas);
    });
  }

  // Barra de pestañas con todas las secciones de "Quiénes somos", visible en
  // la propia página (no solo al desplegar el menú), para moverse fácilmente
  // entre Propósito, Historia, Sede social y Gobierno. Se coloca justo debajo
  // del menú principal, antes del título de la página (el hero).
  function insertarSubnav(paginasDelGrupo, enlaces, etiquetaAria) {
    var pagina = window.location.pathname.split('/').pop() || 'index.html';
    if (paginasDelGrupo.indexOf(pagina) === -1) return;

    var hero = document.querySelector('.hero');
    if (!hero || document.querySelector('.subnav')) return;

    var html = '<nav class="subnav" aria-label="' + etiquetaAria + '"><div class="contenedor"><ul>';
    enlaces.forEach(function (enlace) {
      var esActual = enlace.href === pagina;
      html += '<li><a href="' + enlace.href + '"' + (esActual ? ' aria-current="page"' : '') + '>' + enlace.texto + '</a></li>';
    });
    html += '</ul></div></nav>';

    hero.insertAdjacentHTML('beforebegin', html);
  }

  insertarSubnav(
    ['quienes-somos.html', 'proposito.html', 'historia.html', 'sede-social.html', 'estructura.html'],
    [
      { href: 'quienes-somos.html', texto: 'Resumen' },
      { href: 'proposito.html', texto: 'Propósito' },
      { href: 'historia.html', texto: 'Historia' },
      { href: 'sede-social.html', texto: 'Sede social' },
      { href: 'estructura.html', texto: 'Estructura' }
    ],
    'Secciones de Quiénes somos'
  );

  insertarSubnav(
    ['que-hacemos.html', 'ayuda-profesional.html', 'ayuda-testimonial.html', 'actividades-guiadas.html', 'sensibilizacion.html', 'investigacion.html'],
    [
      { href: 'que-hacemos.html', texto: 'Resumen' },
      { href: 'ayuda-profesional.html', texto: 'Ayuda profesional' },
      { href: 'ayuda-testimonial.html', texto: 'Ayuda testimonial' },
      { href: 'actividades-guiadas.html', texto: 'Actividades guiadas' },
      { href: 'sensibilizacion.html', texto: 'Educación y divulgación' },
      { href: 'investigacion.html', texto: 'Solidaridad e investigación' }
    ],
    'Secciones de Qué hacemos'
  );
});
