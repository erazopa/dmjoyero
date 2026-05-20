# Diego Molina Joyero - Catálogo Web Dinámico

Este proyecto es el sitio web y catálogo interactivo para **Diego Molina Joyero**. Está diseñado para ofrecer una experiencia premium y elegante, reflejando la calidad de la alta joyería, mientras mantiene una administración de contenido extremadamente sencilla basada en Google Sheets y AppSheet.

## 🚀 Tecnologías Utilizadas

El proyecto fue desarrollado bajo una arquitectura estática (Serverless) para garantizar máxima velocidad de carga y facilidad de alojamiento, delegando el manejo de datos a herramientas de Google.

*   **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla ES6+).
*   **Base de Datos (Headless CMS):** Google Sheets (Publicado como CSV).
*   **Hosting de Imágenes:** AppSheet (Vía endpoint `gettablefileurl`).
*   **Fuentes e Íconos:** Google Fonts (Cinzel, Inter), FontAwesome.

## 📁 Estructura del Proyecto

```text
diego-molina-joyero/
│
├── index.html           # Landing page (Hero, Servicios, Proceso 3D, Testimonios dinámicos)
├── coleccion.html       # Catálogo principal con filtros y renderizado dinámico
├── README.md            # Documentación técnica (este archivo)
├── MANUAL_ADMINISTRADOR.md # Guía para gestionar el contenido en Google Sheets
│
├── css/
│   └── styles.css       # Hoja de estilos global (Diseño responsive, variables de color)
│
├── js/
│   ├── script.js        # Lógica de index.html (Navegación, animaciones, carga de testimonios)
│   └── coleccion.js     # Lógica de coleccion.html (Fetch de artículos, filtros, API de WhatsApp)
│
├── images/              # Activos estáticos (Logos, placeholders)
└── videos/              # Videos locales (Ej. Proceso 3D)
```

## ⚙️ Arquitectura de Datos

El sitio no requiere un servidor backend tradicional (Node.js, PHP, etc.). Funciona de la siguiente manera:

1.  **Obtención de Texto:** JavaScript (`fetch`) lee los datos desde una hoja de cálculo de Google Sheets publicada en la web en formato CSV. El código parsea este CSV y lo convierte en objetos JavaScript.
2.  **Obtención de Imágenes:** Los nombres de archivo alojados en la columna de imágenes (ej. `Articulos_Images/anillo1.jpg`) se pasan por el endpoint público de AppSheet (`https://www.appsheet.com/template/gettablefileurl`), el cual devuelve la imagen binaria alojada en el Google Drive vinculado a la App de AppSheet.
3.  **Cotización:** Los botones de "Cotizar" inyectan los datos del producto dinámicamente en una URL de la API de WhatsApp (`wa.me`), abriendo el chat prellenado con la información exacta que el cliente está viendo.

## 💻 Desarrollo Local y Despliegue

### Entorno de Desarrollo
Para probar el sitio localmente, no puedes simplemente abrir los archivos HTML dándoles doble clic en el explorador debido a las políticas de CORS del navegador al hacer peticiones `fetch`.

Debes usar un servidor local. Si usas VS Code, la extensión **Live Server** es la mejor opción. Alternativamente, puedes usar Python:
```bash
# Ejecutar en la raíz del proyecto
python -m http.server 8000
```
Luego navega a `http://localhost:8000`

### Despliegue (Producción)
Al ser un sitio puramente estático, puede ser alojado de forma gratuita y escalable en plataformas como:
*   GitHub Pages
*   Vercel
*   Netlify
*   Cualquier hosting compartido tradicional (Hostinger, GoDaddy, etc.) subiendo los archivos vía FTP.

## 🛠️ Notas para Desarrolladores Futuros

*   **Parseo de CSV:** Dado que Google Sheets puede incluir comas dentro de campos de texto (ej. en descripciones o comentarios), se implementó una función manual `parseCSV()` en ambos archivos `.js`. No sustituyas esto por un simple `.split(',')` o romperás los datos.
*   **Codificación de URLs:** Es vital mantener el uso de `encodeURIComponent()` en las URLs de AppSheet y en los enlaces de WhatsApp para evitar que caracteres especiales (tildes, &, =, comillas) rompan las peticiones.
