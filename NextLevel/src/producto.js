const API_URL = 'http://localhost:3000/products';

//let rolUsr = 'administrador'
let rolUsr = 'usuario'
let filtro = '';
// Leer el parámetro de la URL al cargar la página
const params = new URLSearchParams(window.location.search);
const categoriaSeleccionada = params.get('categoria');
if (categoriaSeleccionada) {
  filtro = categoriaSeleccionada; // Establecer el filtro según el parámetro
}

const productSelect = document.getElementById('product-select');
if (categoriaSeleccionada) {
  productSelect.value = categoriaSeleccionada;
}

productSelect.addEventListener('change', (event) => {
  filtro = event.target.value;

  // Actualizar la URL para reflejar la selección
  const newUrl = `${window.location.pathname}?categoria=${filtro}`;
  window.history.pushState({ path: newUrl }, '', newUrl);

  fetchProducts();
});
    // Mostrar el modal
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('modal-overlay');
    const showModal = () => {
      modal.style.display = 'block';
      overlay.style.display = 'block';
    };
    const closeModal = () => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      const form = document.getElementById('productForm');
      form.reset(); // Limpia el formulario
      form.onsubmit = null; // Elimina eventos previos
    };
    document.getElementById('addProductCard').addEventListener('click', showModal);
    overlay.addEventListener('click', closeModal);

    // Obtener productos
    async function fetchProducts() {
      try {
        let endpoint = API_URL; // URL base: todos los productos
        if (filtro === 'sillas-gamer') endpoint = `${API_URL}/sillas`;
        else if (filtro === 'equipos') endpoint = `${API_URL}/equipos`;
        else if (filtro === 'accesorios') endpoint = `${API_URL}/accesorios`;

        const response = await fetch(endpoint);
        const products = await response.json();
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Limpiar el contenedor
    
        // Agregar la card vacía con "+"
        if(rolUsr==='administrador'){
          const addCard = document.createElement('div');
          addCard.classList.add('card', 'add-card');
          addCard.textContent = '+';
          addCard.addEventListener('click', () => {
            resetForm(); // Limpia el formulario antes de mostrarlo
            showModal();
          });
          productList.appendChild(addCard);
        }
    
        // Renderizar las cards de productos
        products.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('card');
          try{
            switch(rolUsr){
              case 'administrador':
                console.log("Renderizando card 'administrador'")
                card.innerHTML = `
                  <img src="data:image/jpeg;base64,${product.image}" alt="${product.name}" />
                  <h3>${product.name}</h3><br>
                  <p>categoría: ${product.cat}</p><br>
                  <p>${product.description}</p><br>
                  <p>$${Number(product.price).toFixed(2)}</p><br><br>
                  <div class="actions">
                    <button class="edit" data-id="${product.id}">Editar</button>
                    <button class="delete" data-id="${product.id}">Eliminar</button>
                  </div>
                `;
                break;
              case 'usuario':
                console.log("Renderizando card 'usuario'")
                card.innerHTML = `
                  <img src="data:image/jpeg;base64,${product.image}" alt="${product.name}" />
                  <h3>${product.name}</h3><br>
                  <p>categoría: ${product.cat}</p><br>
                  <p>${product.description}</p><br>
                  <p>$${Number(product.price).toFixed(2)}</p><br><br>
                  <div class="quantity-selector">
                    <button class="decrease">-</button>
                    <input type="number" class="quantity" value="1" min="1" readonly />
                    <button class="increase">+</button>
                  </div><br>
                  <div class="actions">
                      <button class="comprar" data-id="${product.id}">Comprar</button>
                  </div>
                `;
                // Eventos para los botones de aumentar y disminuir cantidad
                const decreaseButton = card.querySelector('.decrease');
                const increaseButton = card.querySelector('.increase');
                const quantityInput = card.querySelector('.quantity');

                decreaseButton.addEventListener('click', () => {
                    let currentValue = parseInt(quantityInput.value, 10);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                    }
                });

                increaseButton.addEventListener('click', () => {
                    let currentValue = parseInt(quantityInput.value, 10);
                    quantityInput.value = currentValue + 1;
                });
                // Evento para el botón "Comprar"
                const comprarButton = card.querySelector('.comprar');
                comprarButton.addEventListener('click', () => {
                    const productId = product.id;
                    const productName = product.name;
                    const productPrice = product.price;
                    const productQuantity = parseInt(quantityInput.value, 10);

                    // Crear un objeto con la información de la compra
                    const purchase = {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: productQuantity,
                        total: (productPrice * productQuantity).toFixed(2),
                    };

                    // Obtener compras existentes del Local Storage
                    const existingPurchases = JSON.parse(localStorage.getItem('cart')) || [];

                    // Agregar el producto al carrito
                    existingPurchases.push(purchase);

                    // Guardar el carrito actualizado en el Local Storage
                    localStorage.setItem('cart', JSON.stringify(existingPurchases));

                    alert(`Producto "${productName}" agregado al carrito.`);
                });
                break;
            };
          } catch(error) {
            console.log('Error en tipo de usuario:', error)
          }
          // Evento para eliminar
          if(rolUsr === 'administrador'){
            card.querySelector('.delete').addEventListener('click', async (e) => {
              const productId = e.target.getAttribute('data-id');
              const confirmDelete = confirm('¿Está seguro de que desea eliminar este producto?');
              if (confirmDelete) {
                try {
                  const response = await fetch(`${API_URL}/${productId}`, { method: 'DELETE' });
                  if (response.ok) {
                    alert('Producto eliminado correctamente');
                    fetchProducts(); // Refrescar la lista de productos
                  } else {
                    alert('Error al eliminar producto');
                  }
                } catch (error) {
                  console.error('Error al eliminar producto:', error);
                }
              }
            });
          }
    
          // Evento para editar
          if(rolUsr === 'administrador'){
            card.querySelector('.edit').addEventListener('click', async (e) => {
              const productId = e.target.getAttribute('data-id');
      
              try {
                // Obtener los datos del producto por su ID
                const response = await fetch(`${API_URL}/${productId}`);
                if (response.ok) {
                  const product = await response.json();
      
                  // Rellenar el formulario con los datos existentes
                  document.querySelector('[name="name"]').value = product.name;
                  document.querySelector('[name="cat"]').value = product.cat;
                  document.querySelector('[name="description"]').value = product.description;
                  document.querySelector('[name="price"]').value = product.price;
      
                  // Actualizar el texto del botón
                  const submitButton = document.querySelector('#productForm button[type="submit"]');
                  submitButton.textContent = 'Actualizar Producto';
      
                  // Mostrar el modal
                  showModal();
      
                  // Cambiar el evento del formulario
                  const form = document.getElementById('productForm');
                  form.onsubmit = async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                  
                    try {
                      const response = await fetch(`${API_URL}/${productId}`, {
                        method: 'PUT',
                        body: formData,
                      });
                  
                      if (response.ok) {
                        alert('Producto actualizado correctamente');
                        closeModal();
                        fetchProducts(); // Refrescar la lista de productos
                      } else {
                        const errorResponse = await response.json();
                        alert(`Error al actualizar producto: ${errorResponse.message}`);
                      }
                    } catch (error) {
                      console.error('Error al actualizar producto:', error);
                    }
                  };
                } else {
                  alert('Error al obtener los datos del producto');
                }
              } catch (error) {
                console.error('Error al cargar producto para edición:', error);
              }
            });
          }
    
          productList.appendChild(card);
        });
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    }
    
    // Función para limpiar el formulario
    function resetForm() {
      const form = document.getElementById('productForm');
      form.reset();
      form.onsubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        try {
          const response = await fetch(API_URL, { method: 'POST', body: formData });
          if (response.ok) {
            alert('Producto creado exitosamente');
            closeModal();
            fetchProducts();
          } else {
            alert('Error al crear producto');
          }
        } catch (error) {
          console.error('Error al crear producto:', error);
        }
      };
    
      // Restaurar texto del botón
      const submitButton = document.querySelector('#productForm button[type="submit"]');
      submitButton.textContent = 'Crear Producto';
    }
    

    // Crear producto
    document.getElementById('productForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      try {
        const response = await fetch(API_URL, { method: 'POST', body: formData });
        if (response.ok) {
          alert('Producto creado exitosamente');
          closeModal();
          fetchProducts();
        } else {
          alert('Error al crear producto');
        }
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    });

    fetchProducts();