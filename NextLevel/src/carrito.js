class Carrito {
    constructor() {
        this.items = [];
        this.cartContainer = document.querySelector('.cart-items');
        this.totalElement = document.querySelector('.total');
        this.subtotalElement = document.querySelector('.subtotal');
        this.ivaElement = document.querySelector('.iva');
        this.checkoutButton = document.querySelector('.checkout-btn');
        this.emptyCartButton = document.querySelector('.empty-cart-btn');
        
        this.initEventListeners();
        this.loadCartFromStorage();
    }

    //inicializar eventos o Configurar eventos
    initEventListeners() {
        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', () => this.openCheckoutModal());
        }

        if (this.emptyCartButton) {
            this.emptyCartButton.addEventListener('click', () => this.vaciarCarrito());
        }
    }

    //agregar producto al carrito
    agregarAlCarrito(producto) {
        const productoExistente = this.items.find(item => item.id === producto.id);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            this.items.push({
                ...producto,
                cantidad: 1
            });
        }

        this.guardarCarritoEnStorage();
        this.mostrarProductosEnCarrito();
        this.actualizarTotal();
    }

    //eliminar producto del carrito
    eliminarDelCarrito(id) {
        const index = this.items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            if (this.items[index].cantidad > 1) {
                this.items[index].cantidad -= 1;
            } else {
                this.items.splice(index, 1);
            }
        }

        this.guardarCarritoEnStorage();
        this.mostrarProductosEnCarrito();
        this.actualizarTotal();
    }

    //mostrar productos en el carrito
    mostrarProductosEnCarrito() {
        this.cartContainer.innerHTML = '';

        this.items.forEach(producto => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito_item-imagen">
                <div class="item-details">
                    <h3>${producto.nombre}</h3>
                    <p>Categoría: ${producto.categoria}</p>
                    <p>Descripción: ${producto.descripcion}</p>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                    <p>Cantidad: <span>${producto.cantidad}</span></p>
                    <p>Valor Total: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                </div>
                <button class="remove-btn carrito_boton-eliminar" data-id="${producto.id}">Eliminar</button>
            `;

            const removeButton = itemDiv.querySelector('.remove-btn');
            removeButton.addEventListener('click', () => this.eliminarDelCarrito(producto.id));

            this.cartContainer.appendChild(itemDiv);
        });
    }

    //calcular y actualizar total
    actualizarTotal() {
        const subtotal = this.items.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
        const iva = subtotal * 0.21;
        const total = subtotal + iva;

        if (this.subtotalElement) {
            this.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }

        if (this.ivaElement) {
            this.ivaElement.textContent = `$${iva.toFixed(2)}`;
        }

        if (this.totalElement) {
            this.totalElement.textContent = `$${total.toFixed(2)}`;
        }

        //crear desglose detallado
        const breakdownDiv = document.createElement('div');
        breakdownDiv.classList.add('carrito_total');
        breakdownDiv.innerHTML = `
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>IVA (21%): $${iva.toFixed(2)}</p>
            <p>Total: $${total.toFixed(2)}</p>
        `;

        //reemplazar o agregar el desglose
        const existingBreakdown = document.querySelector('.carrito_total');
        if (existingBreakdown) {
            existingBreakdown.replaceWith(breakdownDiv);
        } else {
            this.cartContainer.appendChild(breakdownDiv);
        }
    }

    //vaciar todo el carrito
    vaciarCarrito() {
        this.items = [];
        this.guardarCarritoEnStorage();
        this.mostrarProductosEnCarrito();
        this.actualizarTotal();
    }

    //guardar el carrito en el almacenamiento local
    guardarCarritoEnStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    //cargar el carrito desde el almacenamiento local
    loadCartFromStorage() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            this.items = JSON.parse(carritoGuardado);
            this.mostrarProductosEnCarrito();
            this.actualizarTotal();
        }
    }

    //abrir el modal de pago
    openCheckoutModal() {
        const modal = document.querySelector('.carrito_modal');
        modal.style.display = 'flex';

        const closeButton = modal.querySelector('.carrito_boton-cerrar');
        const cancelButton = modal.querySelector('.carrito_boton-cancelar');
        
        const closeModal = () => {
            modal.style.display = 'none';
        };

        closeButton.addEventListener('click', closeModal);
        cancelButton.addEventListener('click', closeModal);

        const confirmButton = modal.querySelector('.carrito_boton-comprar');
        confirmButton.addEventListener('click', () => {
            alert('Compra realizada con éxito');
            this.vaciarCarrito();
            closeModal();
        });
    }
}

//inicializar el carrito cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const carrito = new Carrito();

    //ejemplo de cómo agregar un producto
    window.agregarAlCarrito = (producto) => {
        carrito.agregarAlCarrito(producto);
    };
});
