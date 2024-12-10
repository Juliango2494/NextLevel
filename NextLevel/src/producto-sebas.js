const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".i img", {
    ...scrollRevealOption,
    origin: "right",
});
ScrollReveal().reveal(".productos-exhibicion h2", {
    ...scrollRevealOption,
    delay: 500,
});

const API_URL = 'http://localhost:3000/products';

const usuario = JSON.parse(localStorage.getItem('usuario'));
const usuarioLog = document.getElementById('usuarioLog');

if (usuario) {
  usuarioLog.textContent = usuario.email; // Agrega el email del usuario al contenido de la etiqueta <p>
} else {
  usuarioLog.textContent = ''; // Asegura que esté vacío si no hay usuario
}

async function fetchProductsForCarousel() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        const carouselTrack = document.getElementById('carouselTrack');

        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.classList.add('carousel-item');
            listItem.innerHTML = `
                <img src="data:image/jpeg;base64,${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>$${Number(product.price).toFixed(2)}</p>
            `;
            carouselTrack.appendChild(listItem);
        });

        initializeCarousel();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function initializeCarousel() {
    const track = document.querySelector('.carousel-track');
    const items = Array.from(track.children);

    let currentIndex = 0;
    let autoMoveInterval;

    function updateCarousel() {
        const itemWidth = items[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    function moveToNext() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    function startAutoMove() {
        clearInterval(autoMoveInterval); // Limpia cualquier temporizador previo
        autoMoveInterval = setInterval(moveToNext, 2000); // Inicia un nuevo temporizador
    }

    function stopAutoMove() {
        clearInterval(autoMoveInterval); // Detiene el temporizador actual
    }

    // Configuración del desplazamiento automático
    startAutoMove();

    // Pausar y reanudar cuando el usuario interactúe
    track.addEventListener('mouseenter', stopAutoMove);
    track.addEventListener('mouseleave', startAutoMove);

    updateCarousel();
}

// Cargar los productos en el carrusel al cargar la página
document.addEventListener('DOMContentLoaded', fetchProductsForCarousel);
