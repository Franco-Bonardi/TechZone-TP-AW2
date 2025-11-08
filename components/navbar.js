/* Navbar para categorías */
const navElements = [
    { title: 'Todos los Productos', link: '../categorias/listadoCompleto.html' },
    { title: 'Componentes', link: '../categorias/componentes.html' },
    { title: 'PCs', link: '../categorias/PCs.html' },
    { title: 'Periféricos', link: '../categorias/perifericos.html' },
    { title: 'Registrarse', link: '../registro/registro.html' },
    { title: 'Iniciar Sesión', link: '../login/login.html' },
    { title: 'Carrito', link: '../carrito/carrito.html' }
]

export const navbarComponent = `
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
                <a href="../../index.html"><img src="../../assets/images/microchip_9457044.png" alt="Ícono TechZone" height="125" width="125" class="navbar-brand"></a>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav">
                        ${
                            navElements.map(e => {
                                return `
                                <li class="nav-item"><a href=${e.link} class="nav-link">${e.title}</a></li>
                                `
                            }).join('')
                        }
                    </ul>
                    <button class="btn btn-danger ms-auto" id="btnLogOut" data-bs-toggle="tooltip" data-bs-placement="top" title="Cerrar sesión">
                        <i class="bi bi-box-arrow-left"></i>
                    </button>
                </div>
            </div>
        </nav>
`
