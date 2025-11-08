import { navbarComponent } from "../../components/navbar.js";
import { userCard } from "../../components/usercardPages.js";
import { crearOrdenDeCompra } from "../../ventas/ventas.js";

document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.querySelector('header');
    const userContainer = document.getElementById('userContainer');
    const contenedor = document.getElementById('tarjeta');
    const totalCarritoElement = document.getElementById('total-carrito');
    const btnComprar = document.getElementById('btn-comprar');

    navContainer.innerHTML = navbarComponent;

    const initialUserInfo = JSON.parse(sessionStorage.getItem('userData'));
    if (initialUserInfo) {
        userContainer.innerHTML = userCard(initialUserInfo);
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

        actualizarBotonComprar();

        return;
    }

    let total = 0;

    contenedor.innerHTML = '';  // Limpiar antes de llenar

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

    if (btnComprar && carrito.length > 0) {
        btnComprar.addEventListener('click', async () => {
            
            const userInfo = JSON.parse(sessionStorage.getItem('userData'));

            if (!userInfo || !userInfo.idUsuario) { 
                alert('Debe iniciar sesión para completar la compra.');
                window.location.href = '../login/login.html';
                return;
            }
            
            const direccionDeEnvio = userInfo.direccion; // Tomada de sessionStorage
            const fechaActual = new Date().toISOString().split('T')[0]; // Fecha actual YYYY-MM-DD

            if (!direccionDeEnvio) {
                alert('Tu perfil de usuario no tiene una dirección de envío registrada.');
                return;
            }

            const items = carrito.map(p => ({
                idPproducto: p.id,
                cantidad: p.cantidad,
            }));
            
            const ordenData = {
                idUsuario: userInfo.idUsuario,
                productos: items,
                total: parseFloat(document.getElementById('total-carrito').textContent),
                fecha: fechaActual, 
                direccion: direccionDeEnvio,
            };

            try {
                btnComprar.disabled = true;
                btnComprar.textContent = 'Procesando compra...';

                const respuesta = await crearOrdenDeCompra(ordenData);

                alert(`¡Compra exitosa! Se ha registrado correctamenta su compra con Orden N°: ${respuesta.venta.id}`);
                
                localStorage.removeItem('carrito');
                window.location.reload(); 

            } catch (error) {
                console.error('Fallo en el proceso de compra:', error.message);
                alert('Ocurrió un error al procesar tu compra. Inténtalo de nuevo. Detalle: ' + error.message);
                btnComprar.disabled = false;
                btnComprar.textContent = 'Comprar';
            }
        });
    }

    actualizarBotonComprar();
});

function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(producto => producto.id !== idProducto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.location.reload();
}

function actualizarBotonComprar() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const btnComprar = document.getElementById('btn-comprar');

    if (btnComprar) {
        if (carrito.length > 0) {
            btnComprar.style.display = 'block';
            btnComprar.disabled = false;
        } else {
            btnComprar.style.display = 'none';
        }
    }
}