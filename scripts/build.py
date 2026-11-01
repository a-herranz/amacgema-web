"""Genera la web completa en la carpeta publicar/ a partir de templates/ +
pages/ y los archivos estáticos (css/, js/, img/, docs/).

Uso:
    python scripts/build.py                  (web + índice del buscador)
    python scripts/build.py --sin-buscador   (sin Node.js: sin buscador ni QR)

No hace falta ejecutarlo antes de hacer commit: al subir cambios a main,
GitHub Actions (.github/workflows/publicar.yml) lo ejecuta y publica la
carpeta publicar/. En local sirve para ver la web antes de subirla:
    python -m http.server -d publicar
"""
import datetime
import html
import json
import os
import re
import shutil
import subprocess
import sys
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# Dirección pública del sitio, con "/" final. Se usa en las etiquetas para
# compartir (WhatsApp y redes exigen URLs absolutas) y en la página 404.
# Si la web pasa a un dominio propio, cambia solo esta línea.
SITE_URL = "https://a-herranz.github.io/amacgema-web/"

NAV_LINKS = [
    "index.html", "quienes-somos.html", "que-hacemos.html",
    "hablando-de-cancer.html", "como-ayudar.html", "buscar.html", "contacto.html",
]

# Carpeta con la web generada, la única que se publica. Se borra y se
# rehace entera en cada build: nada de lo que hay dentro se edita a mano.
SALIDA = "publicar"

# Carpetas que se copian tal cual a la web publicada
ESTATICOS = ["css", "js", "img", "docs"]

# En GitHub Actions (variable CI), un fallo del buscador detiene la
# publicación; en local solo avisa.
EN_CI = bool(os.environ.get("CI"))

# Páginas que no deben aparecer en el buscador ni en el sitemap
SIN_INDEXAR = {"404.html", "buscar.html", "folleto-primeros-pasos.html"}

# Versión fija de Pagefind (el buscador): una versión nueva podría cambiar
# el formato del índice o de la interfaz sin avisar.
PAGEFIND = "pagefind@1.3.0"
# Igual para el generador del código QR del folleto «Primeros pasos»
QRCODE = "qrcode@1.5.4"

# Bloques de cierre opcionales: una pieza común que se añade al final del
# contenido de una página (dentro de <main>, después de {{CONTENT}}), antes
# de </main>. A diferencia del subnav (que depende de a qué grupo de
# páginas pertenece la página), el cierre no tiene tokens {{ACTIVE:...}}:
# es el mismo bloque para cualquier página que lo active.
CIERRE_FILES = {
    "apoyo": "templates/cierre-apoyo.html",
}

# Aviso de contenido elaborado con IA, al principio de <main>. Lo activa
# "aviso: ia" en los metadatos de la página. Mientras la página no tenga
# "revision: <quién> · <cuándo>", el aviso dice que está pendiente de
# revisión profesional. Cada revisión se anota también en el registro de
# PENDIENTES.md.
AVISO_IA_FILE = "templates/aviso-ia.html"


def aviso_ia(plantilla, revision, en_hablando):
    if revision:
        estado = "Revisado por %s." % revision
    else:
        estado = "Pendiente de revisión por un profesional."
    nota = " No sustituye la consulta con tu equipo médico." if en_hablando else ""
    return (plantilla.replace("{{ESTADO_REVISION}}", estado)
            .replace("{{NOTA_MEDICA}}", nota))

# Cada submenú de sección es una plantilla en templates/subnav/<grupo>.html.
# Las páginas lo eligen con "subnav: <grupo>" en su bloque de metadatos.
# La lista de enlaces de cada grupo se lee de los propios tokens
# {{ACTIVE:pagina.html}} de la plantilla, así que añadir una página a un
# submenú es tocar solo la plantilla.
SUBNAV_FILES = {
    os.path.splitext(name)[0]: os.path.join("templates", "subnav", name)
    for name in sorted(os.listdir(os.path.join("templates", "subnav")))
    if name.endswith(".html")
}

SUBNAV_LINKS = {
    key: re.findall(r"\{\{ACTIVE:([^}]+)\}\}", open(path, encoding="utf-8").read())
    for key, path in SUBNAV_FILES.items()
}


