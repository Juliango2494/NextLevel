window.addEventListener('DOMContentLoaded', function() {
    const userInfoContainer = document.getElementById('userInfoContainer');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const usuarioLog = document.getElementById('usuarioLog');
    // Verificar si hay datos de usuario en localStorage
    if (usuario) {
      usuarioLog.textContent = usuario.email; // Agrega el email del usuario al contenido de la etiqueta <p>
      // Mostrar la información del usuario
      userInfoContainer.innerHTML = `
        <h1>Bienvenido, ${usuario.email}</h1><br><br>
        <p>Dirección: ${usuario.direccion}</p><br>
        <p>Rol: ${usuario.role}</p><br>
        <button id="logoutBtn">Cerrar sesión</button>
      `;
  
      // Agregar el evento para cerrar sesión
      document.getElementById('logoutBtn').addEventListener('click', function() {
        // Eliminar los datos del usuario de localStorage
        localStorage.removeItem('usuario');
        
        // Redirigir a la página de inicio de sesión
        window.location.href = '/templates/usuario.html';
      });
    } else {
      usuarioLog.textContent = ''; // Asegura que esté vacío si no hay usuario
      // Si no hay datos de usuario, mostrar el formulario de inicio de sesión
      userInfoContainer.innerHTML = `
        <h1>Iniciar Sesión</h1>
        <form id="loginForm">
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" required>
          
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
          
            <button type="submit">Ingresar</button>
        </form>
        <a class="iniciar_cuenta" href="iniciar_cuenta.html">¿Aún no tienes cuenta?</a>
      `;
  
      // Llamar a la función para manejar el inicio de sesión
      document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Evitar el comportamiento por defecto (recarga de la página)
        
        // Obtener los valores del formulario
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
      
        // Validar si los campos no están vacíos
        if (!email || !password) {
          alert('Por favor, ingresa todos los campos');
          return;
        }
      
        try {
          // Realizar la solicitud POST al backend
          const response = await fetch('http://localhost:3000/products/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });
      
          // Procesar la respuesta
          const data = await response.json();
      
          if (response.ok) {
            // Si la respuesta es exitosa (status 200)
            alert('Inicio de sesión exitoso');
      
            // Guardar la información del usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify({
              id: data.id,
              email: data.email,
              direccion: data.direccion,
              role: data.role,
              message: data.message
            }));
      
            // Redirigir a /index.html
            window.location.href = '/index.html';
          } else {
            // Si ocurre un error (por ejemplo, usuario no encontrado o contraseña incorrecta)
            alert(data.message || 'Error al iniciar sesión');
          }
        } catch (error) {
          // Manejar errores de la solicitud
          console.error('Error al hacer la solicitud:', error);
          alert('Error al conectar con el servidor');
        }
      });
    }
  });
  
  