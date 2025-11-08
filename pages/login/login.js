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

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let userEmail = document.getElementById('txtEmail').value
  let userPass = document.getElementById('txtContraseña').value

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
