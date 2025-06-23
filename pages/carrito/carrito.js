import { navbarComponent } from "../../components/navbar.js";
import { userCard } from "../../components/usercardPages.js";

document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.querySelector('header');
    const userContainer = document.getElementById('userContainer');
    const contenedor = document.getElementById('tarjeta');
    const totalCarritoElement = document.getElementById('total-carrito');

    navContainer.innerHTML = navbarComponent;

    const userInfo = JSON.parse(sessionStorage.getItem('userData'));
    if (userInfo) {
        userContainer.innerHTML = userCard(userInfo);
    }

    const btnLogOut = document.getElementById('btnLogOut');
    if (btnLogOut) {
        btnLogOut.addEventListener('click', () => {
            sessionStorage.removeItem('userData');
            window.location.href = '../login/login.html';
        });
    }

    // Cargar productos del carrito
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    console.log("Productos en carrito:", carrito);

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="alert alert-info text-center w-100">No hay productos en el carrito aún :(</div>
        `;
        totalCarritoElement.textContent = "0.00";
        return;
    }

    let total = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        contenedor.innerHTML += `
        <div class="col">
            <div class="card h-100 d-flex flex-column p-3 tarjeta-producto">
                <div class="card-body d-flex flex-column justify-content-end">
                    <h5 class="card-title titulo-prod">${producto.nombre}</h5>
                    <p class="card-text">Cantidad: <strong>${producto.cantidad}</strong></p>
                    <p class="card-text">Precio unitario: <strong>$${producto.precio}</strong></p>
                    <p class="card-text">Subtotal: <strong>$${subtotal.toFixed(2)}</strong></p>
                    <button class="btn btn-danger mt-2 btn-eliminar" data-id="${producto.id}">Eliminar del carrito</button>
                </div>
            </div>
        </div>
        `;
    });

    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', () => {
            const idProducto = boton.getAttribute('data-id');
            eliminarDelCarrito(idProducto);
        });
    });

    totalCarritoElement.textContent = total.toFixed(2);
});

function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(producto => producto.id !== idProducto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.location.reload();
}