# ---------- Enlaces automáticos al glosario ----------
# En las páginas de Hablando de cáncer, la primera aparición de cada término
# del glosario se enlaza a su definición. Los términos se leen del propio
# glosario (cada <dt id="...">), así que añadir una definición basta para
# que se enlace. Nunca se enlaza dentro de títulos, menús ni enlaces.
GLOSARIO_FUENTE = os.path.join("pages", "hablando-de-cancer", "glosario.html")
GLOSARIO_SIN_ENLACE = {"glosario.html", "hablando-de-cancer.html"}
# Un término no se enlaza en la página que ya trata ese tema
TERMINO_PAGINA_PROPIA = {"linfedema": "linfedema.html"}
ETIQUETAS_SIN_ENLACE = {"a", "h1", "h2", "h3", "h4", "h5", "h6", "nav",
                        "button", "script", "style", "dt", "label", "title"}


def leer_terminos_glosario():
    texto = open(GLOSARIO_FUENTE, encoding="utf-8").read()
    terminos = []
    for ident, etiqueta in re.findall(r'<dt id="([^"]+)">([^<]+)</dt>', texto):
        base = etiqueta.split(" (")[0].strip()
        terminos.append((ident, base))
    # Los más largos primero: "neo-adyuvante" antes que "adyuvante"
    return sorted(terminos, key=lambda t: -len(t[1]))


def enlazar_glosario(content, fname, terminos):
    for ident, base in terminos:
        if TERMINO_PAGINA_PROPIA.get(ident) == fname:
            continue
        patron = re.compile(r"(?<![\w-])(" + re.escape(base) + r"(?:es|s)?)(?!\w)",
                            re.IGNORECASE)
        partes = re.split(r"(<[^>]+>)", content)
        profundidad = 0
        for i, parte in enumerate(partes):
            if parte.startswith("<"):
                m = re.match(r"<(/?)([a-zA-Z0-9]+)", parte)
                if m and m.group(2).lower() in ETIQUETAS_SIN_ENLACE:
                    profundidad += -1 if m.group(1) else 1
                continue
            if profundidad > 0:
                continue
            m = patron.search(parte)
            if m:
                enlace = ('<a class="termino-glosario" href="glosario.html#%s" '
                          'title="Ver en el glosario">%s</a>' % (ident, m.group(1)))
                partes[i] = parte[:m.start()] + enlace + parte[m.end():]
                break
        content = "".join(partes)
    return content


AVISO_PESTANA ='<span class="sr-only"> (se abre en otra pestaña)</span>'


def avisar_pestana_nueva(html):
    """Añade un aviso para lectores de pantalla a cada enlace que abre una
    pestaña nueva: perder la página de origen sin aviso desorienta (el botón
    de volver deja de funcionar). El icono visible lo pone el CSS."""
    def poner(m):
        if AVISO_PESTANA in m.group(2):
            return m.group(0)
        return m.group(1) + m.group(2) + AVISO_PESTANA + m.group(3)
    return re.sub(r'(<a\b[^>]*\btarget="_blank"[^>]*>)(.*?)(</a>)', poner, html, flags=re.S)


# ---------- Correos preparados ----------
# Los enlaces del tipo "escríbenos" abren un correo ya redactado. Los textos
# viven en templates/correos.txt y en las páginas se usa
# href="{{CORREO:clave}}". Todos los asuntos empiezan por "[Web] " para que
# la asociación distinga en su bandeja lo que llega desde la web.
CORREO_DESTINO = "amacgema@gmail.com"
CORREOS_FUENTE = os.path.join("templates", "correos.txt")


def leer_correos():
    correos, clave, lineas = {}, None, []

    def guardar():
        if clave is None:
            return
        cabecera = lineas[0] if lineas else ""
        if not cabecera.startswith("asunto:"):
            raise ValueError("El correo [%s] no empieza por 'asunto:'" % clave)
        cuerpo = "\n".join(lineas[1:]).strip("\n")
        correos[clave] = (cabecera[len("asunto:"):].strip(), cuerpo)

    for linea in open(CORREOS_FUENTE, encoding="utf-8").read().splitlines():
        if linea.startswith("#"):
            continue
        m = re.match(r"^\[([a-z0-9-]+)\]\s*$", linea)
        if m:
            guardar()
            clave, lineas = m.group(1), []
        elif clave is not None:
            lineas.append(linea)
    guardar()
    return correos


def enlace_correo(asunto, cuerpo):
    from urllib.parse import quote
    url = "mailto:%s?subject=%s" % (CORREO_DESTINO, quote("[Web] " + asunto, safe=""))
    if cuerpo.strip():
        url += "&body=" + quote(cuerpo.replace("\n", "\r\n") + "\r\n", safe="")
    return url.replace("&", "&amp;")


