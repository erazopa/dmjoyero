// 1. CONFIGURACIÓN: Pega aquí tu enlace de Google Sheets (formato CSV)
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQplJLgwiCyvjSLgmlSmoLWQZU3CGpUu7NhBQDVeBE25dZgVZCboh-xck1n1stdrz26vXmddxOBXXzB/pub?gid=2045739103&single=true&output=csv' + '&t=' + new Date().getTime();
const CATEGORIAS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQplJLgwiCyvjSLgmlSmoLWQZU3CGpUu7NhBQDVeBE25dZgVZCboh-xck1n1stdrz26vXmddxOBXXzB/pub?gid=34008818&single=true&output=csv'; // Pega aquí el enlace CSV de la nueva pestaña de Categorías

document.addEventListener('DOMContentLoaded', () => {

    // --- TUS FUNCIONES DE UI ORIGINALES ---

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Page Transition Logic
    const transitionOverlay = document.querySelector('.page-transition');
    if (transitionOverlay) {
        transitionOverlay.classList.add('active');
        setTimeout(() => {
            transitionOverlay.classList.remove('active');
        }, 500);
    }

    // --- NUEVA LÓGICA: CARGA DINÁMICA DE PRODUCTOS ---
    cargarProductos();

});

// --- CONFIGURACIÓN GLOBAL DE APPSHEET ---
const appNameEncoded = encodeURIComponent("Hojadecálculosintítulo-534273002");
const tableName = "articulos";

