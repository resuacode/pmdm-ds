# Programación Multimedia y Dispositivos Móviles (PMDM)

Apuntes, ejemplos y referencias del módulo de **Programación Multimedia y Dispositivos Móviles**.

🌐 **Web del módulo:** https://resuacode.github.io/pmdm-ds/

El contenido se divide en dos bloques:

- **Desarrollo de apps Android** con Kotlin y Jetpack Compose: lenguaje Kotlin, Compose, gestión del estado, navegación, arquitectura MVVM, conexión a internet con Retrofit, serialización JSON y persistencia con Room y DataStore.
- **Desarrollo de videojuegos** con Unity 6 y C#: uso del editor, físicas, scripting, UI, audio, animaciones, builds y juegos completos paso a paso (Pong y Breakout).

Los vídeos de las clases están en el canal de YouTube [@resuacode](https://www.youtube.com/@resuacode).

## Estructura del repositorio

```
docs/
├── intro.mdx               # Página de inicio de la documentación
├── Android/                # Bloque de Android (Kotlin + Jetpack Compose)
│   ├── 1-sobre-kotlin/
│   ├── 2-jetpack-compose/
│   └── ...
└── Videojuegos/            # Bloque de videojuegos (Unity + C#)
    ├── 1-Unity/
    ├── 2-Juegos/
    └── 3-CSharp/
static/img/                 # Imágenes de los apuntes
src/                        # Página principal y estilos
```

La barra lateral se genera automáticamente a partir de las carpetas de `docs/`; el número al principio de cada archivo marca el orden.

## Desarrollo en local

Requisitos: Node.js 20 o superior.

```bash
npm install      # instalar dependencias
npm start        # servidor de desarrollo con recarga en caliente
npm run build    # generar la web estática en build/
npm run serve    # servir localmente la versión generada
```

La build falla si hay enlaces internos rotos, así que conviene ejecutar `npm run build` antes de subir cambios.

## Despliegue

Cada push a la rama `master` publica la web automáticamente en GitHub Pages mediante el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). También puede lanzarse a mano desde la pestaña *Actions*.

## Tecnología

Construido con [Docusaurus](https://docusaurus.io/) y búsqueda local con [docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local).
