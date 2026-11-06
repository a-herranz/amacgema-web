# Cómo editar esta web

> Si no eres técnica y solo quieres cambiar un texto desde el navegador,
> lee mejor [COMO-EDITAR.md](../COMO-EDITAR.md).

La web publicada (`index.html`, `que-hacemos.html`, etc.) **no está en el
repositorio**: la genera `scripts/build.py` en la carpeta `publicar/` (que
git ignora) y GitHub Actions la publica en cada push a `main`. Se genera a
partir de:

- `templates/layout.html` — el esqueleto común de toda página (doctype,
  `<head>`, body, orden de navbar/subnav/contenido/footer).
- `templates/navbar.html` — el menú principal, igual en todas las páginas.
- `templates/footer.html` — el pie de página, igual en todas las páginas.
- `templates/subnav/*.html` — los submenús de sección: cada grupo de
  páginas con un índice y subpáginas (Quiénes somos, Qué hacemos, Ayuda
  profesional, Ayuda testimonial, Educación y divulgación, Solidaridad e
  investigación, Cómo ayudar, y los 3 de "Hablando de cáncer") tiene el suyo.
- `pages/**/*.html` — el contenido propio de cada página (lo que va dentro
  de `<main>`), organizado en subcarpetas por sección.

Importante: las subcarpetas de `pages/` son solo organización interna del
código fuente. Da igual en qué subcarpeta esté un archivo: el resultado
final siempre se genera en la raíz de la web con su nombre de archivo
(por ejemplo `pages/que-hacemos/ayuda-profesional/ayuda-profesional.html`
genera `publicar/ayuda-profesional.html`). **Las URLs públicas de la web
no cambian nunca por mover un archivo dentro de `pages/`.**

## Mapa de pages/

```
pages/
  index.html
  contacto.html
  quienes-somos/
    quienes-somos.html  proposito.html  historia.html
    sede-social.html  estructura.html
  que-hacemos/                    (hub: los 2 frentes de trabajo)
    que-hacemos.html  actividades-guiadas.html
    ayuda-profesional/             (frente "Asistencia a población afectada")
      ayuda-profesional.html
      ayuda-profesional-fisioterapeuta.html
      ayuda-profesional-psicooncologa.html
      ayuda-profesional-trabajadorasocial.html
    ayuda-testimonial/              (frente "Asistencia a población afectada")
      ayuda-testimonial.html
      ayuda-testimonial-acogida.html
      ayuda-testimonial-cafes.html
      ayuda-testimonial-voluntariado.html
      ayuda-testimonial-historias.html
    sensibilizacion/                (frente "Sensibilización")
      sensibilizacion.html  proyecto-contigo.html
      proyecto-jornada-cancer-mama.html
      proyecto-jornada-cancer-ginecologico.html
      proyecto-yo-me-muevo.html
    investigacion/                  (frente "Sensibilización")
      investigacion.html  proyecto-marcha-por-la-salud.html
  hablando-de-cancer/
    hablando-de-cancer.html  me-acaban-de-diagnosticar.html
    linfedema.html  aspectos-sociales.html  aspectos-psicologicos.html
    despues-del-tratamiento.html  mujeres-jovenes.html
    alimentacion-y-ejercicio.html  sexualidad.html  familiares.html
    aspectos-generales/
      aspectos-generales.html  concepto.html
      itinerario-diagnostico.html  planteamiento-terapeutico.html
    cancer-de-mama/
      cancer-de-mama.html
      sintomas.html  diagnostico.html  tratamiento.html
      cancer-de-mama-avanzado.html  prevencion-diagnostico-precoz.html
    cancer-ginecologico/
      cancer-ginecologico.html  cancer-de-ovario.html
      cancer-de-endometrio.html  cancer-de-cervix.html
      cancer-de-vulva-y-vagina.html
      prevencion-diagnostico-precoz-ginecologico.html
  como-ayudar/
    como-ayudar.html  como-ayudar-difunde.html
    como-ayudar-socias.html  como-ayudar-voluntaria.html
    como-ayudar-empresas.html
  legal/
    aviso-legal.html  politica-privacidad.html  politica-cookies.html
  buscar.html  preguntas-frecuentes.html
  404.html
```

## Para cambiar el navbar o el footer

Edita **una sola vez** `templates/navbar.html` o `templates/footer.html`,
haz commit y push: GitHub Actions regenera y publica todas las páginas.

Para ver el resultado antes de subirlo:

```bash
python scripts/build.py
python scripts/comprobar.py
python -m http.server -d publicar
```

y abre http://localhost:8000. `publicar/` se rehace entera en cada build,
así que una página borrada o renombrada en `pages/` desaparece sola.

## Para cambiar el contenido de una página