def poner_correos(html, correos, fname):
    def cambiar(m):
        clave = m.group(1)
        if clave not in correos:
            raise ValueError("%s usa {{CORREO:%s}}, que no está en %s"
                             % (fname, clave, CORREOS_FUENTE))
        return enlace_correo(*correos[clave])
    return re.sub(r"\{\{CORREO:([a-z0-9-]+)\}\}", cambiar, html)


# ---------- Agenda ----------
# Las citas viven en templates/agenda.txt (formato explicado en el propio
# archivo). {{AGENDA}} pinta la página completa y {{PROXIMAS_CITAS}} el
# bloque de la portada, que solo aparece si hay citas con fecha por venir.
# Las citas pasadas se ocultan solas: el workflow regenera la web cada lunes.
AGENDA_FUENTE = os.path.join("templates", "agenda.txt")
DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
         "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
CITAS_EN_PORTADA = 3


def leer_agenda():
    """Devuelve (con_fecha, repetidas): con_fecha ordenadas por fecha."""
    citas, actual = [], None
    for numero, linea in enumerate(read(AGENDA_FUENTE).splitlines(), 1):
        if linea.startswith("#") or not linea.strip():
            continue
        m = re.match(r"^\[(fecha|cada):\s*(.+?)\]\s*$", linea)
        if m:
            actual = {"tipo": m.group(1), "cuando": m.group(2), "texto": []}
            if actual["tipo"] == "fecha":
                try:
                    actual["fecha"] = datetime.date.fromisoformat(actual["cuando"])
                except ValueError:
                    raise ValueError("%s, línea %d: la fecha debe ser AAAA-MM-DD"
                                     % (AGENDA_FUENTE, numero))
            citas.append(actual)
            continue
        if actual is None:
            raise ValueError("%s, línea %d: texto fuera de una cita" % (AGENDA_FUENTE, numero))
        campo = re.match(r"^(titulo|hora|lugar|enlace):\s*(.*)$", linea)
        if campo:
            actual[campo.group(1)] = campo.group(2).strip()
        else:
            actual["texto"].append(linea.strip())
    for cita in citas:
        if not cita.get("titulo"):
            raise ValueError("%s: la cita [%s: %s] no tiene título"
                             % (AGENDA_FUENTE, cita["tipo"], cita["cuando"]))
    con_fecha = sorted((c for c in citas if c["tipo"] == "fecha"), key=lambda c: c["fecha"])
    return con_fecha, [c for c in citas if c["tipo"] == "cada"]


def fecha_larga(fecha):
    return "%s %d de %s de %d" % (DIAS[fecha.weekday()], fecha.day,
                                  MESES[fecha.month - 1], fecha.year)


def cita_html(cita, nivel="h3"):
    esc = html.escape
    if cita["tipo"] == "fecha":
        cuando = fecha_larga(cita["fecha"])
        fecha_attr = ' datetime="%s"' % cita["fecha"].isoformat()
    else:
        cuando, fecha_attr = cita["cuando"], ""
    if cita.get("hora"):
        cuando += " · " + cita["hora"]
    titulo = esc(cita["titulo"])
    enlace = cita.get("enlace")
    if enlace:
        externo = ' target="_blank" rel="noopener noreferrer"' if enlace.startswith("http") else ""
        titulo = '<a href="%s"%s>%s</a>' % (esc(enlace), externo, titulo)
    partes = ['<li class="cita">',
              '  <p class="cita-cuando"><time%s>%s</time></p>' % (fecha_attr, esc(cuando)),
              '  <%s>%s</%s>' % (nivel, titulo, nivel)]
    if cita.get("lugar"):
        partes.append('  <p class="cita-lugar">%s</p>' % esc(cita["lugar"]))
    if cita["texto"]:
        partes.append("  <p>%s</p>" % esc(" ".join(cita["texto"])))
    partes.append("</li>")
    return "\n".join(partes)


def lista_citas(citas):
    return ('<ul class="citas">\n%s\n</ul>'
            % "\n".join(cita_html(c) for c in citas))


def es_anual(cita):
    return re.match(r"(?i)cada (año|%s)" % "|".join(MESES), cita["cuando"]) is not None


