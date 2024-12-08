document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar el comportamiento por defecto (recarga de la página)
    
    // Obtener los valores del formulario
    const id = document.getElementById('id').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confPassword = document.getElementById('confPassword').value;
    const direccion = document.getElementById('direccion').value;
  
    // Validar si los campos no están vacíos
    if (!id || !email || !password || !confPassword || !direccion) {
      alert('Todos los campos son obligatorios');
      return;
    }
  
    // Validar si las contraseñas coinciden
    if (password !== confPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    try {
      // Realizar la solicitud POST al backend
      const response = await fetch('http://localhost:3000/products/usuario', { // Cambié el endpoint a /usuario
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          email: email,
          usrPassword: password, // Se usa usrPassword para la base de datos
          direccion: direccion,
        }),
      });
  
      // Procesar la respuesta
      const data = await response.json();
      
      if (response.ok) {
        // Si la respuesta es exitosa
        alert('Cuenta registrada exitosamente');
        
        // Redirigir a la página de inicio de sesión
        window.location.href = '/templates/usuario.html';
      } else {
        // Si la API devuelve un error
        alert(data.message || 'Error al registrar la cuenta');
      }
    } catch (error) {
      // Manejar errores de la solicitud
      console.error('Error al hacer la solicitud:', error);
      alert('Error al conectar con el servidor');
    }
  });
  