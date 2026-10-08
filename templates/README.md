# Cómo editar esta web

Los archivos `.html` de la raíz (`index.html`, `que-hacemos.html`, etc.) ya
**no se editan a mano**. Se generan automáticamente a partir de:

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
final siempre se genera en la raíz del sitio con su nombre de archivo
(por ejemplo `pages/que-hacemos/ayuda-profesional/ayuda-profesional.html`
genera `ayuda-profesional.html` en la raíz). **Las URLs públicas de la web
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
    sensibilizacion/                (frente "Sensibilización")
      sensibilizacion.html  proyecto-contigo.html
      proyecto-jornada-cancer-mama.html
      proyecto-jornada-cancer-ginecologico.html
      proyecto-yo-me-muevo.html  proyecto-espacio-cuerpo.html
    investigacion/                  (frente "Sensibilización")
      investigacion.html  proyecto-marcha-por-la-salud.html
  hablando-de-cancer/
    hablando-de-cancer.html  linfedema.html
    aspectos-sociales.html  aspectos-psicologicos.html
    aspectos-generales/
      aspectos-generales.html  concepto.html
      itinerario-diagnostico.html  planteamiento-terapeutico.html
    cancer-de-mama/
      cancer-de-mama.html  anatomia.html  factores-asociados.html
      sintomas.html  diagnostico.html  tratamiento.html
      prevencion-diagnostico-precoz.html
    cancer-ginecologico/
      cancer-ginecologico.html  anatomia-genital.html
      cancer-por-localizacion.html
      prevencion-diagnostico-precoz-ginecologico.html
  como-ayudar/
    como-ayudar.html  como-ayudar-difunde.html
    como-ayudar-socias.html  como-ayudar-voluntaria.html
```

## Para cambiar el navbar o el footer

Edita **una sola vez** `templates/navbar.html` o `templates/footer.html` y
vuelve a generar el sitio:

```bash
python scripts/build.py
```

Esto regenera todos los archivos `.html` de la raíz, y borra cualquier
`.html` de la raíz que ya no tenga una página fuente en `pages/` (por
ejemplo, si borras o renombras una página). Haz commit tanto de la
plantilla como de los `.html` regenerados.

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

Después de editar, ejecuta `python scripts/build.py` para regenerar.

## Para crear una página nueva

1. Crea el archivo dentro de la subcarpeta de `pages/` que corresponda a su
   sección (o crea una subcarpeta nueva si es un grupo nuevo de páginas),
   con el bloque de metadatos + contenido.
2. Ejecuta `python scripts/build.py` — generará la página en la raíz
   automáticamente, con el mismo nombre de archivo.
3. Enlaza a ella desde donde corresponda (navbar si es una sección
   principal, o desde la página que la mencione).

## Cosas que el build hace solo

`scripts/build.py` añade automáticamente, en cada página:

- **Etiquetas para compartir** (WhatsApp, Facebook): título, descripción e
  imagen `img/compartir.jpg`. Usan la dirección pública definida en
  `SITE_URL`, al principio de `build.py`; si la web pasa a un dominio
  propio, cambia solo esa línea.
- **Enlaces al glosario**: en las páginas de Hablando de cáncer, la primera
  aparición de cada término del glosario se enlaza a su definición. Los
  términos se leen de `pages/hablando-de-cancer/glosario.html`: añadir una
  definición nueva basta para que se enlace.
- **Aviso de pestaña nueva**: todo enlace con `target="_blank"` recibe un
  aviso para lectores de pantalla (el icono ↗ lo pone el CSS).
- **Página 404**: `pages/404.html` se publica con una etiqueta `<base>`
  para que funcione en cualquier ruta inexistente.

La hoja de estilos incluye además una versión para imprimir (sección 19).

## Requisitos

Solo hace falta Python 3 (sin librerías adicionales). No se necesita Node,
Ruby ni ningún paso de build en el hosting: los archivos `.html` generados
se suben tal cual, exactamente igual que antes.
