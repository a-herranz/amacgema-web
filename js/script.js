// Actualiza automáticamente el año del pie de página en todas las páginas
document.addEventListener('DOMContentLoaded', function () {
  var anioSpan = document.getElementById('anio');
  if (anioSpan) {
    anioSpan.textContent = new Date().getFullYear();
  }
});
