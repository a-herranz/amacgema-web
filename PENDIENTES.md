# Pendientes de la web de AMAC-GEMA

Lista de lo que falta por hacer tras la revisión de la web (noviembre de 2026).
Casi todo depende de datos o decisiones de la asociación; cuando estén, el
cambio en la web es rápido.

## Prioridad 1: lo que hoy frena a la gente

### 1. Hacerse socia

Los servicios de la asociación son solo para socias, pero la página
[Hazte socia](pages/como-ayudar/como-ayudar-socias.html) está pensada para
quien quiere colaborar: no da la cuota, no dice que ser socia da acceso a los
servicios y habla de «talleres gratuitos».

- [ ] Cuota de socia: importe y periodicidad (mensual, trimestral, anual…).
      Referencia: ASACO publica 30 €/año, 9 € al trimestre o 18 € al semestre.
- [ ] Qué incluye ser socia: qué servicios y actividades son solo para socias
      y si alguno tiene coste aparte.
- [ ] Pasos para darse de alta y ficha de inscripción (PDF) si la hay.
- [ ] Rehacer la página en dos partes: «Si estás afectada» y «Si quieres
      colaborar». Quitar o aclarar «talleres gratuitos».

### 2. Donaciones

No hay ninguna forma de donar: todo pasa por «contacta».

- [ ] IBAN de la asociación (se publicará visible, sin formulario previo).
- [ ] ¿Hay Bizum solidario? Código ONG.
- [ ] ¿Está la asociación acogida a la Ley 49/2002? Si lo está, las donaciones
      desgravan en el IRPF (80 % de los primeros 250 €). Confirmarlo con la
      gestoría antes de publicarlo.
- [ ] Dos o tres ejemplos de impacto con costes reales («con X € pagamos…»).
- [ ] Crear la página «Dona» y enlazarla desde Cómo ayudar y el pie.

### 3. Horario unificado

- [ ] Poner el mismo horario en Contacto (hoy solo dice «Lunes a viernes»),
      el pie de todas las páginas y la portada:
      lunes a jueves de 9:00 a 14:00 y de 16:00 a 20:00; viernes de 9:00 a 14:00.
- [ ] El aviso «Ahora estamos abiertas / cerradas» (portada y Contacto) sale
      de `data-horario` en `pages/index.html` y `pages/contacto.html`. Cuando la
      asociación confirme el horario, actualizarlo también ahí. No sabe de
      festivos ni de vacaciones: si en verano o en Navidad cambia el horario,
      conviene quitar o ajustar ese atributo mientras tanto.

### 4. Revisión médica de Hablando de cáncer

- [ ] Encontrar a un oncólogo/a (por ejemplo, de los que participan en las
      Jornadas) que revise los textos médicos.
