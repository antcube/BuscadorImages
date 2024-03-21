// Selecciona los elementos del DOM necesarios
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

// Variables para completar el paginador
const registrosPorPagina = 40;
let paginaActual = 1;
let totalPaginas;
let iterador;

// Agrega un event listener al formulario cuando la ventana se carga
window.addEventListener('load', () => {
    formulario.addEventListener('submit', validarFormulario);
})

// Función para validar el formulario
function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value.trim();

    // Si el término de búsqueda está vacío, muestra un mensaje
    if(terminoBusqueda === '') {
        mostrarMensaje('Agrega un término de búsqueda');
        return;
    }

    // Si el término de búsqueda no está vacío, busca las imágenes
    buscarImagenes();
}

// Función para mostrar un mensaje
function mostrarMensaje(mensaje) {
    const existeAlerta = document.querySelector('.alerta');

    // Si no existe una alerta, la crea
    if(!existeAlerta) {
        const alerta = document.createElement('P')
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'font-bold', 'alerta');
        alerta.textContent = 'Error! ';
    
        const span = document.createElement('SPAN');
        span.classList.add('font-normal', 'block', 'sm:inline');
        span.textContent = mensaje;
    
        alerta.append(span);
    
        formulario.append(alerta);
    
        // Remueve la alerta después de 2 segundos
        setTimeout(() => {
            alerta.remove();
        }, 2000)
    }
}

// Función para buscar las imágenes
function buscarImagenes() {
    const termino = document.querySelector('#termino').value.trim();
    const key = '42962534-06f8e83933d2d4862576a1d6e';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    // Realiza la petición a la API de Pixabay
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits, termino);
        })
}

// La función toma un argumento 'total', que representa el número total de registros y devuelve el número total de páginas.
function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

// Función para mostrar las imágenes
function mostrarImagenes(imagenes, nombreTermino) {
    // Limpia el HTML del contenedor de resultados
    limpiarHTML(resultado);

    // Itera sobre las imágenes y las muestra
    imagenes.forEach( imagen => {
        // Destructuring
        const { previewURL, likes, views, largeImageURL } = imagen

        // Creación contenedor para las imagenes y texto
        const divPrincipal = document.createElement('DIV');
        divPrincipal.classList.add('w-1/2', 'md:w-1/3', 'lg:w-1/4', 'p-3', 'mb-4');

        const img = document.createElement('IMG');
        img.classList.add('w-full', 'h-48', 'object-cover');
        img.src = previewURL;
        img.alt = `Imagen de ${nombreTermino}`;

        const divTexto = document.createElement('DIV');
        divTexto.classList.add('bg-white', 'p-4');

        const pLikes = document.createElement('P');
        pLikes.classList.add('font-bold');
        pLikes.innerHTML= `${likes} <span class="font-light">Me gusta</span>`

        const pViews = document.createElement('P');
        pViews.classList.add('font-bold');
        pViews.innerHTML= `${views} <span class="font-light">Veces Vista</span>`

        const botonVerImagen = document.createElement('A');
        botonVerImagen.classList.add('block', 'w-full', 'bg-blue-800', 'hover:bg-blue-500', 'text-white', 'uppercase', 'font-bold', 'text-center', 'rounded', 'mt-5', 'p-1');
        botonVerImagen.href = largeImageURL;
        botonVerImagen.target = '_blank';
        botonVerImagen.rel = 'noopener noreferrer';
        botonVerImagen.textContent = 'Ver Imagen';

        divTexto.append(pLikes);
        divTexto.append(pViews);
        divTexto.append(botonVerImagen);

        divPrincipal.append(img);
        divPrincipal.append(divTexto);

        resultado.append(divPrincipal);
    });

    limpiarHTML(paginacionDiv);

    imprimirPaginador();
}

// La función 'imprimirPaginador' crea botones de paginación en base al número total de páginas.
function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    // Luego, recorre cada página en el iterador. El `for...of` ya contiende .next()
    for (const pagina of iterador) {
        const boton = document.createElement('A');
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');
        boton.textContent = pagina;
        boton.dataset.pagina = pagina;
        boton.href = '#';

        paginacionDiv.append(boton);

        // Añade un evento de click al botón. Cuando se hace click en el botón, se actualiza 'paginaActual' al número de la página y se llama a la función 'buscarImagenes'.
        boton.addEventListener('click', () => {
            paginaActual = pagina;

            buscarImagenes();
        });
    }
}

// La función 'crearPaginador' es un generador que produce una secuencia de números desde 1 hasta 'total'.
function *crearPaginador(total) {
    // Cada vez que se llama a 'next' en el iterador, devuelve el siguiente número en la secuencia.
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

// Función para limpiar el HTML de un contenedor
function limpiarHTML(contenedor) {
    while(contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}