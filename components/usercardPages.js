export const userCard = (arr) => {
    return `    
    <div class="container-fluid mx-1 mt-0">
    <div class="row">
        <div class="col-12 d-flex justify-content-end">
        <div class="d-flex align-items-center py-3 me-4">
            <img src="../../assets/images/circuloUsuario.webp" class="me-3 imagenSesionUsuario" alt="Foto de usuario" />
            <h5 class="fw-bold tarjeta-usuario m-0">Sesión de<br>${arr.nombre} ${arr.apellido}</h5>
        </div>
        </div>
    </div>
    </div>
    `
}