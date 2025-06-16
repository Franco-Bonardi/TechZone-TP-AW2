import { navbarComponent } from "./components/navbarIndex.js";

let navContainer = document.querySelector('header');

window.addEventListener('load', () => {
    navContainer.innerHTML = navbarComponent

    cargarProductos('destacados')
})

function cargarProductos (categoria) {
    fetch(`./data/productos.json`)
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById("tarjeta")
        contenedor.innerHTML = ""

        const productosFiltrados = data.filter( producto => producto.category === categoria )

        productosFiltrados.forEach(producto => {
            contenedor.innerHTML += `
            <div class="col">
                <div class="card h-100 d-flex flex-column p-3">
                    <div class="img-container">
                        <img src="${producto.image}" class="card-img-top" alt="${producto.name}" />
                    </div>
                    <div class="card-body d-flex flex-column justify-content-end">
                        <h5 class="card-title titulo-prod">${producto.name}</h5>
                        <p class="card-text">${producto.description}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row text-center">
                            <div class="col">
                                <p class="price"><strong>$${producto.price}</strong></p>
                            </div>
                            <div class="col">
                                <input type="number" class="form-control" min="1" placeholder="1">
                            </div>
                            <div class="col">
                                <button class="btn btn-success"><i class="bi bi-bag-plus-fill"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    })
}