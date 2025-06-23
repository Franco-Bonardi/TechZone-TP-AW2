import { navbarComponent } from "../components/navbar.js";
import { userCard } from "../components/usercardPages.js";

let navContainer = document.querySelector('header');

const getUserData = (key) => {
    return JSON.parse(sessionStorage.getItem(key))
}

const logOut = (key) => {
    sessionStorage.removeItem(key)
}

window.addEventListener('load', () => {
    navContainer.innerHTML = navbarComponent

    const bodyId = document.body.id

    if (bodyId === 'componentes') {
        cargarProductos('componentes')
    } else if (bodyId === 'PCs') {
        cargarProductos('PCs')
    } else if (bodyId === 'perifericos') {
        cargarProductos('perifericos')
    }

    const userInfo = getUserData('userData')
    console.log(userInfo)
    const userContainer = document.getElementById('userContainer')
    const card = userCard(userInfo)
    
    userContainer.innerHTML = card
    
    document.getElementById('btnLogOut').addEventListener('click', () => {
        logOut('userData')
        window.location.href = '../login/login.html'
    })
})

function cargarProductos (categoria) {
    fetch(`../../data/productos.json`)
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById("tarjeta")
        contenedor.innerHTML = ""

        const productosFiltrados = data.filter( producto => producto.category === categoria )

        productosFiltrados.forEach(producto => {
            contenedor.innerHTML += `
            <div class="col">
                <div class="card h-100 d-flex flex-column p-3 tarjeta-producto">
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
                                <input type="number" class="form-control input-cantidad" min="1" placeholder="1">
                            </div>
                            <div class="col">
                                <button class="btn btn-success agregar-carrito" data-id="${producto.id}" data-nombre="${producto.name}" data-precio="${producto.price}" data-imagen="${producto.image}" data-bs-toggle="tooltip" data-bs-placement="top" title="Añadir al carrito"><i class="bi bi-bag-plus-fill"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
        document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const cardFooter = boton.closest(".card-footer");
            const inputCantidad = cardFooter.querySelector(".input-cantidad");
            const cantidad = parseInt(inputCantidad.value) || 1;
            const producto = {
            id: boton.dataset.id,
            nombre: boton.dataset.nombre,
            precio: parseFloat(boton.dataset.precio),
            imagen: boton.dataset.imagen,
            cantidad: cantidad
            };

            agregarAlCarrito(producto);
        });
        });
    })
}

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar si el producto ya está en el carrito
    const index = carrito.findIndex(p => p.id === producto.id);

    if (index !== -1) {
        carrito[index].cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
}