def agenda_html(con_fecha, repetidas):
    if con_fecha:
        proximas = lista_citas(con_fecha)
    else:
        proximas = ('<p class="citas-vacio">Todavía no hay fechas publicadas para '
                    'los próximos meses. Llámanos al <a href="tel:+34976297764">976 297 764</a> '
                    'y te informamos.</p>')
    mensuales = [c for c in repetidas if not es_anual(c)]
    anuales = [c for c in repetidas if es_anual(c)]
    bloques = ['<h2 id="proximas-fechas">Próximas fechas</h2>', proximas]
    if mensuales:
        bloques += ['<h2 id="cada-mes">Durante el curso</h2>', lista_citas(mensuales)]
    if anuales:
        bloques += ['<h2 id="cada-anio">Cada año</h2>', lista_citas(anuales)]
    return "\n".join(bloques)


def proximas_citas_html(con_fecha):
    if not con_fecha:
        return ""
    return ('<div class="citas-portada">\n'
            '  <div class="seccion-titulo">\n'
            '    <h2 id="proximas-citas">Próximas citas</h2>\n'
            '  </div>\n'
            '  %s\n'
            '  <p class="ver-mas"><a href="agenda.html" class="enlace-flecha">Ver la agenda completa</a></p>\n'
            '</div>' % lista_citas(con_fecha[:CITAS_EN_PORTADA]))


# ---------- Índice de página ----------
# En una página larga, el marcador {{INDICE}} se sustituye por un índice de
# salto con sus títulos <h2>. Los <h2> sin id reciben uno a partir del texto,
# así que basta con escribir el marcador donde deba aparecer el índice.
def _slug(texto):
    texto = re.sub(r"<[^>]+>", "", texto).lower()
    for origen, destino in zip("áéíóúüñ", "aeiouun"):
        texto = texto.replace(origen, destino)
    return re.sub(r"[^a-z0-9]+", "-", texto).strip("-")


def generar_indice(content):
    if "{{INDICE}}" not in content:
        return content
    antes, despues = content.split("{{INDICE}}", 1)
    entradas, usados = [], set()

    def poner_id(m):
        attrs, texto = m.group(1), m.group(2)
        ident = re.search(r'\bid="([^"]+)"', attrs)
        if ident:
            ident = ident.group(1)
        else:
            ident = base = _slug(texto) or "seccion"
            n = 2
            while ident in usados:
                ident, n = "%s-%d" % (base, n), n + 1
            attrs += ' id="%s"' % ident
        usados.add(ident)
        entradas.append((ident, re.sub(r"<[^>]+>", "", texto).strip()))
        return "<h2%s>%s</h2>" % (attrs, texto)

    despues = re.sub(r"<h2([^>]*)>(.*?)</h2>", poner_id, despues, flags=re.S)
    enlaces = "\n".join('      <li><a href="#%s">%s</a></li>' % e for e in entradas)
    indice = ('<nav class="indice-rapido" aria-label="Índice de esta página" data-pagefind-ignore>\n'
              '    <p class="indice-rapido-titulo">En esta página</p>\n'
              '    <ul>\n%s\n    </ul>\n  </nav>' % enlaces)
    return antes + indice + despues


# ---------- Datos para buscadores (Google y similares) ----------
# Ficha de la asociación en formato schema.org, solo en la portada: es lo
# que permite a Google mostrar nombre, logo, dirección y redes juntos.
def datos_estructurados():
    datos = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "AMAC-GEMA",
        "alternateName": "Asociación de Mujeres Aragonesas de Cáncer Genital y de Mama",
        "url": SITE_URL,
        "logo": SITE_URL + "img/amac-gema-logo.png",
        "foundingDate": "1994-06-06",
        "telephone": "+34 976 297 764",
        "email": CORREO_DESTINO,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Plaza del Pilar, 14, 1º izq.",
            "postalCode": "50003",
            "addressLocality": "Zaragoza",
            "addressRegion": "Aragón",
            "addressCountry": "ES",
        },
        "areaServed": {"@type": "AdministrativeArea", "name": "Aragón"},
        "sameAs": [
            "https://www.facebook.com/amac.gema/",
            "https://www.instagram.com/amacgema/",
        ],
    }
    return ('  <script type="application/ld+json">\n%s\n  </script>\n'
            % json.dumps(datos, ensure_ascii=False, indent=2))


