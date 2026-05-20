# Manual de Operación: Diego Molina Joyero

Este documento está diseñado para enseñarte cómo actualizar el contenido de tu página web (Catálogo y Testimonios) de forma fácil y segura, sin necesidad de tocar código.

Todo el contenido de la web está conectado a un archivo de **Google Sheets** y a tu aplicación de **AppSheet**.

---

## 📸 1. ¿Cómo funcionan las imágenes?

La web no guarda las imágenes directamente. Lee las fotos que subes a través de tu aplicación de inventario en AppSheet.

**Regla de Oro:** Siempre que vayas a agregar una foto nueva (ya sea de un producto o de un cliente), hazlo **primero desde tu aplicación de AppSheet en tu celular o PC**. 
AppSheet se encargará de guardar la foto en la carpeta correcta de Google Drive y de escribir el nombre del archivo (Ej: `Articulos_Images/anillo_oro_1.jpg`) en tu hoja de Google Sheets automáticamente.

---

## 💍 2. Actualizar el Catálogo de Joyas (Colección)
 
Ve a tu archivo de Google Sheets. Ahora el catálogo funciona con **dos pestañas principales**: **`articulos`** y **`categorias`**.

### Gestión de Categorías (NUEVO)
Los botones de filtro que aparecen en la página (Anillos, Collares, etc.) ahora se generan automáticamente leyendo la pestaña **`categorias`**.
1. En tu pestaña **`categorias`**, la primera columna (Columna A) debe tener el ID de AppSheet y la segunda columna (Columna B) el nombre real que quieres que aparezca en el botón de la web.
2. Ya no hay necesidad de modificar el código de la web para añadir o quitar botones; simplemente agrega o elimina filas en esta hoja de Google Sheets.

### Gestión de Artículos
En la pestaña **`articulos`**, las columnas mantienen su estructura, pero con una mejora clave:
1.  **id:** Un número o código único para la joya (Ej: `AN-001`).
2.  **nombre:** El título comercial de la pieza (Ej: `Anillo Esmeralda 18k`).
3.  **categoria:** Gracias al nuevo sistema de AppSheet, aquí ahora se guarda un **ID de Referencia** (Ej: `ID_001`). La web es inteligente y traducirá este ID automáticamente al nombre real buscando en tu pestaña de categorías.
4.  **precio:** El precio o texto que quieras mostrar (Ej: `$1,500.00 USD` o `Consultar`).
5.  **imagen_principal:** Foto principal de frente (antes se llamaba solo `imagen`). Deja que AppSheet la llene.
6.  **imagen_detalle:** (NUEVO) Foto a 45 grados para el efecto de movimiento al pasar el mouse. Si no tienes foto de detalle, deja esta celda vacía y la web mostrará la principal de forma estática.
 
**Para agregar un producto:** Simplemente añade una nueva fila desde AppSheet o directamente en Sheets. El producto aparecerá en la web automáticamente.
**Para borrar un producto:** Selecciona toda la fila y elimínala.

---

## ⭐ 3. Actualizar los Testimonios (Página Principal)

Ve a tu archivo de Google Sheets y abre la pestaña **`testimonios`**.

El orden exacto de las columnas debe ser:
1.  **id_testimonio:** Un número (1, 2, 3...).
2.  **nombre_cliente:** Nombre a mostrar (Ej: `Valeria M.`).
3.  **comentario:** El texto del testimonio. Puedes usar comas y signos de puntuación normalmente.
4.  **foto_cliente:** Al igual que los artículos, sube la foto desde AppSheet para que este campo se llene con la ruta (Ej: `Testimonios_Images/foto1.jpg`).
5.  **joya_comprada:** Una breve descripción de lo que compró (Ej: `Anillo de Compromiso`).
6.  **fecha:** (Opcional, la web no la muestra por ahora, pero sirve para tu control).

**Notas sobre los testimonios:**
*   Si un cliente no quiere mostrar su foto, asegúrate de dejar la celda `foto_cliente` vacía. La web mostrará automáticamente el logo de "Diego Molina Joyero" como avatar por defecto.
*   Intenta que los comentarios no sean extremadamente largos para que el diseño de las tarjetas se vea uniforme.

---

## ⚠️ 4. Precauciones Muy Importantes

1.  **Mantén los nombres de los encabezados.** La web busca las palabras `id`, `nombre`, `categoria`, `precio`, `imagen_principal` e `imagen_detalle`. Si cambias "nombre" por "título", la web no encontrará los datos.
2.  **Sincronización:** Si subes una foto desde Sheets pero no aparece, recuerda que es mejor hacerlo desde **AppSheet** para asegurar que el nombre del archivo sea correcto y compatible con la web.
3.  **Espacios Indeseados:** La web ya incorpora filtros para limpiar automáticamente los espacios sobrantes y convertir las categorías a minúsculas para evitar errores, pero siempre es buena práctica mantener tus nombres en la pestaña `categorias` limpios y claros.
4.  **Publicar en la web:** NO desactives la opción "Publicar en la web" en Google Sheets (Archivo > Compartir > Publicar en la web). Recuerda que tanto la pestaña de artículos, testimonios como la nueva de **categorías** deben estar publicadas para que la web funcione de forma paralela y ultrarrápida.
