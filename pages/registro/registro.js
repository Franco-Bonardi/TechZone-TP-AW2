document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formRegistro").addEventListener("submit", async function(event) {
        event.preventDefault(); // Evita el envío tradicional por HTML

        const form = event.target;
        const formData = new FormData(form);

        const nombre = formData.get('txtNombre');
        const apellido = formData.get('txtApellido');
        const email = formData.get('txtEmail');
        const contraseña = formData.get('txtContraseña');
        const direccion = formData.get('txtDireccion');
        const opcionEntrega = formData.get('opcionEntrega'); // Obtiene 'opcionLocal' o 'opcionEnvio'
        const date = formData.get('date');

        const userData = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            contraseña: contraseña,
            direccion: direccion,
            opcionEntrega: opcionEntrega,
            date: date,
        };

        const API_URL = 'http://localhost:3000/usuarios/registro';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Registro exitoso para ${data.usuario.nombre}. ¡Ya puedes iniciar sesión!`);
                window.location.href = "../login/login.html";
            } else {
                alert(`Error al registrar: ${data.mensaje || 'Error desconocido.'}`);
            }

        } catch (error) {
            console.error('Fallo al conectar con el servidor:', error);
            alert('No se pudo conectar con el servidor. Verifica que el servidor Express esté corriendo.');
        }
    });
});