def escribir_sitemap(paginas):
    """sitemap.xml para Google Search Console y robots.txt que lo anuncia.
    Ojo: los buscadores solo leen robots.txt en la raíz de un dominio, así
    que en github.io/amacgema-web/ no tiene efecto hasta tener dominio
    propio; el sitemap sí se puede enviar a mano en Search Console."""
    urls = "\n".join(
        "  <url><loc>%s</loc></url>" % (SITE_URL + ("" if p == "index.html" else p))
        for p in sorted(paginas) if p not in SIN_INDEXAR)
    with open(os.path.join(SALIDA, "sitemap.xml"), "w", encoding="utf-8") as fh:
        fh.write('<?xml version="1.0" encoding="UTF-8"?>\n'
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                 '%s\n</urlset>\n' % urls)
    with open(os.path.join(SALIDA, "robots.txt"), "w", encoding="utf-8") as fh:
        fh.write("User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n" % SITE_URL)


def escribir_cname():
    """Con dominio propio, GitHub Pages necesita un archivo CNAME con él."""
    dominio = urlparse(SITE_URL).hostname
    if not dominio.endswith("github.io"):
        with open(os.path.join(SALIDA, "CNAME"), "w", encoding="utf-8") as fh:
            fh.write(dominio + "\n")


def ejecutar_npx(argumentos, que):
    """Ejecuta una herramienta de Node con npx. Sin Node.js, o si falla, la
    web se genera igual sin esa parte; en GitHub Actions, en cambio, se
    detiene la publicación."""
    npx = shutil.which("npx")
    if not npx:
        print("AVISO: sin Node.js (npx) no se ha generado %s." % que)
        if EN_CI:
            sys.exit(1)
        return
    resultado = subprocess.run(
        [npx, "-y"] + argumentos,
        capture_output=True, text=True, encoding="utf-8", errors="replace")
    if resultado.returncode != 0:
        print("AVISO: no se ha podido generar %s:\n%s%s"
              % (que, resultado.stdout[-1500:], resultado.stderr[-1500:]))
        if EN_CI:
            sys.exit(1)
    else:
        print("Generado %s." % que)


def generar_buscador():
    """Índice del buscador (publicar/pagefind/). En cada página indexa solo
    lo que va dentro de <main data-pagefind-body>."""
    ejecutar_npx([PAGEFIND, "--site", SALIDA], "el índice del buscador")


def generar_qr():
    """QR del folleto, con la dirección pública de Primeros pasos: si cambia
    SITE_URL (dominio propio), el QR cambia solo en la siguiente publicación."""
    ejecutar_npx([QRCODE, "-t", "svg", "-e", "M",
                  "-o", os.path.join(SALIDA, "img", "qr-primeros-pasos.svg"),
                  SITE_URL + "me-acaban-de-diagnosticar.html"],
                 "el código QR del folleto")


def avisar(mensaje):
    """Aviso en la consola y, en GitHub Actions, también en el resumen de
    la publicación (formato ::warning::)."""
    print("AVISO: " + mensaje)
    if EN_CI:
        print("::warning::" + mensaje)


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def apply_active(template_text, links, active_href):
    """Sustituye cada token {{ACTIVE:href}} por aria-current="page" si
    coincide con el enlace activo, o lo elimina si no."""
    out = template_text
    for href in links:
        token = "{{ACTIVE:%s}}" % href
        replacement = ' aria-current="page"' if href == active_href else ""
        out = out.replace(token, replacement)
    return out


