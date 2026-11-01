# Cómo cambiar un texto de la web desde el navegador

Esta guía es para cambiar textos sin instalar nada: solo hace falta una
cuenta de GitHub con permiso en el proyecto. Al guardar, la web se
actualiza sola en uno o dos minutos.

## 1. Encontrar la página

Cada página de la web tiene un archivo con el mismo nombre dentro de la
carpeta `pages/`. Para saber el nombre, mira la dirección de la página en
el navegador: si es `.../amacgema-web/linfedema.html`, el archivo es
`linfedema.html`.

1. Entra en el proyecto en GitHub: https://github.com/a-herranz/amacgema-web
2. Pulsa la tecla `t` (o el botón «Go to file») y escribe el nombre del
   archivo, por ejemplo `linfedema`. Elige el que está dentro de `pages/`.

Algunos textos no están en una página sino en piezas comunes a todas:

| Qué quieres cambiar | Archivo |
|---|---|
| Pie de página (dirección, teléfono, redes) | `templates/footer.html` |
| Menú principal | `templates/navbar.html` |
| Texto de los correos que se abren al pulsar «Escríbenos» y similares | `templates/correos.txt` |
| Bloque final «¿Te preocupa algo de lo que acabas de leer?» | `templates/cierre-apoyo.html` |
| Citas de la Agenda | `templates/agenda.txt` (las instrucciones están al principio del archivo) |
| Fotos de la galería (al final de la Agenda) | Sube la foto a la carpeta `galeria/` («Add file» › «Upload files») y descríbela en `templates/galeria.txt` |

## 2. Editar

1. Pulsa el icono del lápiz («Edit this file»), arriba a la derecha.
2. Cambia **solo el texto**, lo que va entre las etiquetas. Por ejemplo, en
   `<p>Lunes a viernes</p>`, cambia «Lunes a viernes» y deja `<p>` y `</p>`
   como están.
3. No toques el bloque del principio entre las dos líneas `---` salvo para
   cambiar el título (`title:`) o la descripción (`description:`) de la
   página.

## 3. Guardar y publicar

1. Pulsa «Commit changes…».
2. En el mensaje, escribe en pocas palabras qué has cambiado, por ejemplo
   «Horario de verano en Contacto».
3. Deja marcada la opción «Commit directly to the main branch» y pulsa
   «Commit changes».

En uno o dos minutos el cambio está en la web. Recarga la página (si no se
ve, prueba con Ctrl + F5).

## 4. Si algo sale mal

Antes de publicar, GitHub comprueba que no haya enlaces rotos ni errores
parecidos. Si encuentra alguno, **no publica nada y la web sigue como
estaba**: no se rompe.

Para saber si se ha publicado, entra en la pestaña «Actions» del proyecto:

- Círculo amarillo: se está publicando, espera un poco.
- Marca verde: publicado.
- Cruz roja: no se ha publicado. Pulsa en ella para ver el error (por
  ejemplo, «enlace roto: linfedma.html», con una errata) y corrígelo
  editando otra vez el archivo. Si no lo entiendes, avisa a quien lleve
  la parte técnica de la web: la web sigue funcionando mientras tanto.

Si te equivocas en un texto, basta con volver a editarlo. GitHub guarda
todas las versiones anteriores (botón «History» de cada archivo).

## 5. Cuando un profesional revise una página médica

Las páginas marcadas como «Contenido elaborado con inteligencia artificial»
necesitan una revisión profesional. Cuando una esté revisada:

1. Edita la página y añade una línea en el bloque del principio, debajo de
   `aviso: ia`, con quién la revisó y cuándo. Por ejemplo:

   ```
   revision: Dra. Nombre Apellido, oncóloga · marzo de 2027
   ```

2. Anota la revisión en el registro del final de `PENDIENTES.md`.

## 6. Lo que es mejor dejar a la parte técnica

Crear o borrar páginas, cambiar el diseño, los menús desplegables o
cualquier cosa de las carpetas `css/`, `js/`, `scripts/` y `.github/`.
