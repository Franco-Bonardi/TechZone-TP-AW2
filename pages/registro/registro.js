document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("formRegistro").addEventListener("submit", function(event) {
    event.preventDefault() // Según investigué, esto evita que el formulario se envíe para poder hacer la simulación de redirección al login

    window.location.href = "../login/login.html"
    /* Cuando realmente vaya a enviar los datos más adelante, se elimina o comenta el event.preventDefault() y el código de redirección, y el formulario se enviará normalmente */
  })
})