def parse_page(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        raise ValueError("Página sin bloque de metadatos (front matter) válido")
    meta_block, body = m.group(1), m.group(2)
    meta = {}
    for line in meta_block.splitlines():
        if not line.strip():
            continue
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    return meta, body.strip("\n")


def build():
    layout = read("templates/layout.html")
    navbar_tpl = read("templates/navbar.html")
    footer = read("templates/footer.html")

    subnav_templates = {key: read(path) for key, path in SUBNAV_FILES.items()}
    cierre_templates = {key: read(path) for key, path in CIERRE_FILES.items()}
    aviso_ia_tpl = read(AVISO_IA_FILE)
    terminos_glosario = leer_terminos_glosario()
    correos = leer_correos()
    citas_con_fecha, citas_repetidas = leer_agenda()
    hoy = datetime.date.today()
    citas_futuras = [c for c in citas_con_fecha if c["fecha"] >= hoy]

    page_paths = []
    for dirpath, _dirnames, filenames in os.walk("pages"):
        for name in filenames:
            if name.endswith(".html"):
                page_paths.append(os.path.join(dirpath, name))
    page_paths.sort()

    seen = {}
    for page_path in page_paths:
        fname = os.path.basename(page_path)
        if fname in seen:
            raise ValueError(f"Nombre de página duplicado: {page_path} y {seen[fname]}")
        seen[fname] = page_path

    # La salida se rehace desde cero: así una página borrada o renombrada en
    # pages/ no deja un .html huérfano publicado.
    if os.path.isdir(SALIDA):
        shutil.rmtree(SALIDA)
    os.makedirs(SALIDA)
    for carpeta in ESTATICOS:
        shutil.copytree(carpeta, os.path.join(SALIDA, carpeta))

    built = []
    sin_revisar = []

    for page_path in page_paths:
        fname = os.path.basename(page_path)
        meta, content = parse_page(read(page_path))

        navbar = apply_active(navbar_tpl, NAV_LINKS, meta.get("nav", ""))

        subnav_html = ""
        subnav_key = meta.get("subnav", "")
        if subnav_key:
            tpl = subnav_templates[subnav_key]
            subnav_html = apply_active(tpl, SUBNAV_LINKS[subnav_key], fname)

        content = (content
                   .replace("{{AGENDA}}", agenda_html(citas_futuras, citas_repetidas))
                   .replace("{{PROXIMAS_CITAS}}", proximas_citas_html(citas_futuras))
                   .replace("{{URL_PRIMEROS_PASOS}}",
                            (SITE_URL + "me-acaban-de-diagnosticar.html").split("://", 1)[1]))
        content = generar_indice(content)

        en_hablando = os.path.normpath(page_path).split(os.sep)[1] == "hablando-de-cancer"
        if en_hablando and fname not in GLOSARIO_SIN_ENLACE:
            content = enlazar_glosario(content, fname, terminos_glosario)

        if meta.get("aviso") == "ia":
            content = aviso_ia(aviso_ia_tpl, meta.get("revision", ""), en_hablando) + content

        cierre_html = ""
        cierre_key = meta.get("cierre", "")
        if cierre_key:
            cierre_html = cierre_templates[cierre_key]

        page_html = (
            layout
            .replace("{{URL}}", SITE_URL + ("" if fname == "index.html" else fname))
            .replace("{{SITE_URL}}", SITE_URL)
            .replace("{{TITLE}}", meta.get("title", ""))
            .replace("{{DESCRIPTION}}", meta.get("description", ""))
            .replace("{{NAVBAR}}", navbar)
            .replace("{{SUBNAV}}", subnav_html)
            .replace("{{CONTENT}}", content)
            .replace("{{CIERRE}}", cierre_html)
            .replace("{{FOOTER}}", footer)
            .replace("{{DATOS_ESTRUCTURADOS}}",
                     datos_estructurados() if fname == "index.html" else "")
        )

        if fname in SIN_INDEXAR:
            page_html = page_html.replace(" data-pagefind-body", "", 1)

        page_html = avisar_pestana_nueva(page_html)
        page_html = poner_correos(page_html, correos, fname)

        # GitHub Pages sirve 404.html para cualquier ruta inexistente, incluso
        # a varias carpetas de profundidad: sin <base>, sus rutas relativas
        # (CSS, imágenes, enlaces) apuntarían a sitios que no existen.
        if fname == "404.html":
            page_html = page_html.replace(
                '<meta charset="UTF-8">',
                '<meta charset="UTF-8">\n  <base href="%s">' % SITE_URL, 1)

        with open(os.path.join(SALIDA, fname), "w", encoding="utf-8") as fh:
            fh.write(page_html)
        built.append(fname)

        if meta.get("aviso") == "ia" and not meta.get("revision"):
            sin_revisar.append(fname)

    print(f"Generadas {len(built)} páginas en {SALIDA}/.")
    pendientes = sorted(f for f in built
                        if 'class="pendiente"' in read(os.path.join(SALIDA, f)))
    if pendientes:
        avisar("datos marcados como pendientes en: " + ", ".join(pendientes))
    if sin_revisar:
        avisar("contenido elaborado con IA sin revisión profesional en: "
               + ", ".join(sorted(sin_revisar)) + " (ver PENDIENTES.md)")

    escribir_sitemap(built)
    escribir_cname()
    if "--sin-buscador" in sys.argv:
        print("AVISO: sin buscador ni QR del folleto (--sin-buscador).")
    else:
        generar_buscador()
        generar_qr()


if __name__ == "__main__":
    build()
