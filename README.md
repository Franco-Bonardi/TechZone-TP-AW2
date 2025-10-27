Autor: Franco Bonardi

Rutas:
*Productos:*

GET:
localhost:3000/productos/byId/   ==> ruta que devuelve la información de un prodcuto por su id
    Ejemplo: localhost:3000/productos/byId/2

localhost:3000/productos/porNombre/  ==> ruta que devuelve la información de un producto por su nombre
    Ejemplo: localhost:3000/productos/porNombre/Auriculares HyperX Cloud II

POST:
localhost:3000/productos/nuevoProducto  ==> ruta que permite crear un nuevo prodcuto
    Ejemplo de body para la petición:
    {
        "name" : "Auriculares Red Dragon VII",
        "description" : "Auriculares gamer pro max",
        "image" : "./",
        "price" : 39.90,
        "category" : "perifericos",
        "destacado" : false
    }

localhost:3000/productos/porCategoria  ==> ruta que devuelve todos los productos pertenecientes a una determinada categoría
    Ejemplo de body para la petición:
    {
        "category" : "perifericos"
    }

PUT:
localhost:3000/productos/cambiarPrecio  ==> ruta que permite modificar el precio de un producto por su id
    Ejemplo de body para la petición:
    {
        "id" : 40,
        "nuevo_precio" : 27.49
    }


*Usuarios:*

GET:
localhost:3000/usuarios/byId/  ==> ruta para obtener información de un usuario por su id
    Ejemplo: localhost:3000/usuarios/byId/2

localhost:3000/usuarios/porEmail/ ==> ruta para obtener información de un usuario por su email
    Ejemplo: localhost:3000/usuarios/porEmail/franco@ejemplo.com

POST:
localhost:3000/usuarios/login  ==> ruta que permitiría logearse a un usuario registrado
    Ejemplo de body para la petición:
    {
        "email" : "antonio@ejemplo.com",
        "contraseña" : "123"
    }

localhost:3000/usuarios/registro  ==> ruta que permite registrar a un nuevo usuario
    Ejemplo de body para la petición:
    {
        "nombre" : "Claudio",
        "apellido" : "Quinteros",
        "contraseña" : "654",
        "email" : "claudio@ejemplo.com",
        "direccion" : "Calla Falsa de La Rioja 29, La Rioja",
        "formaEntrega" : 1,
        "nacimiento" : "23/06/1978"
    }

PUT:
localhost:3000/usuarios/cambiarDireccion  ==> ruta que permite cambiar el campo "dirección" de un usuario por su id
    Ejemplo de body para la petición:
    {
        "idUsuario" : 1,
        "direccion" : "Calle de ejemplo 29, Córdoba"
    }

DELETE:
localhost:3000/usuarios/eliminarUsuario/  ==> ruta que permite eliminar usuarios sólo si no tienen ventas registradas
    Ejemplo: localhost:3000/usuarios/eliminarUsuario/9


*Ventas:*

GET:
localhost:3000/ventas/byIdUsuario/  ==> ruta que devuelve todas las ventas realizadas a un usuario por su id
    Ejemplo: localhost:3000/ventas/byIdUsuario/2

localhost:3000/ventas/porIdProducto/  ==> ruta que devuelve todas las ventas que incluyan a un determinado producto por su id
    Ejemplo: localhost:3000/ventas/porIdProducto/3

POST:
localhost:3000/ventas/nuevaVenta  ==> ruta que permite registrar una venta
    Ejemplo de body de la petición:
    {
        "idUsuario": 2,
        "fecha": "2025-10-25",
        "total": 309.98,
        "direccion": "calle de ejemplo 2, Córdoba",
        "productos": [
            {
            "idProducto": 3,
            "cantidad": 1
            },
            {
            "idProducto": 4,
            "cantidad": 1
            }
        ]
    }

localhost:3000/ventas/buscarPorFecha  ==> ruta que permite buscar las ventas registradas en un rango de fechas
    Ejemplo de body para la petición:
    {
        "desde" : "2024-01-01",
        "hasta" : "2025-01-01"
    }

PUT:
localhost:3000/ventas/modificarVenta  ==> ruta que permite modificar el total y los productos registrados en una venta por el id de la misma
    Ejemplo de body de la petición:
    {
        "id": 13,
        "nuevo_total": 439.97,
        "nuevos_productos": [
            {
            "idProducto": 2,
            "cantidad": 1
            },
            {
            "idProducto": 5,
            "cantidad": 1
            }
        ]
    }
