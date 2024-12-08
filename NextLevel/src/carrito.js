document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItems");
    const emptyCartButton = document.querySelector(".empty-cart-btn");
    const checkoutButton = document.querySelector(".checkout-btn");
    const subtotalElement = document.querySelector(".subtotal");
    const ivaElement = document.querySelector(".iva");
    const totalElement = document.querySelector(".total");
    const carritoModal = document.querySelector(".carrito_modal");
    const carritoCerrarModal = document.querySelector(".carrito_boton-cerrar");
    const carritoResumen = document.querySelector(".carrito_resumen");

    function formatNumber(number) {
        return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // 'es-ES' es para España, usa 'es-LA' para LATAM si prefieres
    }
    
// Función para actualizar el carrito
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cartItems"); // Asegúrate que este contenedor esté en tu HTML
    const subtotalElement = document.querySelector(".subtotal"); // Asegúrate que esta clase esté en tu HTML
    const ivaElement = document.querySelector(".iva"); // Asegúrate que esta clase esté en tu HTML
    const totalElement = document.querySelector(".total"); // Asegúrate que esta clase esté en tu HTML

    cartItemsContainer.innerHTML = ""; // Limpiar el carrito antes de cargarlo
    let subtotal = 0;

    cart.forEach((item, index) => {
        // Crear elementos para cada producto
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        itemDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>Precio: $${formatNumber(item.price)} COP</p>
            <p>Cantidad: ${item.quantity}</p>
            <p>Total: $${formatNumber(item.total)} COP</p>
            <button class="remove-btn" data-index="${index}">Eliminar</button>
        `;

        // Mostrar el producto en el carrito
        cartItemsContainer.appendChild(itemDiv);

        // Sumar al subtotal
        subtotal += parseFloat(item.total);
    });

    // Calcular IVA y total
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    // Mostrar valores en la UI con formato
    subtotalElement.textContent = `$${formatNumber(subtotal.toFixed(2))} COP`;
    ivaElement.textContent = `$${formatNumber(iva.toFixed(2))} COP`;
    totalElement.textContent = `$${formatNumber(total.toFixed(2))} COP`;
}

    // Eliminar un producto del carrito
    cartItemsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1); // Eliminar el producto seleccionado
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart(); // Recargar el carrito
        }
    });

    // Vaciar el carrito
    emptyCartButton.addEventListener("click", () => {
        localStorage.removeItem("cart");
        loadCart(); // Recargar el carrito
    });

    // Comprar y verificar usuario
    checkoutButton.addEventListener("click", () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!usuario) {
            alert("Por favor, inicia sesión para realizar la compra.");
            return;
        }

        // Mostrar modal con la información de la compra
        carritoModal.style.display = "block";

        // Resumen de la compra
        carritoResumen.innerHTML = `
            <p><strong>ID:</strong> ${usuario.id}</p>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>Dirección:</strong> ${usuario.direccion}</p>
            <p><strong>Total Compra:</strong> $${totalElement.textContent}</p>
        `;
    });

    // Cerrar el modal
    carritoCerrarModal.addEventListener("click", () => {
        carritoModal.style.display = "none";
    });

    // Inicializar carrito
    loadCart();
});







// función para añadir efectos visuales y mejorar la experiencia de usuario
document.addEventListener('DOMContentLoaded', () => {
    // añadir efectos de animación a los elementos del carrito
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        // añadir animación de entrada suave
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // usar animación para mostrar elementos
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);
    });

    // mejora de interactividad para botones
    const buttons = document.querySelectorAll('.carrito_boton, .carrito_boton-eliminar');
    buttons.forEach(button => {
        // añadir efecto de vibración al hacer clic
        button.addEventListener('click', () => {
            button.style.animation = 'vibrate 0.3s';
            setTimeout(() => {
                button.style.animation = '';
            }, 300);
        });
    });

    // añadir validación básica antes de comprar
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
            
            // mostrar mensaje si el carrito está vacío
            if (cartItems.length === 0) {
                alert('🎮 ¡Carrito vacío! Agrega algunos productos antes de comprar.');
                return;
            }
        });
    }

    // añadir contador de productos en ícono de carrito
    const updateCartCounter = () => {
        const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
        const cartIcon = document.querySelector('.fa-cart-shopping');
        
        if (cartIcon) {
            // crear o actualizar contador
            let badge = cartIcon.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.classList.add('cart-badge');
                cartIcon.appendChild(badge);
            }
            
            badge.textContent = cartItems.length;
            badge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: var(--accent-color);
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 10px;
            `;
        }
    };

    // añadir estilos adicionales para mejorar la experiencia visual
    const addCustomStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes vibrate {
                0% { transform: rotate(0deg); }
                25% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
                75% { transform: rotate(-5deg); }
                100% { transform: rotate(0deg); }
            }
            
            .cart-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: #ff0861;
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 10px;
            }
        `;
        document.head.appendChild(style);
    };

    // ejecutar funciones de mejora
    updateCartCounter();
    addCustomStyles();

    // actualizar contador cuando cambia el carrito
    window.addEventListener('storage', updateCartCounter);
});

// validaciones adicionales para el formulario de pago (sin modificar el modal anterior)
document.addEventListener('DOMContentLoaded', () => {
    const confirmButton = document.querySelector('.carrito_boton-comprar');
    
    if (confirmButton) {
        confirmButton.addEventListener('click', (e) => {
            // añadir una pequeña validación adicional
            const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
            
            if (cartItems.length === 0) {
                e.preventDefault();
                alert('🎮 No puedes finalizar una compra con el carrito vacío');
                return;
            }

            // añadir confirmación adicional
            const confirmPurchase = confirm('¿Estás seguro de realizar esta compra de productos gamer?');
            
            if (!confirmPurchase) {
                e.preventDefault();
            }
        });
    }
});
