document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItems");
    const emptyCartButton = document.querySelector(".empty-cart-btn");
    const checkoutButton = document.querySelector(".checkout-btn");
    const subtotalElement = document.querySelector(".subtotal");
    const ivaElement = document.querySelector(".iva");
    const totalElement = document.querySelector(".total");
    const carritoModal = document.querySelector(".carrito_modal");
    const carritoResumen = document.querySelector(".carrito_resumen");

    let modalVisible = false; // Variable de estado para controlar el modal

    function formatNumber(number) {
        return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Función para actualizar el carrito
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartItemsContainer = document.getElementById("cartItems");

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

    // Mostrar el modal con los datos del usuario y total
    checkoutButton.addEventListener("click", () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!usuario) {
            alert("Por favor, inicia sesión para realizar la compra.");
            return;
        }

        // Calcular el subtotal, IVA y total
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += parseFloat(item.total);
        });

        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        // Mostrar modal con la información de la compra solo si el modal no está visible
        if (!modalVisible) {
            carritoModal.style.display = "block";
            modalVisible = true; // Cambiar el estado a visible

            // Resumen de la compra en el modal
            carritoResumen.innerHTML = `
                <p><strong>ID:</strong> ${usuario.id}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Dirección:</strong> ${usuario.direccion}</p><br>
                <p><strong>Total Compra:</strong> $${formatNumber(total.toFixed(2))} COP</p>
            `;
        }
    });

    // Cerrar el modal haciendo clic en cualquier parte del fondo
    carritoModal.addEventListener("click", (event) => {
        if (event.target === carritoModal) {
            carritoModal.style.display = "none";
            modalVisible = false; // Cambiar el estado a oculto
        }
    });

    // Confirmar compra
    const comprarButton = document.querySelector(".carrito_boton-comprar");
    comprarButton.addEventListener("click", () => {
        alert("Compra confirmada. ¡Gracias por tu compra!");
        localStorage.removeItem("cart");
        loadCart();
        carritoModal.style.display = "none"; // Cerrar el modal después de la compra
        modalVisible = false; // Cambiar el estado a oculto
    });

    // Cancelar compra (Cerrar Modal)
    const cancelarButton = document.querySelector(".carrito_boton-cancelar");
    cancelarButton.addEventListener("click", () => {
        carritoModal.style.display = "none"; // Cerrar el modal
        modalVisible = false; // Cambiar el estado a oculto
    });

    // Inicializar carrito
    loadCart();
});




