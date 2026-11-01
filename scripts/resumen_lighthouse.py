"""Resume los informes JSON de Lighthouse de una carpeta en Markdown: una
tabla con las cuatro notas por página y, debajo, los avisos de cada página
que no llegan al aprobado. Lo usa .github/workflows/revisar.yml; también
sirve en local con los informes descargados:

    python scripts/resumen_lighthouse.py carpeta-de-informes
"""
import glob
import json
import os
import sys

CATEGORIAS = [("performance", "Velocidad"), ("accessibility", "Accesibilidad"),
              ("best-practices", "Buenas prácticas"), ("seo", "SEO")]


def main(carpeta):
    informes = sorted(glob.glob(os.path.join(carpeta, "*.report.json")))
    if not informes:
        print("No hay informes de Lighthouse en %s." % carpeta)
        return
    filas, avisos = [], []
    for ruta in informes:
        with open(ruta, encoding="utf-8") as fh:
            datos = json.load(fh)
        pagina = os.path.basename(ruta).replace(".report.json", ".html")
        notas = []
        for clave, _ in CATEGORIAS:
            puntos = datos["categories"][clave]["score"]
            notas.append("–" if puntos is None else str(round(puntos * 100)))
        filas.append("| %s | %s |" % (pagina, " | ".join(notas)))
        for clave, nombre in CATEGORIAS:
            for ref in datos["categories"][clave]["auditRefs"]:
                auditoria = datos["audits"][ref["id"]]
                puntos = auditoria.get("score")
                if ref.get("weight", 0) > 0 and puntos is not None and puntos < 0.9:
                    detalle = auditoria.get("displayValue", "")
                    avisos.append("- **%s** · %s · %s%s" % (
                        pagina, nombre, auditoria["title"],
                        " (%s)" % detalle if detalle else ""))
    print("## Lighthouse (móvil)\n")
    print("| Página | %s |" % " | ".join(n for _, n in CATEGORIAS))
    print("|---|%s|" % "|".join("---" for _ in CATEGORIAS))
    print("\n".join(filas))
    if avisos:
        print("\n### Qué mejorar\n")
        print("\n".join(avisos))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "informes")
