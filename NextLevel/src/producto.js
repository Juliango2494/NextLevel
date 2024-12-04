const API_URL = 'http://localhost:3000/products';

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
        const response = await fetch(API_URL);
        const products = await response.json();
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Limpiar el contenedor
    
        // Agregar la card vacía con "+"
        const addCard = document.createElement('div');
        addCard.classList.add('card', 'add-card');
        addCard.textContent = '+';
        addCard.addEventListener('click', () => {
          resetForm(); // Limpia el formulario antes de mostrarlo
          showModal();
        });
        productList.appendChild(addCard);
    
        // Renderizar las cards de productos
        products.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <img src="data:image/jpeg;base64,${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>${product.cat}</p>
            <p>${product.description}</p>
            <p>$${Number(product.price).toFixed(2)}</p>
            <div class="actions">
              <button class="edit" data-id="${product.id}">Editar</button>
              <button class="delete" data-id="${product.id}">Eliminar</button>
            </div>
          `;
    
          // Evento para eliminar
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
    
          // Evento para editar
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