Busca el archivo en `pages/` (mismo nombre que la página final, en la
subcarpeta de su sección — usa el mapa de arriba). El archivo empieza con
un bloque de metadatos:

```
---
title: Contacto | AMAC-GEMA
description: Ponte en contacto con AMAC-GEMA...
nav: contacto.html
---
<el contenido de la página aquí>
```

- `title` → se vuelca en `<title>` y en la pestaña del navegador.
- `description` → se vuelca en `<meta name="description">` (SEO).
- `nav` → qué enlace del menú principal se marca como activo
  (`aria-current="page"`). Debe ser uno de: `index.html`,
  `quienes-somos.html`, `que-hacemos.html`, `hablando-de-cancer.html`,
  `como-ayudar.html`, `contacto.html`.
- `subnav` (opcional) → si la página pertenece a un grupo con submenú,
  pon el nombre del grupo: `quienes-somos`, `que-hacemos`,
  `ayuda-profesional`, `ayuda-testimonial`, `sensibilizacion`,
  `investigacion`, `como-ayudar`, `aspectos-generales`, `cancer-mama` o
  `cancer-ginecologico` (una por cada archivo de `templates/subnav/`).
  Para añadir una página a un submenú basta con añadir su enlace con
  el token `{{ACTIVE:pagina.html}}` en la plantilla: el build lee la
  lista de enlaces de ahí.
- `aviso: ia` (opcional) → muestra al principio de la página el aviso de
  contenido elaborado con inteligencia artificial
  (`templates/aviso-ia.html`). Toda página redactada con IA debe llevarlo y
  figurar en el registro de revisión de `PENDIENTES.md`.
- `revision` (opcional, junto con `aviso: ia`) → quién revisó la página y
  cuándo, por ejemplo `revision: Dra. Nombre Apellido, oncóloga · marzo de 2027`.
  Sin esta línea, el aviso dice «Pendiente de revisión por un profesional».

### La sección "Qué hacemos" gira en torno a 2 frentes

Todo lo que cuelga de "Qué hacemos" pertenece a uno de dos frentes de
trabajo, y ningún grupo de páginas queda fuera de esa estructura:

- **Asistencia a población afectada** → Ayuda profesional, Ayuda
  testimonial, Actividades guiadas.
- **Sensibilización** → Educación y divulgación (que incluye los
  proyectos de divulgación: Contigo, las Jornadas, Yo me muevo por…, El
  espacio del cuerpo) y Solidaridad e investigación (que incluye la
  Marcha por la Salud).

El submenú de estas páginas muestra la ruta y luego las opciones:
**Qué hacemos › Ayuda profesional › Fisioterapia | Psicooncología | Trabajo
social**. En la página raíz, las opciones son los dos frentes. Todas las
secciones con submenú (Quiénes somos, Hablando de cáncer, Cómo ayudar)
siguen el mismo formato (**Hablando de cáncer › Cáncer de mama ›
Anatomía | Síntomas | …**). En la plantilla, los elementos de ruta llevan
la clase `subnav-nivel`; un enlace auxiliar que no forma parte de la
jerarquía (el glosario) lleva `subnav-aparte` y se alinea a la derecha.

No existe una sección "Proyectos" aparte: cada proyecto vive dentro del
grupo de subnav de la vía a la que pertenece (`sensibilizacion` o
`investigacion`), no en un grupo propio.

Después de editar, haz commit y push (o genera en local para verlo antes).

## Para crear una página nueva

1. Crea el archivo dentro de la subcarpeta de `pages/` que corresponda a su
   sección (o crea una subcarpeta nueva si es un grupo nuevo de páginas),
   con el bloque de metadatos + contenido.
2. Al publicar, el build generará la página en la raíz de la web, con el
   mismo nombre de archivo.
3. Enlaza a ella desde donde corresponda (navbar si es una sección
   principal, o desde la página que la mencione).

## Cosas que el build hace solo

`scripts/build.py` añade automáticamente, en cada página:

- **Etiquetas para compartir** (WhatsApp, Facebook): título, descripción e
  imagen. La portada usa `img/compartir.jpg` (el logo); cada una de las
  demás páginas, una imagen que el build dibuja con Pillow en
  `publicar/img/compartir/` con su sección (la `sobrelinea`), su título y
  el logo. Usan la dirección pública definida en `SITE_URL`, al principio
  de `build.py`; si la web pasa a un dominio propio, cambia solo esa línea.
- **Botón «Imprimir esta página»**: en las páginas de Hablando de cáncer
  (salvo las portadas de sección, `SIN_BOTON_IMPRIMIR`), al final de la
  cabecera. La hoja impresa lleva arriba el nombre y el teléfono de la
  asociación y abajo la dirección de la página y el contacto, en lugar del
  pie de la web.
