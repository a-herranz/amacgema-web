"""Comprueba la web generada en publicar/ antes de publicarla.

Uso (después de scripts/build.py):
    python scripts/comprobar.py

Busca errores que no se ven a simple vista y que GitHub Actions no debe
dejar publicar:
- enlaces internos a páginas o archivos que no existen,
- enlaces a un ancla (#...) que no existe en la página de destino,
- ids repetidos en una misma página (rompen anclas y accesibilidad),
- imágenes sin texto alternativo (alt),
- páginas sin <title> o sin <h1>.
Los enlaces externos no se comprueban: dependen de otras webs.
"""
import os
import sys
from html.parser import HTMLParser
from urllib.parse import unquote, urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(ROOT, "publicar")
EN_CI = bool(os.environ.get("CI"))

ATRIBUTOS_ENLACE = {"a": "href", "link": "href", "img": "src",
                    "script": "src", "iframe": "src", "form": "action"}


class Pagina(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.enlaces = []
        self.imagenes_sin_alt = []
        self.tiene_title = False
        self.tiene_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "title":
            self.tiene_title = True
        if tag == "h1":
            self.tiene_h1 = True
        if tag == "img" and attrs.get("alt") is None:
            self.imagenes_sin_alt.append(attrs.get("src", "?"))
        atributo = ATRIBUTOS_ENLACE.get(tag)
        if atributo and attrs.get(atributo):
            self.enlaces.append(attrs[atributo])


def analizar(ruta):
    pagina = Pagina()
    with open(ruta, encoding="utf-8") as fh:
        pagina.feed(fh.read())
    return pagina


def es_externo(url):
    return url.startswith(("http:", "https:", "mailto:", "tel:", "javascript:",
                           "data:", "//"))


def main():
    if not os.path.isdir(SALIDA):
        print("No existe publicar/: ejecuta antes python scripts/build.py")
        return 1

    paginas = {f: analizar(os.path.join(SALIDA, f))
               for f in sorted(os.listdir(SALIDA)) if f.endswith(".html")}
    hay_buscador = os.path.isdir(os.path.join(SALIDA, "pagefind"))
    errores = []

    for fname, pagina in paginas.items():
        if not pagina.tiene_title:
            errores.append((fname, "sin <title>"))
        if not pagina.tiene_h1:
            errores.append((fname, "sin <h1>"))
        repetidos = sorted({i for i in pagina.ids if pagina.ids.count(i) > 1})
        for ident in repetidos:
            errores.append((fname, 'id repetido: "%s"' % ident))
        for src in pagina.imagenes_sin_alt:
            errores.append((fname, "imagen sin alt: %s" % src))

        for url in pagina.enlaces:
            if es_externo(url):
                continue
            partes = urlparse(url)
            destino = unquote(partes.path) or fname
            if destino.startswith("pagefind/") and not hay_buscador:
                continue
            ruta = os.path.join(SALIDA, *destino.split("/"))
            if destino.endswith("/"):
                ruta = os.path.join(ruta, "index.html")
            if not os.path.exists(ruta):
                errores.append((fname, "enlace roto: %s" % url))
                continue
            if partes.fragment and destino.endswith(".html"):
                objetivo = paginas.get(os.path.basename(destino))
                if objetivo and partes.fragment not in objetivo.ids:
                    errores.append((fname, "ancla inexistente: %s" % url))

    if not hay_buscador:
        print("AVISO: sin carpeta pagefind/ (build con --sin-buscador): "
              "no se comprueban los enlaces del buscador.")

    for fname, mensaje in errores:
        print("ERROR %s: %s" % (fname, mensaje))
        if EN_CI:
            print("::error title=%s::%s" % (fname, mensaje))

    print("%d páginas comprobadas, %d errores." % (len(paginas), len(errores)))
    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())