- [ ] Revisar con prioridad las páginas elaboradas con IA: ver el
      [registro de revisión](#registro-de-revisión-de-contenido-elaborado-con-ia)
      al final de este documento.
- [ ] Factores de riesgo del cáncer de mama (ahora en la página Cáncer de mama):
      el «estrés» y la «dieta rica en grasas» figuran como factores de riesgo; la
      evidencia es débil y conviene que lo revise un profesional. En cáncer de
      cérvix, «promiscuidad sexual» se cambió en nov. 2026 por una formulación
      no estigmatizante («haber tenido muchas parejas sexuales, porque aumenta la
      exposición al VPH»).
- [ ] Actualizar los textos antiguos: Tratamiento no menciona la inmunoterapia
      y hay expresiones imprecisas («células malas y buenas»).
- [ ] Añadir al final de cada página «Revisado por… · Última revisión: mes y año».

## Prioridad 2: contenidos que quedan

- [x] **Agenda** (fase 4, nov. 2026): página [Agenda](pages/agenda.html) y
      bloque «Próximas citas» en la portada, generados desde
      [templates/agenda.txt](templates/agenda.txt), que se edita desde el
      navegador. Las citas pasadas desaparecen solas (la web se regenera cada
      lunes). Ya tiene las citas fijas (cafés, talleres, Jornadas, Marcha).
  - [ ] Añadir las fechas concretas: próxima Jornada de Cáncer Ginecológico,
        Marcha por la Salud y talleres del próximo trimestre.
- [x] **Sexualidad** (fase 4, nov. 2026): página
      [Sexualidad](pages/hablando-de-cancer/sexualidad.html), con aviso de IA.
      Pendiente de revisión (ver registro).
- [ ] **Folleto «Primeros pasos»** (fase 4, nov. 2026):
      [tríptico para imprimir](pages/folleto-primeros-pasos.html) en A4
      apaisado, con QR a la web. **No imprimirlo para repartir hasta que se revise** Me acaban de
      diagnosticar: el folleto resume esa página. Al revisarlo, quitar la
      línea «Texto elaborado con ayuda de inteligencia artificial…» del final.
- [ ] **Lectura fácil** (fase 4, nov. 2026): página
      [Lectura fácil](pages/lectura-facil.html) adaptada pero sin validar.
      Validarla con una entidad especializada (por ejemplo, Plena inclusión
      Aragón) y un grupo de personas lectoras; solo entonces puede llevar el
      logotipo europeo de Lectura Fácil.
- [ ] **Historias**: la página ya existe
      ([Historias](pages/que-hacemos/ayuda-testimonial/ayuda-testimonial-historias.html)),
      con la fundación, la historia de la presidenta y citas suyas en prensa
      (COPE 2026, Aragón Digital 2026, Aragón TV 2024). Falta:
  - [ ] Que María José Rivas confirme que está de acuerdo con que su historia
        personal (diagnóstico y tratamientos, tal como los contó en Aragón
        Digital) aparezca en la web de la asociación.
  - [ ] Recoger historias de socias, siempre con permiso por escrito.
  - [ ] Entrevista de Karicia (20/10/2022,
        [enlace](https://karicia.com/maria-jose-aybar-presidenta-de-la-asociacion-amac-gema-de-apoyo-a-las-mujeres-con-cancer-de-mama-y-genital/)):
        tiene respuestas muy buenas sobre la fundación y el voluntariado,
        pero la página no deja claro si habla María José Rivas o María José
        Aybar. Confirmar quién respondió antes de usarla.
  - [ ] Webinar de Atfísica sobre radioterapia intraoperatoria con el
        testimonio de paciente de María José Rivas: solo en vídeo; si hay
        transcripción o se puede ver, sacar de ahí alguna cita.
  - [ ] La AECC (presentación de «Me voy a casa», 27/02/2026) cita a una
        paciente, pero no dice si es de AMAC-GEMA: no se ha usado.
- [ ] **Fotos de la sede**: hacer fotos de los espacios para el bloque
      «La sede» de [Contacto](pages/contacto.html), preparado y oculto (antes
      estaba en Sede social, que ahora redirige a Contacto): sala de acogida y atención, las dos salas polivalentes de la
      ampliación de 2019, el espacio de apoyo biopsicosocial y la zona de
      encuentro. De paso, confirmar el nombre y el uso de cada sala (hay notas
      pendientes en el código de la página). Cada foto va en su hueco, marcado
      con un comentario «Foto pendiente», como
      `<img class="espacio-imagen" src="img/..." alt="...">`.
- [ ] **Fotos de los regalos solidarios**: la sección «Detalles que hemos
      preparado» ya está montada (nov. 2026) y aparece sola con la primera
      foto: subirlas a `galeria/regalos/` y describirlas en
      `templates/regalos.txt`. Faltan también los tipos de detalle, qué se
      puede personalizar exactamente (la web pone como ejemplo nombres, fecha
      o un mensaje), el donativo orientativo y con cuánta antelación conviene
      encargarlos.
- [ ] Para las fotos, en general: fotos reales y luminosas, con permiso por
      escrito de cualquier persona que salga en ellas; nada de imágenes de
      banco de imágenes.
- [ ] **Guías en PDF** de alimentación y ejercicio, si hay subvención para
      maquetarlas (como hace ASAMMA en Málaga).
- [ ] **Entrevista del Heraldo** (19/10/2025): no se pudo leer automáticamente.
      Si tiene una cita mejor para la portada, pegar el fragmento.

### Fase 3 del plan: cara humana (aplazada, nov. 2026)

Depende de fotos y permisos de la asociación (apartados 5 y 7 del
cuestionario para la junta).

- [ ] **Sesión de fotos** de la sede y de actividades: lista de fotos
      necesarias y dónde va cada una (incluye los huecos de «La sede» en Contacto y
      Regalos solidarios de arriba).
- [ ] **El equipo con nombre y cara**: psicooncóloga, fisioterapeuta,
      trabajadora social y alguna voluntaria, en Quiénes somos o en cada
      servicio.
- [ ] **Campaña de historias de socias** (19 de octubre o las Jornadas) y
      **modelo de autorización** por escrito para usar nombre, palabras y foto.
- [ ] **Fotos de la galería de la Agenda** (preparada en nov. 2026, oculta
      mientras no haya fotos): elegir fotos de Instagram de @amacgema y
      subirlas a `galeria/` con su línea en `templates/galeria.txt`. Las
      tiene quien gestiona la cuenta (en el móvil o con «Descargar tu
      información» de Instagram); no se pueden sacar automáticamente porque
      Instagram exige iniciar sesión. Solo fotos con permiso de quien salga.

## Prioridad 3: técnica y visibilidad

- [x] **Índice del buscador**: lo genera GitHub Actions en cada publicación.
- [x] **Publicación con GitHub Actions** (fase 1 del plan, nov. 2026): activa.
      Solo se publica la web generada; el código y estos documentos ya no.
- [ ] **Persona de la asociación que edite textos**: darle acceso al
      repositorio en GitHub y pasarle [COMO-EDITAR.md](COMO-EDITAR.md).
- [ ] **URGENTE · El dominio antiguo mujerycancer.org** (análisis SEO,
      nov. 2026): la guía de asociaciones del Ayuntamiento de Zaragoza lo da
      como web de AMAC-GEMA, y hoy muestra un WordPress con el contenido de
      ejemplo de una plantilla («Sample Page», textos de un estudio de
      arquitectura) titulado «AMACGEMA», con Google Site Kit conectado.
      1. Averiguar quién controla el dominio y ese WordPress.
      2. Lo mejor: usar mujerycancer.org como dominio de esta web (ver el
         punto siguiente). Si no, redirigirlo de forma permanente a ella.
      3. En cualquier caso, quitar ya el contenido de ejemplo.
      Es un dominio con años y con enlaces: es lo que más ayuda a posicionar.
- [ ] **Mismos datos en toda internet**: la guía del Ayuntamiento dice
      «Plaza del Pilar, 14, 3º C» y la web «1º izquierda». Pedir que se
      actualicen nombre, dirección, teléfono y web en la guía del
      Ayuntamiento, FECMA, el Gobierno de Aragón (cartera de servicios),
      Facebook e Instagram (poner la web en la biografía).
- [ ] **Enlaces hacia la web**: pedir a FECMA, el Ayuntamiento, los hospitales
      y los medios que han entrevistado a la asociación (COPE, Aragón
      Digital, Aragón TV, Heraldo) que enlacen a la web nueva.
- [ ] **«Revisado por» en el contenido de salud**: cuando un profesional
      revise una página (registro de abajo), poner `revision:` en su
      cabecera para que muestre quién y cuándo. Google es especialmente
      exigente con las páginas de salud.
- [ ] **Dominio propio** (por ejemplo amacgema.org): comprarlo, cambiar
      `SITE_URL` en [scripts/build.py](scripts/build.py) (el build crea el
      archivo CNAME solo) y configurar el dominio en GitHub Pages.
      Hasta entonces, robots.txt no tiene efecto (los buscadores solo lo leen
      en la raíz de un dominio).
- [ ] **Correo propio** con el mismo dominio (hoy es un Gmail). Al cambiarlo,
      actualizar `CORREO_DESTINO` en el build y el pie.
- [ ] **Google Search Console**: la web ya está preparada (fase 5).
      1. En https://search.google.com/search-console, «Añadir propiedad» →
         «Prefijo de la URL» → la dirección de la web.
      2. Elegir verificar con «Etiqueta HTML» y copiar solo el valor de
         `content="..."`.
      3. Ponerlo en `VERIFICACION_GOOGLE` en [scripts/build.py](scripts/build.py),
         publicar y pulsar «Verificar».
      4. En «Sitemaps», enviar `sitemap.xml`.
      Con dominio propio, repetir con la nueva dirección.
- [ ] **Google Business Profile**: crear o reclamar la ficha de la sede
      (dirección, horario, teléfono, fotos) para aparecer en Maps al buscar
      «asociación cáncer de mama Zaragoza».
- [ ] **Estadísticas de visitas (GoatCounter)**: preparadas y desactivadas
      (fase 5). Crear la cuenta gratuita en https://www.goatcounter.com (es
      gratis para asociaciones), poner su código en `GOATCOUNTER` en
      [scripts/build.py](scripts/build.py) y publicar. Al activarlo, la
      política de cookies y la de privacidad lo mencionan solas, y se cuentan
      también los clics en «Llamar», los correos y las descargas del tríptico.
- [x] **Velocidad y accesibilidad** (fase 5, nov. 2026): imágenes en WebP y
      a su tamaño, tipografías alojadas en la propia web (ya no se usa Google
      Fonts), enlaces subrayados dentro del texto. Lighthouse en móvil: 98-99
      en velocidad y 100 en accesibilidad, buenas prácticas y SEO. El
      workflow «Revisar calidad» lo repite el día 1 de cada mes; mirar el
      resumen de esa ejecución en la pestaña Actions de GitHub.
- [x] **Imagen y pulido** (prioridad 3 del análisis, nov. 2026): iconos de
      línea propios en las tarjetas de servicios, el arco del logo como
      motivo en cabeceras y recuadros, una imagen para compartir por página,
      botón «Imprimir esta página» con hoja impresa cuidada, recuadros «Lo
      esencial» en las páginas médicas que no lo tenían y limpieza de fechas
      que caducan y de textos repetidos.
- [ ] **Cifras anuales**: cada vez que salga una memoria nueva, actualizar
      las cifras «En 2025» de: portada (pacientes visitadas y Marcha),
      Preguntas frecuentes, Historias, Voluntariado testimonial, Acogida,
      Cafés de los martes, Ayuda profesional y sus tres páginas
      (psicooncóloga, fisioterapeuta, trabajadora social), Actividades
      guiadas, Proyecto Contigo, Sensibilización, Investigación y Marcha por
      la Salud, y el enlace a la memoria en Equipo y organización. Buscar «2025» en
      `pages/` las encuentra todas.

## Descartado por ahora

- Formulario «¿Prefieres que te llamemos?»: necesitaría un servicio externo y
  guardar datos de salud.
- Más transparencia (cuentas anuales, subvenciones recibidas).

## Registro de revisión de contenido elaborado con IA

Estas páginas se redactaron con ayuda de inteligencia artificial en
noviembre de 2026 y muestran un aviso al principio que lo dice. Ninguna
debería darse por buena sin la revisión de un profesional, que queda
registrada aquí.

| Página | Fuente | Fuentes usadas | Profesional que debe revisarla | Revisado por (nombre y cargo) | Fecha | Resultado y cambios |
|---|---|---|---|---|---|---|
| Me acaban de diagnosticar | `pages/hablando-de-cancer/me-acaban-de-diagnosticar.html` | AECC, SEOM | Oncología | Pendiente | | |
| Cáncer de mama avanzado | `pages/hablando-de-cancer/cancer-de-mama/cancer-de-mama-avanzado.html` | SEOM, GEICAM, AECC | Oncología | Pendiente | | |
| Después del tratamiento | `pages/hablando-de-cancer/despues-del-tratamiento.html` | SEOM, AECC | Oncología; la parte laboral, trabajadora social | Pendiente | | |
| Mujeres jóvenes | `pages/hablando-de-cancer/mujeres-jovenes.html` | SEOM, GEICAM, AECC | Oncología o ginecología | Pendiente | | |
| Alimentación y ejercicio | `pages/hablando-de-cancer/alimentacion-y-ejercicio.html` | SEOM, AECC, OMS | Oncología o nutrición; la parte de ejercicio, fisioterapeuta | Pendiente | | |
| Sexualidad | `pages/hablando-de-cancer/sexualidad.html` | SEOM, AECC | Psicooncóloga y ginecología u oncología | Pendiente | | |
| Folleto «Primeros pasos» | `pages/folleto-primeros-pasos.html` | Resumen de Me acaban de diagnosticar | Oncología (junto con esa página) | Pendiente | | |
| Lectura fácil | `pages/lectura-facil.html` | Web de AMAC-GEMA | Validación de lectura fácil (entidad especializada y personas lectoras) | Pendiente | | |
| Glosario: 9 términos añadidos (nov. 2026): CDK4/6, cuidados paliativos, densitometría, ensayo clínico, inmunoterapia, metástasis, PARP, triple negativo y vitrificación | `pages/hablando-de-cancer/glosario.html` | SEOM, AECC | Oncología (junto con las páginas médicas) | Pendiente | | El glosario no muestra aviso de IA porque el resto de términos son anteriores |
| Si acompañas a alguien con cáncer (familiares) | `pages/hablando-de-cancer/familiares.html` | AECC, SEOM; Estatuto de los Trabajadores (permiso de 5 días) | Psicooncóloga y trabajadora social | Pendiente | | |
| Preguntas frecuentes | `pages/preguntas-frecuentes.html` | Datos ya publicados en la web | Junta directiva | Pendiente | | |
| Recuadros «Lo esencial» (nov. 2026) en Diagnóstico (mama), Cáncer de ovario, de endometrio, de cuello de útero y de vulva y vagina | `pages/hablando-de-cancer/cancer-de-mama/diagnostico.html` y `pages/hablando-de-cancer/cancer-ginecologico/` | Resumen de cada página, sin datos nuevos | Oncología o ginecología (junto con las páginas médicas) | Pendiente | | Cada recuadro lleva su propia nota de IA; el resto de la página es anterior |
| Historias | `pages/que-hacemos/ayuda-testimonial/ayuda-testimonial-historias.html` | Web de AMAC-GEMA; entrevistas a la presidenta en COPE Aragón (19/10/2026), Aragón Digital (19/10/2026) y Aragón TV (18/10/2024) | Junta directiva y la propia María José Rivas (su historia personal y sus citas) | Pendiente | | Por decisión de nov. 2026, esta página no muestra el aviso de IA |

**Cuando una página quede revisada:**

1. Rellena su fila: quién la revisó, la fecha y qué se cambió.
2. Añade a los metadatos de la página una línea con quien la revisó y cuándo,
   por ejemplo `revision: Dra. Nombre Apellido, oncóloga · marzo de 2027`.
   El aviso de la página pasará de «Pendiente de revisión por un
   profesional» a «Revisado por Dra. Nombre Apellido, oncóloga · marzo de 2027».
3. Vuelve a generar la web con `python scripts/build.py`.

El aviso de que el contenido se elaboró con IA se mantiene siempre, también
después de la revisión.
