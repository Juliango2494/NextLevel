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
    addCard.addEventListener('click', showModal); // Asociar evento
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
          <button class="edit">Editar</button>
          <button class="delete">Eliminar</button>
        </div>
      `;
      productList.appendChild(card);
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
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