# Linces por el Servicio — TecNM Celaya

Sitio estático de Linces por el Servicio del TecNM Celaya. TypeScript y Tailwind se compilan para producir el sitio público de Firebase Hosting. No hay servidor propio, base de datos ni almacenamiento de formularios.

## Requisitos

- Node.js 22 LTS, indicado en **.nvmrc**.
- npm, incluido con Node.js.
- Una cuenta con acceso al proyecto Firebase **sitio-lincesporelservicio** para publicar.

## Instalación, verificación y vista local

Desde la raíz del proyecto:

~~~bash
npm ci
npm run check
npm run build
python -m http.server 8000 --directory static
~~~

Abre http://localhost:8000. El build también verifica que las páginas, rutas locales, fuentes y recursos necesarios para Hosting estén presentes.

## Publicación en Firebase Hosting

Autentica Firebase CLI si aún no lo has hecho y publica:

~~~bash
firebase login
npm run deploy
~~~

El comando npm run deploy genera el sitio y después publica el directorio static/. El proyecto activo está indicado en **.firebaserc**. Revisa la versión publicada desde Firebase Console; Hosting conserva el historial de releases para restaurar una versión anterior.

Los workflows de GitHub compilan el sitio y generan un preview para pull requests; cada push a main publica automáticamente en el canal live. Para activarlos, agrega en GitHub Settings > Secrets and variables > Actions el secreto FIREBASE_SERVICE_ACCOUNT_SITIO_LINCESPORELSERVICIO con el JSON de una cuenta de servicio autorizada en el proyecto Firebase. GitHub proporciona GITHUB_TOKEN automáticamente.

## Reiniciar el repositorio de GitHub

GitHub muestra la fecha del commit más reciente que cambió cada archivo; volver a subir el mismo historial no cambia esas fechas. Para iniciar un historial nuevo conserva los archivos y reinicia solo Git local. Primero crea un repositorio vacío en GitHub, sin README, licencia ni `.gitignore`, y ejecuta desde la raíz del proyecto en PowerShell:

~~~powershell
Remove-Item -Recurse -Force .git
git init -b main
git add -A
git commit -m "Publicación inicial"
git remote add origin https://github.com/USUARIO/NOMBRE-REPOSITORIO.git
git push -u origin main
~~~

Esto sustituye el historial local anterior y sube todos los archivos como una publicación inicial. Si solo cambiaste la URL del repo remoto, conserva el historial y usa `git remote set-url origin https://github.com/USUARIO/NOMBRE-REPOSITORIO.git`; en ese caso GitHub seguirá mostrando las fechas de los commits existentes. La fecha de la última actualización puede tardar en aparecer y no cambia la fecha del commit.

El workflow de GitHub publica automáticamente cada push a `main`. Antes de conectarlo, verifica en GitHub Settings > Secrets and variables > Actions que existe el secreto `FIREBASE_SERVICE_ACCOUNT_SITIO_LINCESPORELSERVICIO` con una cuenta de servicio autorizada en Firebase. GitHub proporciona `GITHUB_TOKEN` automáticamente. Los pull requests del mismo repositorio generan un preview; los pull requests de forks no reciben el secreto de Firebase.
## Formularios y privacidad

Los formularios de apoyo y colaboración validan los campos en el navegador y abren un borrador de correo. No envían ni almacenan información. Los datos pasan a la aplicación de correo que elija la persona; no se deben solicitar datos sensibles.

El enlace de participación lleva a un formulario externo de Google, sujeto a las prácticas del proveedor. El sitio no integra analítica ni cookies propias. Si en el futuro se recopilan datos en un servicio, revisa el aviso de privacidad y los requisitos aplicables.

## Revisión editorial y operativa

Antes de publicar, confirma que el correo, las redes, el blog y el formulario externo estén vigentes; verifica los permisos de uso de las fotografías y revisa la página en navegadores actuales y un teléfono real. Después de publicar, comprueba imágenes, fuentes, enlaces, metadatos, la página 404 y la consola del navegador.

## Archivos de la raíz

