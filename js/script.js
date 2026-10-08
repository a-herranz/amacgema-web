// Actualiza automáticamente el año del pie de página en todas las páginas
document.addEventListener('DOMContentLoaded', function () {
  var anioSpan = document.getElementById('anio');
  if (anioSpan) {
    anioSpan.textContent = new Date().getFullYear();
  }

  // Menú de hamburguesa en móvil: el botón muestra u oculta el panel del
  // menú principal. En escritorio el botón está oculto por CSS y este
  // código no tiene efecto visible.
  var botonMenuMovil = document.querySelector('.boton-menu-movil');
  var navPrincipal = document.getElementById('menu-principal');
  if (botonMenuMovil && navPrincipal) {
    var iconoMenuMovil = botonMenuMovil.querySelector('.icono-menu-movil');

    var cerrarMenuMovil = function () {
      navPrincipal.classList.remove('menu-abierto');
      botonMenuMovil.setAttribute('aria-expanded', 'false');
      if (iconoMenuMovil) {
        iconoMenuMovil.textContent = '☰';
      }
    };

    botonMenuMovil.addEventListener('click', function () {
      var abierto = navPrincipal.classList.toggle('menu-abierto');
      botonMenuMovil.setAttribute('aria-expanded', abierto);
      if (iconoMenuMovil) {
        iconoMenuMovil.textContent = abierto ? '✕' : '☰';
      }
    });

    // Si la ventana pasa a tamaño de escritorio con el panel abierto
    // (p. ej. al girar una tablet), se cierra para no dejarlo "forzado
    // abierto" por el estilo de móvil.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        cerrarMenuMovil();
      }
    });

    // Cierra con Escape y devuelve el foco al botón, para quien navega
    // con teclado.
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && navPrincipal.classList.contains('menu-abierto')) {
        cerrarMenuMovil();
        botonMenuMovil.focus();
      }
    });
  }

  // Submenú de sección: en móvil la barra es más ancha que la pantalla.
  // Se desplaza sola hasta la página actual (que si no podría quedar fuera
  // de la vista) y marca con una clase en qué lados quedan más opciones,
  // para que el CSS muestre un degradado como pista de que se puede deslizar.
  var barraSubnav = document.querySelector('.subnav .contenedor');
  if (barraSubnav) {
    var actualSubnav = barraSubnav.querySelector('[aria-current="page"]');
    if (actualSubnav) {
      var izquierda = actualSubnav.getBoundingClientRect().left - barraSubnav.getBoundingClientRect().left;
      barraSubnav.scrollLeft += izquierda - (barraSubnav.clientWidth - actualSubnav.offsetWidth) / 2;
    }
    var marcarDesplazamiento = function () {
      var resto = barraSubnav.scrollWidth - barraSubnav.clientWidth - barraSubnav.scrollLeft;
      barraSubnav.parentElement.classList.toggle('subnav-hay-mas', resto > 4);
      barraSubnav.parentElement.classList.toggle('subnav-hay-antes', barraSubnav.scrollLeft > 4);
    };
    marcarDesplazamiento();
    barraSubnav.addEventListener('scroll', marcarDesplazamiento, { passive: true });
    window.addEventListener('resize', marcarDesplazamiento);
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

  // Añade el desplegable de "Hablando de cáncer" con sus 6 categorías.
  var enlaceHablando = document.querySelector('.nav-principal a[href="hablando-de-cancer.html"]');
  if (enlaceHablando) {
    var elementoHablando = enlaceHablando.closest('li');
    var idSubmenuHablando = 'submenu-hablando-de-cancer';
    elementoHablando.classList.add('menu-con-desplegable');
    elementoHablando.insertAdjacentHTML('beforeend',
      '<button class="boton-submenu" type="button" aria-expanded="false" aria-controls="' + idSubmenuHablando + '">' +
      '<span class="sr-only">Abrir submenú de Hablando de cáncer</span><span aria-hidden="true">⌄</span></button>' +
      '<ul class="submenu" id="' + idSubmenuHablando + '">' +
      '<li><a href="hablando-de-cancer.html">Resumen</a></li>' +
      '<li><a href="aspectos-generales.html">Aspectos generales</a></li>' +
      '<li><a href="cancer-de-mama.html">Cáncer de mama</a></li>' +
      '<li><a href="cancer-ginecologico.html">Cáncer ginecológico</a></li>' +
      '<li><a href="linfedema.html">Linfedema</a></li>' +
      '<li><a href="aspectos-sociales.html">Aspectos sociales</a></li>' +
      '<li><a href="aspectos-psicologicos.html">Aspectos psicológicos</a></li></ul>'
    );

    // Marca como activa la categoría a la que pertenece la página actual,
    // aunque estemos en una subpágina (p. ej. concepto.html pertenece a
    // Aspectos generales; sintomas.html pertenece a Cáncer de mama).
    var categoriasHablando = {
      'aspectos-generales.html': ['aspectos-generales.html', 'concepto.html', 'itinerario-diagnostico.html', 'planteamiento-terapeutico.html'],
      'cancer-de-mama.html': ['cancer-de-mama.html', 'anatomia.html', 'factores-asociados.html', 'sintomas.html', 'diagnostico.html', 'tratamiento.html', 'prevencion-diagnostico-precoz.html'],
      'cancer-ginecologico.html': ['cancer-ginecologico.html', 'anatomia-genital.html', 'cancer-por-localizacion.html', 'prevencion-diagnostico-precoz-ginecologico.html'],
      'linfedema.html': ['linfedema.html'],
      'aspectos-sociales.html': ['aspectos-sociales.html'],
      'aspectos-psicologicos.html': ['aspectos-psicologicos.html']
    };
    var paginaActualHablando = window.location.pathname.split('/').pop() || 'index.html';
    var hrefCategoriaActual = null;
    Object.keys(categoriasHablando).forEach(function (href) {
      if (categoriasHablando[href].indexOf(paginaActualHablando) !== -1) {
        hrefCategoriaActual = href;
      }
    });
    if (hrefCategoriaActual) {
      var enlaceCategoriaActual = elementoHablando.querySelector('.submenu a[href="' + hrefCategoriaActual + '"]');
      if (enlaceCategoriaActual) {
        enlaceCategoriaActual.setAttribute('aria-current', 'page');
      }
    }

    var botonSubmenuHablando = elementoHablando.querySelector('.boton-submenu');
    botonSubmenuHablando.addEventListener('click', function () {
      var abiertoHablando = elementoHablando.classList.toggle('submenu-abierto');
      botonSubmenuHablando.setAttribute('aria-expanded', abiertoHablando);
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
      '<li class="submenu-frente">Asistencia a población afectada</li>' +
      '<li><a href="ayuda-profesional.html">Ayuda profesional</a></li>' +
      '<li><a href="ayuda-testimonial.html">Ayuda testimonial</a></li>' +
      '<li><a href="actividades-guiadas.html">Actividades guiadas</a></li>' +
      '<li class="submenu-frente">Sensibilización</li>' +
      '<li><a href="sensibilizacion.html">Educación y divulgación</a></li>' +
      '<li><a href="investigacion.html">Solidaridad e investigación</a></li></ul>'
    );
    var botonSubmenuAyudas = elementoAyudas.querySelector('.boton-submenu');
    botonSubmenuAyudas.addEventListener('click', function () {
      var abiertoAyudas = elementoAyudas.classList.toggle('submenu-abierto');
      botonSubmenuAyudas.setAttribute('aria-expanded', abiertoAyudas);
    });
  }

});