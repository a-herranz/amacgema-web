"""Genera los .html de la raíz del sitio a partir de templates/ + pages/.

Uso:
    python scripts/build.py

Cada vez que cambies el navbar, el footer, un submenú de contenido
(templates/*.html) o el contenido de una página (pages/*.html), vuelve a
ejecutar este script para regenerar los archivos finales antes de hacer commit.
"""
import re
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# Dirección pública del sitio, con "/" final. Se usa en las etiquetas para
# compartir (WhatsApp y redes exigen URLs absolutas) y en la página 404.
# Si la web pasa a un dominio propio, cambia solo esta línea.
SITE_URL = "https://a-herranz.github.io/amacgema-web/"

NAV_LINKS = [
    "index.html", "quienes-somos.html", "que-hacemos.html",
    "hablando-de-cancer.html", "como-ayudar.html", "contacto.html",
]

# Bloques de cierre opcionales: una pieza común que se añade al final del
# contenido de una página (dentro de <main>, después de {{CONTENT}}), antes
# de </main>. A diferencia del subnav (que depende de a qué grupo de
# páginas pertenece la página), el cierre no tiene tokens {{ACTIVE:...}}:
# es el mismo bloque para cualquier página que lo active.
CIERRE_FILES = {
    "apoyo": "templates/cierre-apoyo.html",
}

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
    indice = ('<nav class="indice-rapido" aria-label="Índice de esta página">\n'
              '    <p class="indice-rapido-titulo">En esta página</p>\n'
              '    <ul>\n%s\n    </ul>\n  </nav>' % enlaces)
    return antes + indice + despues


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
    terminos_glosario = leer_terminos_glosario()
    correos = leer_correos()

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

    built = []

    for page_path in page_paths:
        fname = os.path.basename(page_path)
        meta, content = parse_page(read(page_path))

        navbar = apply_active(navbar_tpl, NAV_LINKS, meta.get("nav", ""))

        subnav_html = ""
        subnav_key = meta.get("subnav", "")
        if subnav_key:
            tpl = subnav_templates[subnav_key]
            subnav_html = apply_active(tpl, SUBNAV_LINKS[subnav_key], fname)

        content = generar_indice(content)

        en_hablando = os.path.normpath(page_path).split(os.sep)[1] == "hablando-de-cancer"
        if en_hablando and fname not in GLOSARIO_SIN_ENLACE:
            content = enlazar_glosario(content, fname, terminos_glosario)

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
        )

        page_html = avisar_pestana_nueva(page_html)
        page_html = poner_correos(page_html, correos, fname)

        # GitHub Pages sirve 404.html para cualquier ruta inexistente, incluso
        # a varias carpetas de profundidad: sin <base>, sus rutas relativas
        # (CSS, imágenes, enlaces) apuntarían a sitios que no existen.
        if fname == "404.html":
            page_html = page_html.replace(
                '<meta charset="UTF-8">',
                '<meta charset="UTF-8">\n  <base href="%s">' % SITE_URL, 1)

        with open(fname, "w", encoding="utf-8") as fh:
            fh.write(page_html)
        built.append(fname)

    # Todo .html en la raíz es salida generada: si una página se borra o se
    # renombra en pages/, su .html huérfano en la raíz debe desaparecer
    # también, o quedaría publicado aunque ya no tenga fuente.
    built_set = set(built)
    removed = []
    for fname in os.listdir("."):
        if fname.endswith(".html") and fname not in built_set:
            os.remove(fname)
            removed.append(fname)

    print(f"Generadas {len(built)} páginas.")
    pendientes = sorted(f for f in built if 'class="pendiente"' in open(f, encoding="utf-8").read())
    if pendientes:
        print("AVISO: datos marcados como pendientes en: " + ", ".join(pendientes))
    if removed:
        print(f"Eliminadas {len(removed)} páginas huérfanas: {', '.join(sorted(removed))}")


if __name__ == "__main__":
    build()
