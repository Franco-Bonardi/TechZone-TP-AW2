// import { auth } from "../../auth/auth.js"
const form = document.getElementById('formLogIn')

/*
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("formLogIn").addEventListener("submit", function(event) {
    event.preventDefault() // Según investigué, esto evita que el formulario se envíe para poder hacer la simulación de redirección al home

    window.location.href = "../../index.html"
    /* Cuando realmente vaya a enviar los datos más adelante, se elimina o comenta el event.preventDefault() y el código de redirección, y el formulario se enviará normalmente */
 /* })
}) */

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const userEmail = document.getElementById('txtEmail').value
  const userPass = document.getElementById('txtContraseña').value

  const API_URL = 'http://localhost:3000/usuarios/login';

  const loginData = {
      email: userEmail,
      contraseña: userPass,
  };

  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
          const userData = data.usuario;
            
          
          sessionStorage.setItem('userData', JSON.stringify(userData));
            
          console.log('Login exitoso. Usuario:', userData);
          
          window.location.href = '../../index.html';
      } else {
          alert(data.mensaje || 'Error desconocido al intentar iniciar sesión.');
      }
  } catch (error) {
      console.error('Fallo al conectar con el servidor:', error);
      alert('No se pudo conectar con el servidor. Asegúrate de que Express esté corriendo.');
  }

  /*
  fetch('../../data/usuarios.json').then(res => res.json()).then(users => {
    const user = users.find(e => e.email == userEmail && e.contraseña == userPass)

    if (user) {
      sessionStorage.setItem('userData', JSON.stringify(user))
      console.log(user);
      window.location.href = '../../index.html';
    } else {
      alert('Correo o contraseña incorrectos');
    }
  })
  */
})


/* De momento no lo uso:
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  let userEmail = document.getElementById('txtEmail').value
  let userPass = document.getElementById('txtContraseña').value

  if (userEmail != '' && userPass != '') {
    try{
      const user = await auth({userEmail, userPass})
      sessionStorage.setItem('userData', JSON.stringify(user))
      console.log(user);
      window.location.href = '../../index.html';
    }catch(error){
      console.error('Error: ', error)
    }
  } else{
    alert('Correo o contraseña incorrectos');
  }
})
*/
