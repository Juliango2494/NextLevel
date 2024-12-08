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
