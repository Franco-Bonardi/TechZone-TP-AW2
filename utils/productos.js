import {readFile} from 'fs/promises'

const archivoProductos = await readFile ('./data/productos.json', 'utf-8')
const productosData = JSON.parse(archivoProductos)

export function productoPorId (id) {
    const producto = productosData.find(p => p.id === id)
    return producto ? producto.name : 'Producto desconocido'
}