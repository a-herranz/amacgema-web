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
    // El icono (rayas o X) lo dibuja el CSS a partir de aria-expanded.
    var cerrarMenuMovil = function () {
      navPrincipal.classList.remove('menu-abierto');
      botonMenuMovil.setAttribute('aria-expanded', 'false');
    };

    botonMenuMovil.addEventListener('click', function () {
      var abierto = navPrincipal.classList.toggle('menu-abierto');
      botonMenuMovil.setAttribute('aria-expanded', abierto);
    });

    // Si la ventana pasa a tamaño de escritorio con el panel abierto
    // (p. ej. al girar una tablet), se cierra para no dejarlo "forzado
    // abierto" por el estilo de móvil.
    window.addEventListener('resize', function () {
      // Mismo punto de ruptura que el menú en styles.css (sección 16)
      if (window.innerWidth > 1024) {
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

  // Enlaces de correo preparados: si el ordenador no tiene un programa de
  // correo configurado (muy habitual con Gmail o Outlook en el navegador),
  // pulsar un mailto: no hace nada. Si al segundo y medio la página no ha
  // perdido el foco (señal de que no se abrió nada), se muestra un aviso con
  // la dirección y se copia al portapapeles.
  var DIRECCION_CORREO = 'amacgema@gmail.com';
  var avisoCorreo = null;
  var mostrarAvisoCorreo = function () {
    if (!avisoCorreo) {
      avisoCorreo = document.createElement('div');
      avisoCorreo.className = 'aviso-correo';
      avisoCorreo.setAttribute('role', 'status');
      document.body.appendChild(avisoCorreo);
    }
    var copiada = false;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(DIRECCION_CORREO).then(function () { copiada = true; }, function () {});
    }
    avisoCorreo.innerHTML = '<p>¿No se ha abierto tu correo? Escríbenos a <strong>' + DIRECCION_CORREO +
      '</strong><span class="aviso-correo-copiado"></span>.</p>' +
      '<button type="button" class="aviso-correo-cerrar">Cerrar</button>';
    avisoCorreo.querySelector('.aviso-correo-cerrar').addEventListener('click', function () {
      avisoCorreo.classList.remove('visible');
    });
    setTimeout(function () {
      if (copiada) {
        avisoCorreo.querySelector('.aviso-correo-copiado').textContent = ' (ya la hemos copiado: solo tienes que pegarla)';
      }
    }, 200);
    avisoCorreo.classList.add('visible');
  };
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      var seFue = false;
      var alSalir = function () { seFue = true; };
      window.addEventListener('blur', alSalir, { once: true });
      document.addEventListener('visibilitychange', alSalir, { once: true });
      setTimeout(function () {
        window.removeEventListener('blur', alSalir);
        document.removeEventListener('visibilitychange', alSalir);
        if (!seFue && document.visibilityState === 'visible') {
          mostrarAvisoCorreo();
        }
      }, 1500);
    });
  });

  // Publicaciones de Facebook (página de Contacto): el widget instala
  // cookies de Meta, así que solo se carga cuando la persona lo pide.
  var botonFacebook = document.querySelector('.cargar-facebook');
  if (botonFacebook) {
    botonFacebook.addEventListener('click', function () {
      var caja = document.getElementById('facebook-publicaciones');
      caja.innerHTML =
        '<div id="fb-root"></div>' +
        '<div class="fb-page" data-href="https://www.facebook.com/amac.gema/"' +
        ' data-tabs="timeline" data-width="340" data-height="400"' +
        ' data-small-header="true" data-adapt-container-width="true"' +
        ' data-hide-cover="false" data-show-facepile="false"></div>';
      var sdk = document.createElement('script');
      sdk.async = true;
      sdk.defer = true;
      sdk.crossOrigin = 'anonymous';
      sdk.src = 'https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v19.0';
      document.body.appendChild(sdk);
      // El botón desaparece al sustituir el contenido: el foco pasa a la caja
      // para que quien navega con teclado no lo pierda.
      caja.focus();
    });
  }

  // Submenú de sección: en móvil la barra es más ancha que la pantalla.
  // Se desplaza sola hasta la página actual (que si no podría quedar fuera
  // de la vista) y marca con una clase en qué lados quedan más opciones,
  // para que el CSS muestre un degradado como pista de que se puede deslizar.
  var barraSubnav = document.querySelector('.subnav .contenedor');
  if (barraSubnav) {
    var actualSubnav = barraSubnav.querySelector('[aria-current="page"]');
    var marcarDesplazamiento = function () {
      var resto = barraSubnav.scrollWidth - barraSubnav.clientWidth - barraSubnav.scrollLeft;
      barraSubnav.parentElement.classList.toggle('subnav-hay-mas', resto > 4);
      barraSubnav.parentElement.classList.toggle('subnav-hay-antes', barraSubnav.scrollLeft > 4);
    };
    // Se desplaza solo lo justo para que la página actual quede a la vista
    // (con un margen para que no quede bajo el degradado). Si ya cabe, no
    // se mueve: así la ruta del principio ("Qué hacemos ›") sigue visible.
    var mostrarActual = function () {
      if (actualSubnav) {
        var margen = 48;
        var caja = barraSubnav.getBoundingClientRect();
        var item = actualSubnav.getBoundingClientRect();
        if (item.right > caja.right - margen) {
          barraSubnav.scrollLeft += item.right - (caja.right - margen);
        } else if (item.left < caja.left + margen) {
          barraSubnav.scrollLeft -= (caja.left + margen) - item.left;
        }
      }
      marcarDesplazamiento();
    };
    mostrarActual();
    // La tipografía web llega después y ensancha las pastillas: se recalcula.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(mostrarActual);
    }
    window.addEventListener('load', mostrarActual);
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

  // Añade el desplegable de "Hablando de cáncer" con sus categorías.
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
      '<li><a href="me-acaban-de-diagnosticar.html">Primeros pasos</a></li>' +
      '<li><a href="aspectos-generales.html">Aspectos generales</a></li>' +
      '<li><a href="cancer-de-mama.html">Cáncer de mama</a></li>' +
      '<li><a href="cancer-ginecologico.html">Cáncer ginecológico</a></li>' +
      '<li><a href="linfedema.html">Linfedema</a></li>' +
      '<li><a href="aspectos-sociales.html">Aspectos sociales</a></li>' +
      '<li><a href="aspectos-psicologicos.html">Aspectos psicológicos</a></li>' +
      '<li><a href="despues-del-tratamiento.html">Después del tratamiento</a></li>' +
      '<li><a href="mujeres-jovenes.html">Mujeres jóvenes</a></li>' +
      '<li><a href="sexualidad.html">Sexualidad</a></li>' +
      '<li><a href="alimentacion-y-ejercicio.html">Alimentación y ejercicio</a></li>' +
      '<li><a href="familiares.html">Si eres familiar</a></li></ul>'
    );

    // Marca como activa la categoría a la que pertenece la página actual,
    // aunque estemos en una subpágina (p. ej. concepto.html pertenece a
    // Aspectos generales; sintomas.html pertenece a Cáncer de mama).
    var categoriasHablando = {
      'aspectos-generales.html': ['aspectos-generales.html', 'concepto.html', 'itinerario-diagnostico.html', 'planteamiento-terapeutico.html'],
      'me-acaban-de-diagnosticar.html': ['me-acaban-de-diagnosticar.html'],
      'cancer-de-mama.html': ['cancer-de-mama.html', 'sintomas.html', 'diagnostico.html', 'tratamiento.html', 'cancer-de-mama-avanzado.html', 'prevencion-diagnostico-precoz.html'],
      'cancer-ginecologico.html': ['cancer-ginecologico.html', 'cancer-de-ovario.html', 'cancer-de-endometrio.html', 'cancer-de-cervix.html', 'cancer-de-vulva-y-vagina.html', 'prevencion-diagnostico-precoz-ginecologico.html'],
      'linfedema.html': ['linfedema.html'],
      'aspectos-sociales.html': ['aspectos-sociales.html'],
      'aspectos-psicologicos.html': ['aspectos-psicologicos.html'],
      'despues-del-tratamiento.html': ['despues-del-tratamiento.html'],
      'mujeres-jovenes.html': ['mujeres-jovenes.html'],
      'sexualidad.html': ['sexualidad.html'],
      'alimentacion-y-ejercicio.html': ['alimentacion-y-ejercicio.html'],
      'familiares.html': ['familiares.html']
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

  // Tríptico: cada cara mide lo mismo que el papel (297 mm = 1122,5 px). Si
  // la ventana es más estrecha, se reduce la hoja entera con «zoom», para
  // que se vea igual que impresa en vez de apretar el texto.
  var triptico = document.querySelector('.triptico');
  if (triptico) {
    var carasTriptico = triptico.querySelectorAll('.triptico-cara');
    var ajustarTriptico = function () {
      var estilo = window.getComputedStyle(triptico);
      var disponible = triptico.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight);
      var escala = Math.min(1, disponible / 1122.5);
      carasTriptico.forEach(function (cara) {
        cara.style.zoom = escala;
      });
    };
    ajustarTriptico();
    window.addEventListener('resize', ajustarTriptico);
  }

  // Galería (Agenda): al pulsar una miniatura se abre la foto grande en un
  // visor, con anterior/siguiente (también con las flechas del teclado),
  // Escape o un clic fuera para cerrar. Sin JavaScript, o en navegadores sin
  // <dialog>, el enlace abre la foto grande sin más.
  var fotosGaleria = Array.prototype.slice.call(document.querySelectorAll('.galeria-foto'));
  if (fotosGaleria.length && typeof HTMLDialogElement === 'function') {
    var visor = document.createElement('dialog');
    visor.className = 'visor';
    visor.setAttribute('aria-label', 'Foto ampliada');
    visor.innerHTML =
      '<figure><img alt=""><figcaption class="visor-pie"></figcaption></figure>' +
      '<button class="visor-boton visor-cerrar" type="button" aria-label="Cerrar">×</button>' +
      '<button class="visor-boton visor-anterior" type="button" aria-label="Foto anterior">‹</button>' +
      '<button class="visor-boton visor-siguiente" type="button" aria-label="Foto siguiente">›</button>';
    document.body.appendChild(visor);
    var imagenVisor = visor.querySelector('img');
    var pieVisor = visor.querySelector('.visor-pie');
    var fotoActual = 0;

    var mostrarFoto = function (indice) {
      fotoActual = (indice + fotosGaleria.length) % fotosGaleria.length;
      var enlace = fotosGaleria[fotoActual];
      imagenVisor.src = enlace.getAttribute('href');
      imagenVisor.alt = enlace.querySelector('img').alt;
      pieVisor.textContent = enlace.getAttribute('data-pie');
      var destino = enlace.getAttribute('data-enlace');
      if (destino) {
        var masInfo = document.createElement('a');
        masInfo.href = destino;
        masInfo.textContent = destino.indexOf('instagram.com') !== -1 ? 'Ver en Instagram' : 'Más información';
        if (destino.indexOf('http') === 0) {
          masInfo.target = '_blank';
          masInfo.rel = 'noopener noreferrer';
        }
        pieVisor.appendChild(document.createTextNode(' · '));
        pieVisor.appendChild(masInfo);
      }
    };

    fotosGaleria.forEach(function (enlace, indice) {
      enlace.addEventListener('click', function (evento) {
        evento.preventDefault();
        mostrarFoto(indice);
        visor.showModal();
      });
    });
    visor.querySelector('.visor-cerrar').addEventListener('click', function () { visor.close(); });
    visor.querySelector('.visor-anterior').addEventListener('click', function () { mostrarFoto(fotoActual - 1); });
    visor.querySelector('.visor-siguiente').addEventListener('click', function () { mostrarFoto(fotoActual + 1); });
    visor.addEventListener('keydown', function (evento) {
      if (evento.key === 'ArrowLeft') { mostrarFoto(fotoActual - 1); }
      if (evento.key === 'ArrowRight') { mostrarFoto(fotoActual + 1); }
    });
    // Un clic en el fondo oscuro (fuera de la foto y los botones) cierra
    visor.addEventListener('click', function (evento) {
      if (evento.target === visor) { visor.close(); }
    });
    if (fotosGaleria.length === 1) {
      visor.querySelector('.visor-anterior').hidden = true;
      visor.querySelector('.visor-siguiente').hidden = true;
    }
  }

  // Botones «Imprimir» (folleto Primeros pasos y páginas de Hablando de
  // cáncer). Los de Hablando llegan ocultos: sin JavaScript no harían nada.
  document.querySelectorAll('[data-imprimir]').forEach(function (boton) {
    boton.hidden = false;
    boton.addEventListener('click', function () {
      window.print();
    });
  });

  // Guías por opciones ([data-guia]): una fila de botones y un panel por
  // opción; solo se ve el panel elegido. Sin JavaScript los botones no
  // aparecen y se leen todos los paneles seguidos; al imprimir salen todos.
  // Un enlace a algo que está dentro de un panel (#anclas, el índice) lo abre.
  var guias = document.querySelectorAll('[data-guia]');
  var abrirPanel = function (guia, id, guardar) {
    guia.querySelectorAll('[data-guia-boton]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-guia-boton') === id ? 'true' : 'false');
    });
    guia.querySelectorAll('[data-guia-panel]').forEach(function (p) {
      p.hidden = p.getAttribute('data-guia-panel') !== id;
    });
    var aviso = guia.querySelector('.guia-sin-elegir');
    if (aviso) aviso.hidden = !!id;
    if (guardar) {
      try {
        localStorage.setItem('amacgema-guia-' + guia.getAttribute('data-guia'), id);
      } catch (e) { /* sin almacenamiento: se elige de nuevo en cada visita */ }
    }
  };
  var abrirDesdeAncla = function () {
    if (!location.hash) return false;
    var destino = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    var panel = destino && destino.closest('[data-guia-panel]');
    if (!panel) return false;
    abrirPanel(panel.closest('[data-guia]'), panel.getAttribute('data-guia-panel'), false);
    destino.scrollIntoView();
    return true;
  };
  guias.forEach(function (guia) {
    var botones = guia.querySelector('.guia-botones');
    botones.hidden = false;
    var elegido = guia.getAttribute('data-guia-inicial') || '';
    try {
      var recordado = localStorage.getItem('amacgema-guia-' + guia.getAttribute('data-guia'));
      if (recordado && guia.querySelector('[data-guia-panel="' + recordado + '"]')) elegido = recordado;
    } catch (e) { /* sin almacenamiento */ }
    abrirPanel(guia, elegido, false);
    botones.addEventListener('click', function (e) {
      var boton = e.target.closest('[data-guia-boton]');
      if (boton) abrirPanel(guia, boton.getAttribute('data-guia-boton'), true);
    });
  });
  if (guias.length) {
    abrirDesdeAncla();
    window.addEventListener('hashchange', abrirDesdeAncla);
  }

  // Desplegables (<details class="desplegable">): «Abrir todos», un enlace
  // del índice abre el apartado al que lleva, y al imprimir salen abiertos.
  var desplegables = document.querySelectorAll('details.desplegable');
  if (desplegables.length) {
    var abrirTodo = document.querySelector('[data-abrir-todo]');
    if (abrirTodo) {
      abrirTodo.hidden = false;
      abrirTodo.addEventListener('click', function () {
        var abrir = abrirTodo.textContent === 'Abrir todos';
        desplegables.forEach(function (d) { d.open = abrir; });
        abrirTodo.textContent = abrir ? 'Cerrar todos' : 'Abrir todos';
      });
    }
    var abrirDesplegable = function () {
      if (!location.hash) return;
      var destino = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      var d = destino && destino.closest('details.desplegable');
      if (d) {
        d.open = true;
        destino.scrollIntoView();
      }
    };
    abrirDesplegable();
    window.addEventListener('hashchange', abrirDesplegable);
    var cerradosAlImprimir = [];
    window.addEventListener('beforeprint', function () {
      cerradosAlImprimir = Array.prototype.filter.call(desplegables, function (d) { return !d.open; });
      cerradosAlImprimir.forEach(function (d) { d.open = true; });
    });
    window.addEventListener('afterprint', function () {
      cerradosAlImprimir.forEach(function (d) { d.open = false; });
    });
  }

  // Listas para marcar e imprimir ([data-lista-marcable]: Después del
  // tratamiento, Linfedema). Varias cajas con el mismo nombre forman una
  // sola lista y una sola hoja. Lo marcado se guarda en este navegador.
  var cajasMarcables = document.querySelectorAll('[data-lista-marcable]');
  if (cajasMarcables.length) {
    var nombresListas = {};
    cajasMarcables.forEach(function (c) {
      nombresListas[c.getAttribute('data-lista-marcable')] = true;
    });
    Object.keys(nombresListas).forEach(function (nombre) {
      var cajas = document.querySelectorAll('[data-lista-marcable="' + nombre + '"]');
      var clave = 'amacgema-lista-' + nombre;
      var marcadas = [];
      try {
        marcadas = JSON.parse(localStorage.getItem(clave)) || [];
      } catch (e) { /* sin almacenamiento */ }
      var todas = function () {
        var lista = [];
        cajas.forEach(function (c) {
          lista = lista.concat(Array.prototype.slice.call(c.querySelectorAll('input[type="checkbox"]')));
        });
        return lista;
      };
      todas().forEach(function (c) {
        c.checked = marcadas.indexOf(c.value) !== -1;
        c.addEventListener('change', function () {
          var valores = todas().filter(function (x) { return x.checked; }).map(function (x) { return x.value; });
          try {
            localStorage.setItem(clave, JSON.stringify(valores));
          } catch (e) { /* sin almacenamiento */ }
        });
      });
      var pie = cajas[cajas.length - 1].querySelector('.lista-marcable-pie');
      if (!pie) return;
      pie.hidden = false;
      pie.querySelector('[data-lista-imprimir]').addEventListener('click', function () {
        var hayMarcadas = todas().some(function (x) { return x.checked; });
        // Con data-hoja-notas, la hoja es para llevar a la consulta: fecha,
        // líneas bajo cada punto para apuntar la respuesta y sitio al final
        var conNotas = cajas[0].hasAttribute('data-hoja-notas');
        var html = '<p class="sobrelinea">' + document.querySelector('h1').textContent + '</p>'
          + '<h2>' + (cajas[0].getAttribute('data-hoja-titulo') || '') + '</h2>'
          + (conNotas ? '<p class="hoja-fecha">Fecha de la consulta: <span></span></p>' : '');
        cajas.forEach(function (caja) {
          caja.querySelectorAll('fieldset').forEach(function (grupo) {
            var titulo = grupo.getAttribute('data-hoja-seccion') || caja.getAttribute('data-hoja-seccion');
            var filas = Array.prototype.filter.call(grupo.querySelectorAll('input[type="checkbox"]'),
              function (x) { return x.checked || !hayMarcadas; });
            if (!filas.length) return;
            html += '<h3>' + titulo + '</h3><ul class="hoja-casillas">';
            filas.forEach(function (x) {
              var div = document.createElement('div');
              div.textContent = x.parentNode.textContent.trim();
              html += '<li>' + div.innerHTML + (conNotas
                ? '<span class="hoja-respuesta"><span class="hoja-respuesta-etiqueta">Lo que me dicen en consulta:</span></span>'
                : '') + '</li>';
            });
            html += '</ul>';
          });
        });
        if (conNotas) {
          html += '<h3>Otras notas de la consulta</h3><span class="hoja-respuesta hoja-respuesta-libre"></span>';
        }
        var hoja = document.createElement('section');
        hoja.className = 'hoja-mi-lista';
        hoja.innerHTML = html;
        document.querySelector('main').appendChild(hoja);
        document.body.classList.add('imprimiendo-lista');
        window.print();
      });
    });
    window.addEventListener('afterprint', function () {
      document.body.classList.remove('imprimiendo-lista');
      var hoja = document.querySelector('.hoja-mi-lista');
      if (hoja) hoja.remove();
    });
  }

  // Filtro del glosario: deja solo los términos (o definiciones) que
  // contienen lo escrito, sin tener en cuenta tildes ni mayúsculas
  var filtroGlosario = document.querySelector('.filtro-glosario');
  if (filtroGlosario) {
    var normalizar = function (texto) {
      return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    };
    var campoFiltro = document.getElementById('filtro-glosario');
    var resultadoFiltro = filtroGlosario.querySelector('.filtro-glosario-resultado');
    var indiceLetras = document.querySelector('.indice-rapido');
    var terminos = Array.prototype.map.call(document.querySelectorAll('.glosario-lista dt'), function (dt) {
      var dd = dt.nextElementSibling;
      return { dt: dt, dd: dd, texto: normalizar(dt.textContent + ' ' + (dd ? dd.textContent : '')) };
    });
    filtroGlosario.hidden = false;
    campoFiltro.addEventListener('input', function () {
      var buscado = normalizar(campoFiltro.value.trim());
      var visibles = 0;
      terminos.forEach(function (t) {
        var ver = !buscado || t.texto.indexOf(buscado) !== -1;
        t.dt.hidden = !ver;
        if (t.dd) t.dd.hidden = !ver;
        if (ver) visibles++;
      });
      document.querySelectorAll('.glosario-lista').forEach(function (dl) {
        var algun = dl.querySelector('dt:not([hidden])');
        dl.hidden = !algun;
        var letra = dl.previousElementSibling;
        if (letra && letra.tagName === 'H2') letra.hidden = !algun;
      });
      if (indiceLetras) indiceLetras.hidden = !!buscado;
      resultadoFiltro.textContent = !buscado ? ''
        : visibles === 0 ? 'No hay ningún término con «' + campoFiltro.value.trim() + '». Prueba con otra palabra o pregúntanos.'
        : visibles === 1 ? '1 término.' : visibles + ' términos.';
    });
  }

  // Guía «Me acaban de diagnosticar»: las casillas marcadas y las preguntas
  // propias se guardan solo en este navegador (localStorage), y «Imprimir
  // mi lista» saca una hoja con lo marcado y sitio para apuntar respuestas.
  var listas = document.querySelectorAll('[data-mi-lista]');
  if (listas.length) {
    var CLAVE_LISTA = 'amacgema-primeros-pasos';
    var guia = listas[0];
    var propias = guia.querySelector('.mi-lista-propias');
    var listaPropias = guia.querySelector('.mi-lista-propias-lista');
    var pieLista = guia.querySelector('.mi-lista-pie');
    var cuenta = guia.querySelector('.mi-lista-cuenta');
    var casillas = function () {
      return document.querySelectorAll('[data-mi-lista] input[type="checkbox"]');
    };

    var leerLista = function () {
      try {
        return JSON.parse(localStorage.getItem(CLAVE_LISTA)) || {};
      } catch (e) {
        return {};
      }
    };

    var guardarLista = function () {
      var datos = { marcadas: [], propias: [] };
      casillas().forEach(function (c) {
        if (c.name === 'propia') {
          datos.propias.push({ texto: c.value, marcada: c.checked });
        } else if (c.checked) {
          datos.marcadas.push(c.name + ':' + c.value);
        }
      });
      try {
        localStorage.setItem(CLAVE_LISTA, JSON.stringify(datos));
      } catch (e) { /* sin almacenamiento: la lista vale para esta visita */ }
      contarLista();
    };

    var contarLista = function () {
      var n = guia.querySelectorAll('input[type="checkbox"]:checked').length;
      cuenta.textContent = n === 0 ? 'Aún no has marcado ninguna pregunta.'
        : n === 1 ? 'Has marcado 1 pregunta.' : 'Has marcado ' + n + ' preguntas.';
    };

    var anadirPropia = function (texto, marcada) {
      var fila = document.createElement('div');
      fila.className = 'mi-lista-propia';
      var etiqueta = document.createElement('label');
      var casilla = document.createElement('input');
      casilla.type = 'checkbox';
      casilla.name = 'propia';
      casilla.value = texto;
      casilla.checked = marcada;
      etiqueta.appendChild(casilla);
      etiqueta.appendChild(document.createTextNode(' ' + texto));
      var quitar = document.createElement('button');
      quitar.type = 'button';
      quitar.className = 'boton-texto';
      quitar.textContent = 'Quitar';
      quitar.setAttribute('aria-label', 'Quitar la pregunta: ' + texto);
      quitar.addEventListener('click', function () {
        fila.remove();
        guardarLista();
      });
      fila.appendChild(etiqueta);
      fila.appendChild(quitar);
      listaPropias.appendChild(fila);
    };

    var guardado = leerLista();
    (guardado.marcadas || []).forEach(function (id) {
      var partes = id.split(':');
      var c = document.querySelector('[data-mi-lista] input[name="' + partes[0] + '"][value="' + partes[1] + '"]');
      if (c) c.checked = true;
    });
    (guardado.propias || []).forEach(function (p) {
      anadirPropia(p.texto, p.marcada);
    });
    propias.hidden = false;
    pieLista.hidden = false;
    contarLista();

    document.addEventListener('change', function (e) {
      if (e.target.closest('[data-mi-lista]')) guardarLista();
    });

    guia.querySelector('.mi-lista-anadir').addEventListener('submit', function (e) {
      e.preventDefault();
      var campo = document.getElementById('pregunta-propia');
      var texto = campo.value.trim();
      if (!texto) return;
      anadirPropia(texto, true);
      campo.value = '';
      campo.focus();
      guardarLista();
    });

    guia.querySelector('[data-mi-lista-borrar]').addEventListener('click', function () {
      if (!window.confirm('¿Quitar todas las marcas y tus preguntas?')) return;
      casillas().forEach(function (c) { c.checked = false; });
      listaPropias.innerHTML = '';
      guardarLista();
    });

    // Hoja para imprimir: si no hay nada marcado, salen todas las preguntas
    var textoCasilla = function (c) {
      return c.parentNode.textContent.trim();
    };
    var bloqueHoja = function (titulo, elementos, conNotas) {
      var html = '<h2>' + titulo + '</h2><ul class="hoja-casillas">';
      elementos.forEach(function (texto) {
        var div = document.createElement('div');
        div.textContent = texto;
        html += '<li>' + div.innerHTML + (conNotas ? '<span class="hoja-notas"></span>' : '') + '</li>';
      });
      return html + '</ul>';
    };

    guia.querySelector('[data-mi-lista-imprimir]').addEventListener('click', function () {
      var todas = Array.prototype.slice.call(guia.querySelectorAll('input[type="checkbox"]'));
      var marcadas = todas.filter(function (c) { return c.checked; });
      var preguntas = (marcadas.length ? marcadas : todas).map(textoCasilla);
      var porGrupo = function (nombre) {
        return Array.prototype.slice.call(
          document.querySelectorAll('[data-mi-lista] input[name="' + nombre + '"]')).map(textoCasilla);
      };
      var hoja = document.createElement('section');
      hoja.className = 'hoja-mi-lista';
      hoja.innerHTML = '<p class="sobrelinea">Me acaban de diagnosticar</p>'
        + bloqueHoja('Mis preguntas para la consulta', preguntas, true)
        + bloqueHoja('Trucos que ayudan', porGrupo('truco'), false)
        + bloqueHoja('En mi carpeta', porGrupo('carpeta'), false);
      document.querySelector('main').appendChild(hoja);
      document.body.classList.add('imprimiendo-lista');
      window.print();
    });

    window.addEventListener('afterprint', function () {
      document.body.classList.remove('imprimiendo-lista');
      var hoja = document.querySelector('.hoja-mi-lista');
      if (hoja) hoja.remove();
    });
  }

  // Buscador (página Buscar): Pagefind trae su propia interfaz, que se
  // traduce sola al español por el lang="es" de la página. Si se llega con
  // ?q=..., por ejemplo desde el formulario de Hablando de cáncer, se
  // lanza esa búsqueda directamente.
  var contenedorBuscador = document.getElementById('buscador');
  if (contenedorBuscador && window.PagefindUI) {
    var buscador = new PagefindUI({
      element: '#buscador',
      showImages: false,
      showSubResults: true,
      autofocus: true
    });
    var consulta = new URLSearchParams(window.location.search).get('q');
    if (consulta) {
      buscador.triggerSearch(consulta);
    }
  }

});