- **Iconos**: `{{ICONO:nombre}}` mete el dibujo de
  `templates/iconos/nombre.svg` (líneas de 24×24 que toman el color del
  texto). Se usan en las tarjetas de servicios dentro de
  `<div class="icono-tarjeta">`. Para uno nuevo, añade su `.svg` con la
  misma cabecera que los demás.
- **Enlaces al glosario**: en las páginas de Hablando de cáncer, la primera
  aparición de cada término del glosario se enlaza a su definición. Los
  términos se leen de `pages/hablando-de-cancer/glosario.html`: añadir una
  definición nueva basta para que se enlace.
- **Aviso de pestaña nueva**: todo enlace con `target="_blank"` recibe un
  aviso para lectores de pantalla (el icono ↗ lo pone el CSS).
- **Página 404**: `pages/404.html` se publica con una etiqueta `<base>`
  para que funcione en cualquier ruta inexistente.

- **Correos preparados**: los botones del tipo "Solicitar alta como socia" o
  "Solicitar cita de acogida" abren un correo ya redactado, con asunto que
  empieza siempre por `[Web]`. Los textos están en `templates/correos.txt`
  (uno por bloque `[clave]`) y en la página se usa `href="{{CORREO:clave}}"`.
  Para cambiar un asunto o un texto, edita solo ese archivo y recompila; para
  un correo nuevo, añade un bloque y usa su clave. Si una página pide una
  clave que no existe, el build se detiene con un error. Si al pulsar el
  enlace no se abre ningún programa de correo, `js/script.js` muestra un aviso
  con la dirección y la copia al portapapeles.

- **Índice de página**: en una página larga, escribe `{{INDICE}}` donde deba
  ir el índice (normalmente justo después del recuadro "Lo esencial"). El
  build lo sustituye por un índice "En esta página" con todos los `<h2>` que
  vienen detrás, y pone un `id` a los que no lo tengan. No hace falta
  mantener el índice a mano: si añades o cambias un `<h2>`, se actualiza solo.

- **Aviso de datos pendientes**: si una página contiene un
  `<mark class="pendiente">`, el build lo indica al terminar. Se usa en los
  textos legales (`pages/legal/`) para los datos de la asociación que
  faltan por confirmar (NIF, registro, piso o local, plazos de
  conservación): no publiques la web sin rellenarlos.

- **Buscador**: al terminar, el build genera con Pagefind el índice del
  buscador en `publicar/pagefind/`. Solo
  indexa lo que va dentro de `<main>`; para que un bloque no salga en los
  resultados, ponle `data-pagefind-ignore`. La página `buscar.html` y la 404
  no se indexan (`SIN_INDEXAR` en el build).
- **Páginas trasladadas**: si una página se integra en otra o se divide,
  añade su nombre antiguo a `REDIRECCIONES` en `build.py`. El build genera
  una página mínima que lleva a la nueva (incluso según el ancla, como
  `cancer-por-localizacion.html#cancer-ovario`), para no romper enlaces
  guardados ni resultados de Google.
- **Datos para Google**: `sitemap.xml`, `robots.txt` y, solo en la portada,
  la ficha de la asociación en formato schema.org. Si `SITE_URL` deja de ser
  de github.io, el build crea también el archivo `CNAME` del dominio propio.

- **Aviso de revisión pendiente**: el build avisa de cada página con
  `aviso: ia` que aún no tiene `revision:`. En GitHub Actions, el aviso
  aparece en el resumen de cada publicación.

La hoja de estilos incluye además una versión para imprimir (sección 18).
El arco de la «M» del logo aparece, muy suave, en la esquina de las
cabeceras interiores y de los recuadros rosas (`.hero-interior::after` y
`.bloque-rosa::after`).

## Publicación y comprobaciones

`.github/workflows/publicar.yml` se ejecuta en cada push:

1. Genera la web con `scripts/build.py`.
2. La comprueba con `scripts/comprobar.py`: enlaces internos y anclas
   rotos, ids repetidos, imágenes sin `alt` y páginas sin `<title>` o
   `<h1>`. Con un solo error, **no se publica nada** y la web sigue como
   estaba; el error aparece en la pestaña Actions de GitHub.
3. Solo en `main`, publica `publicar/` en GitHub Pages. En otras ramas
   genera y comprueba, sin publicar.

Requisito, una sola vez: en GitHub, Settings › Pages › Source: «GitHub
Actions».

## Requisitos para generar en local

Python 3 (sin librerías adicionales) y, para el índice del buscador,
Node.js (el build usa `npx pagefind`). Sin Node, ejecuta
`python scripts/build.py --sin-buscador`: la web se genera igual, pero el
buscador no funciona en local. Para publicar no hace falta nada de esto:
lo hace GitHub Actions.
