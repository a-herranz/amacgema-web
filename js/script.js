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
      '<li><a href="proposito.html">Propósito</a></li>' +
      '<li><a href="historia.html">Historia</a></li>' +
      '<li><a href="sede-social.html">Sede social</a></li>' +
      '<li><a href="gobierno.html">Gobierno</a></li></ul>'
    );
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
      '<li><a href="sensibilizacion.html">Sensibilización</a></li>' +
      '<li><a href="investigacion.html">Investigación</a></li></ul>'
    );
    var botonSubmenuAyudas = elementoAyudas.querySelector('.boton-submenu');
    botonSubmenuAyudas.addEventListener('click', function () {
      var abiertoAyudas = elementoAyudas.classList.toggle('submenu-abierto');
      botonSubmenuAyudas.setAttribute('aria-expanded', abiertoAyudas);
    });
  }
});