async function cargarProductos() {
    const grid = document.getElementById('masonry-grid');
    const filtersContainer = document.getElementById('dynamic-filters');
    if (!grid) return;

    grid.innerHTML = `<p style="color: white; text-align: center; width: 100%;">Cargando piezas exclusivas...</p>`;

    try {
        // --- LÓGICA DE DOBLE CARGA (Promise.all) ---
        const urlCat = CATEGORIAS_CSV_URL + (CATEGORIAS_CSV_URL.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
        
        // Ejecutar ambas peticiones en paralelo
        const [responseArt, responseCat] = await Promise.all([
            fetch(SHEET_CSV_URL),
            fetch(urlCat)
        ]);

        const dataArticulos = await responseArt.text();
        const dataCategorias = await responseCat.text();

        // --- MAPEO / DICCIONARIO DE CATEGORÍAS ---
        const rawCat = parseCSV(dataCategorias);
        const mapaCategorias = {};
        let categoriasDinamicas = [];

        if (rawCat.length > 1) {
            const filasCat = rawCat.slice(1);
            filasCat.forEach(fila => {
                const idCat = fila[0] ? fila[0].trim() : ""; // Columna A (ID de AppSheet)
                const nombreCat = fila[1] ? fila[1].trim() : ""; // Columna B (Nombre real de la Categoría)
                
                if (idCat !== "" && nombreCat !== "") {
                    mapaCategorias[idCat] = nombreCat; // Ej: mapaCategorias["ID_001"] = "Anillos"
                    categoriasDinamicas.push(nombreCat); // Para generar los botones
                }
            });
        }

        // --- PROCESAR ARTÍCULOS ---
        const rawData = parseCSV(dataArticulos);
        const headers = rawData[0];
        const filas = rawData.slice(1);

        // Buscar índices por nombre de columna (Mapeo Dinámico)
        const idx = {
            id: headers.findIndex(h => h.toLowerCase().includes('id')),
            nombre: headers.findIndex(h => h.toLowerCase().includes('nombre')),
            categoria: headers.findIndex(h => h.toLowerCase().includes('categoria')),
            precio: headers.findIndex(h => h.toLowerCase().includes('precio')),
            imagen: headers.findIndex(h => h.toLowerCase().includes('imagen_principal') || h.toLowerCase() === 'imagen'),
            detalle: headers.findIndex(h => h.toLowerCase().includes('imagen_detalle')),
            archivo3d: headers.findIndex(h => h.toLowerCase().includes('archivo_3d'))
        };

        // --- RENDERIZAR MENÚ DINÁMICO DE CATEGORÍAS ---
        if (filtersContainer) {
            // Limpiar y asegurar el botón "Todos"
            filtersContainer.innerHTML = '<button class="filter-btn active" data-filter="all">Todos</button>';

            // Eliminar duplicados si los hay
            const categoriasUnicas = [...new Set(categoriasDinamicas)];

            categoriasUnicas.forEach(catNombre => {
                // Normalización de Filtros: .toLowerCase().trim()
                const filterValue = catNombre.toLowerCase().trim();
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.setAttribute('data-filter', filterValue);
                btn.textContent = catNombre; // Mostrar el nombre original
                filtersContainer.appendChild(btn);
            });
        }

        grid.innerHTML = "";

        filas.forEach((columnas, index) => {
            if (columnas.length >= 2) {
                // Traducción en caliente del ID a Nombre usando mapaCategorias
                let idCategoriaArticulo = idx.categoria !== -1 ? columnas[idx.categoria].trim() : "";
                let nombreCategoriaTraducido = mapaCategorias[idCategoriaArticulo] || "general";
                
                const producto = {
                    id: idx.id !== -1 ? columnas[idx.id].trim() : "N/A",
                    nombre: idx.nombre !== -1 ? columnas[idx.nombre].trim() : "Sin nombre",
                    categoria: nombreCategoriaTraducido,
                    precio: idx.precio !== -1 ? columnas[idx.precio].trim() : "",
                    imagen: idx.imagen !== -1 ? columnas[idx.imagen].trim() : "",
                    imagen_detalle: (idx.detalle !== -1 && columnas[idx.detalle] && columnas[idx.detalle].trim() !== "") ? columnas[idx.detalle].trim() : null,
                    archivo_3d: (idx.archivo3d !== -1 && columnas[idx.archivo3d] && columnas[idx.archivo3d].trim() !== "") ? columnas[idx.archivo3d].trim() : null
                };

                // Si la categoría está vacía o es ID huérfano, asegurar "general" y normalizar
                producto.categoria = producto.categoria === "" ? "general" : producto.categoria.toLowerCase().trim();

                const fotoP = producto.imagen;
                const fotoD = producto.imagen_detalle || "N/A";

                // Log de Verificación Solicitado
                console.log("Mapeo final -> Principal: " + fotoP + " | Detalle: " + fotoD);

                // Construcción de URLs con concatenación clásica (Evita errores de codificación)
                const urlPrincipal = "https://www.appsheet.com/template/gettablefileurl?appName=" + appNameEncoded + "&tableName=" + encodeURIComponent(tableName) + "&fileName=" + encodeURIComponent(fotoP);

                let htmlImagenes = `<img src="${urlPrincipal}" alt="${producto.nombre}" class="img-main" loading="lazy">`;
                let urlDetalle = "";
                let claseHover = "";
                if (producto.imagen_detalle && producto.imagen_detalle !== "N/A") {
                    urlDetalle = "https://www.appsheet.com/template/gettablefileurl?appName=" + appNameEncoded + "&tableName=" + encodeURIComponent(tableName) + "&fileName=" + encodeURIComponent(fotoD);
                    claseHover = "has-hover";
                }

                const card = document.createElement('div');
                card.className = `masonry-item`;
                // Normalización de atributo data-category
                card.setAttribute('data-category', producto.categoria);

                card.innerHTML = `
                    <div class="gallery-card ${claseHover}">
                        <div class="image-wrapper">
                            <img src="${urlPrincipal}" class="img-main" alt="${producto.nombre}">
                            ${producto.imagen_detalle ? `<img src="${urlDetalle}" class="img-hover" alt="${producto.nombre} detalle">` : ''}
                        </div>
                        <div class="gallery-info">
                            <h3>${producto.nombre}</h3>
                            <p class="category">${producto.categoria.toUpperCase()}</p>
                            <p class="ref">Ref: ${producto.id}</p>
                            <button onclick="enviarCotizacionWA('${producto.nombre.replace(/'/g, "\\'")}', '${producto.id}', '${urlPrincipal}')" class="btn btn-cotizar">
                                <i class="fab fa-whatsapp"></i> Cotizar
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            }
        });

        activarFiltros();

    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = `<p style="color: white;">No se pudo conectar con el catálogo.</p>`;
    }
}

// Helper function to parse CSV correctly (handling quotes and commas)
function parseCSV(text) {
    const result = [];
    let row = [];
    let col = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            col += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            row.push(col.trim());
            col = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (col !== '' || row.length > 0) {
                row.push(col.trim());
                result.push(row);
                col = '';
                row = [];
            }
            if (char === '\r' && nextChar === '\n') i++;
        } else {
            col += char;
        }
    }
    if (col !== '' || row.length > 0) {
        row.push(col.trim());
        result.push(row);
    }
    return result;
}


// Función para que los botones de "Anillos", "Collares", etc. funcionen con los nuevos productos
function activarFiltros() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter').toLowerCase().trim();

            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category').toLowerCase().trim();

                // Lógica estricta: debe coincidir exactamente con la categoría
                const isMatch = filter === 'all' || itemCategory === filter;

                if (isMatch) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 400);
                }
            });
        };
    });
}

// Función para el botón de WhatsApp
function enviarCotizacionWA(nombre, id, imagenUrl) {
    const tel = "573135308520";
    // Codificamos la URL completa para que WhatsApp la trate como texto plano
    const imagenEncoded = encodeURIComponent(imagenUrl);

    const mensaje = `¡Hola! 👋 Me interesa esta pieza de su colección:%0A%0A` +
        `*Joya:* ${nombre}%0A` +
        `*Ref:* ${id}%0A%0A` +
        `*Ver imagen:* ${imagenEncoded}`;

    window.open(`https://wa.me/${tel}?text=${mensaje}`, '_blank');
}