| Archivo | Para qué sirve |
| --- | --- |
| **.firebaserc** | Asocia Firebase CLI con el proyecto sitio-lincesporelservicio. No contiene credenciales. |
| **.gitattributes** | Mantiene finales de línea consistentes en Windows y Linux y marca imágenes y fuentes como archivos binarios. |
| **.gitignore** | Evita incluir dependencias, archivos locales, logs y artefactos generados en Git. |
| **.nvmrc** | Indica Node.js 22 para desarrollo y CI. |
| **firebase.json** | Configura el directorio público, exclusiones, cabeceras de seguridad y caché de Hosting. |
| **index.html** | HTML fuente editable. El build adapta sus rutas para la carpeta pública. |
| **package.json** | Declara herramientas de desarrollo y comandos de check, build y deploy. |
| **package-lock.json** | Fija las versiones exactas que instala npm ci. |
| **README.md** | Documenta instalación, operación, privacidad y archivos del proyecto. |
| **robots.txt** | Indica a los buscadores qué pueden rastrear y dónde está el sitemap. |
| **sitemap.xml** | Declara la URL pública principal para los buscadores. |
| **tailwind.config.ts** | Define los archivos de contenido y los colores y tipografías del diseño. |
| **tsconfig.json** | Configura la compilación estricta de TypeScript del navegador hacia JavaScript. |
| **tsconfig.scripts.json** | Configura la compilación estricta de los scripts de mantenimiento. |

## Código y automatización

| Ruta | Para qué sirve |
| --- | --- |
| **src/main.ts** | Código tipado de la navegación activa, las pestañas, formularios, modales, animaciones y avisos accesibles. |
| **scripts/clean.ts** | Retira los archivos generados antes de iniciar un build nuevo. |
| **scripts/prepare-site.ts** | Prepara static/index.html, copia el JavaScript compilado y los archivos SEO al directorio publicado. |
| **scripts/verify-output.ts** | Verifica la estructura de Hosting, las rutas del HTML, el JSON-LD y los recursos usados por CSS; muestra el resultado general al terminar. |
| **.github/workflows/firebase-hosting-merge.yml** | Compila y publica al integrar cambios en la rama main. |
| **.github/workflows/firebase-hosting-pull-request.yml** | Compila y crea un canal preview para pull requests del mismo repositorio. |

## Carpeta static/

Esta carpeta contiene los recursos fuente estáticos y es el destino público de Firebase Hosting.

| Ruta | Para qué sirve |
| --- | --- |
| **static/404.html** | Página de error 404 con el estilo e identidad del sitio. |
| **static/style.css** | Estilos personalizados: navegación, dock móvil, modales, scrollbar, animaciones y accesibilidad. |
| **static/tailwind.input.css** | Directivas de entrada para generar el CSS de Tailwind. |
| **static/tailwind.css** | CSS compilado. Se regenera con npm run build; no editarlo a mano. |
| **static/index.html** | Copia pública generada desde el HTML raíz, con rutas apropiadas para Hosting. |
| **static/app.js** | JavaScript generado desde src/main.ts; no editarlo a mano. |
| **static/main.js** | Archivo intermedio de compilación de TypeScript; el build lo renombra y elimina. |
| **static/robots.txt** y **static/sitemap.xml** | Copias de los archivos SEO de la raíz, generadas al compilar. |
| **static/css/all.min.css** | Hoja local de iconos Font Awesome. |
| **static/css/FONTAWESOME-LICENSE.txt** | Aviso de licencia de Font Awesome. |
| **static/css/local-fonts.css** | Reglas locales @font-face para las tipografías del diseño. |
| **static/fonts/** | Fuentes WOFF2 de Plus Jakarta Sans, Playfair Display y Cormorant Garamond. Los nombres indican familia, subconjunto de caracteres, peso y estilo; los subconjuntos permiten descargar solo los glifos necesarios. Incluye las licencias OFL de las tres familias. |
| **static/webfonts/** | Fuentes de Font Awesome: fa-solid-900 para iconos sólidos, fa-regular-400 para iconos regulares, fa-brands-400 para marcas y fa-v4compatibility para compatibilidad. WOFF2 es el formato preferido y TTF es respaldo. |
| **static/icons/REDONDEADO-LPS-512.png** | Icono optimizado del sitio para favicon y dispositivos Apple. |
| **static/icons/REDONDEADO-LPS-LOGO.png** | Imagen original del icono, conservada como recurso maestro y excluida del deploy. |
| **static/images/LOGO-LPS-256.png** | Logo optimizado que usa el encabezado y el pie de página. |
| **static/images/LOGO-LPS.png** | Logo original, conservado como recurso maestro y excluido del deploy. |
| **static/images/equipo-linces.jpeg** | Fotografía fija que aparece en el hero y en la vista previa al compartir el sitio. |
| **static/images/2-carrousel.jpeg**, **3-carrousel.jpeg** | Fotografías conservadas como recursos; la página actual no las muestra. |

## Archivos generados y recursos locales

node_modules/ contiene las dependencias instaladas por npm y no se versiona. El build genera archivos ignorados por Git dentro de static/; puedes recrearlos con npm run build. Los originales del logo se conservan en el proyecto, pero Firebase no los sube porque la página utiliza sus versiones optimizadas.
