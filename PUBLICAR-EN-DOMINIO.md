# Publicar la web en mujerycancer.org

Plan para el día en que la web pase de `a-herranz.github.io/amacgema-web` a
`mujerycancer.org`, el dominio que tiene AMAC-GEMA desde 2004. Pensado para
hacerlo con calma: la web sigue visible durante todo el proceso y cada paso
se puede deshacer.

## Antes del día (asociación)

- [ ] **Renovar el dominio**: caduca el **9 de enero de 2027**. Registrador:
      Arsys / Nicline; el DNS se gestiona en Interdominios.
- [ ] **Tener acceso** al panel de Interdominios (o de Arsys) con permiso
      para cambiar el DNS.
- [ ] **Averiguar si alguien usa el correo** `@mujerycancer.org`. El dominio
      tiene servidor de correo propio (`mail.mujerycancer.org`). Si se usa,
      el cambio no lo toca, pero el alojamiento actual **no** se puede dar de
      baja.
- [ ] **Hacer una copia del WordPress actual** (aunque solo tenga contenido de
      ejemplo, por si hubiera algo que guardar) desde su panel de Plesk.
- [ ] Rellenar los **datos legales** pendientes del aviso legal y la política
      de privacidad: con el dominio, la web pasa a ser la oficial.

## El día del cambio

### 1. DNS (quien tenga acceso a Interdominios)

Anotar antes cómo está todo (una captura de pantalla vale). Después:

| Tipo | Nombre | Valor | Qué hacer |
|---|---|---|---|
| A | `@` | `93.174.4.71` | Borrar (es el WordPress actual) |
| A | `@` | `185.199.108.153` | Añadir |
| A | `@` | `185.199.109.153` | Añadir |
| A | `@` | `185.199.110.153` | Añadir |
| A | `@` | `185.199.111.153` | Añadir |
| CNAME | `www` | `a-herranz.github.io` | Añadir o sustituir |
| MX, `mail` y el resto | — | — | **No tocar** |

Los cambios tardan en llegar a todo el mundo entre unos minutos y unas horas.

### 2. Web (técnico)

1. Comprobar que el DNS ya apunta a GitHub:
   `nslookup mujerycancer.org` debe devolver las direcciones `185.199.x.153`.
2. En `scripts/build.py`, cambiar `SITE_URL` a `"https://mujerycancer.org/"`
   (el build crea solo el archivo `CNAME`).
3. En GitHub: *Settings → Pages → Custom domain* → `mujerycancer.org`.
   Esperar a que se emita el certificado y marcar **Enforce HTTPS**.
4. Publicar (subir el cambio a `main`).

### 3. Comprobaciones

- [ ] `https://mujerycancer.org/` abre la portada con candado (HTTPS).
- [ ] `https://www.mujerycancer.org/` lleva a la misma web.
- [ ] Unas cuantas páginas al azar, el menú, el buscador y el folleto en PDF.
- [ ] El código QR del folleto lleva a la dirección nueva.
- [ ] Direcciones de la web antigua: por ejemplo
      `mujerycancer.org/clinico/mama/causas.html` y
      `mujerycancer.org/noticia.php?ID=120` llevan a su página nueva.
- [ ] La dirección provisional `a-herranz.github.io/amacgema-web/` redirige
      sola al dominio.
- [ ] El correo `@mujerycancer.org` (si se usa) sigue recibiendo mensajes.

### Si algo falla

Volver a poner en el DNS el registro A antiguo (`93.174.4.71`) y quitar el
dominio en GitHub Pages: todo queda como estaba y la web sigue en la
dirección provisional.

## Después

- [ ] **Search Console**: añadir la propiedad de dominio `mujerycancer.org`
      (se verifica con un registro TXT en el DNS) y enviar `sitemap.xml`.
- [ ] **Google Business Profile**: ficha de la sede con la web nueva.
- [ ] Poner la web en la biografía de **Facebook** e **Instagram**.
- [ ] Pedir que actualicen el enlace: guía de asociaciones del Ayuntamiento de
      Zaragoza (que además tiene la dirección antigua, «3º C»), FECMA,
      Gobierno de Aragón y los medios que han entrevistado a la asociación.
- [ ] Cuando se sepa que el correo no depende de él, dar de baja el
      alojamiento del WordPress antiguo.
- [ ] A medio plazo: pasar el repositorio de GitHub a una cuenta de la
      asociación.
