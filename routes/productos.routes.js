import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'

const router = Router()

const archivoProductos = await readFile('./data/productos.json', 'utf-8')
const productosData = JSON.parse(archivoProductos)

/* otra forma de hacer los dos renglones anterior de manera asíncrona, por si no funciona así:
    const getData = async()=>{
        const archivoProductos = await readFile('./data/productos.json', 'utf-8')
        return JSON.parse(archivoProductos)
    }
*/

router.get('/porCategoria/:category', (req, res) => {
    const categoria = req.params.category

    if (categoria === 'componentes' || categoria === 'PCs' || categoria === 'perifericos') {
        const result = productosData.filter(e => e.category === categoria);
        if(result.length > 0){
            res.status(200).json(result)
        } else{
            res.status(404).json(`No hay productos en la categoría ${categoria}.`)
        }
    } else{
        res.status(400).json(`La categoría ingresada es incorrecta. Escriba "componentes", "PCs" o "perifericos"`)
    }
})

router.get('/listadoCompleto', (req, res) => {

    if (productosData.length > 0) {
        res.status(200).json(productosData)
    } else {
        res.status(404).json(`No hay productos cargados para mostrar.`)
    }
})

router.get('/byId/:id', (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json('El ID debe ser un número positivo válido')
    }

    const result = productosData.find(e => e.id == id)

    if (result){
        res.status(200).json(result)
    } else {
        res.status(404).json(`El id de producto número ${id} no existe`)
    }
})

router.get('/porNombre/:name', (req, res) => {
    const nombre = req.params.name

    const result = productosData.find(e => e.name == nombre)

    if (result){
        res.status(200).json(result)
    } else {
        res.status(404).json(`No se encuentra registrado el producto ${nombre}`)
    }
})

router.post('/nuevoProducto', (req, res) => {
    const { name, description, image, price, category, destacado } = req.body

    if (!name || !description || !image || !price || !category || typeof destacado === 'undefined') {
        return res.status(400).json('Faltan campos obligatorios.')
    }

    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json('El campo "name" debe ser una cadena de texto no vacía.')
    }

    if (typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json('El campo "description" debe ser una cadena de texto no vacía.')
    }

    if (typeof image !== 'string') {
        return res.status(400).json('El campo "image" debe ser una cadena de texto.')
    }

    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        return res.status(400).json('El campo "price" debe ser un número mayor que 0 (sin comillas).')
    }

    if (typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json('El campo "category" debe ser una cadena de texto no vacía.')
    }

    if (typeof destacado !== 'boolean') {
        if (destacado !== 'true' && destacado !== 'false') {
            return res.status(400).json('El campo "destacado" debe ser un valor booleano ("true" o "false").')
        } else {
            destacado = destacado === 'true'
        }
    }

    const categoriasPermitidas = ['componentes', 'PCs', 'perifericos'];
    if (!categoriasPermitidas.includes(category)) {
        return res.status(400).json(`La categoría debe ser una de las siguientes: ${categoriasPermitidas.join(', ')}`)
    }

    const existe = productosData.find(p => p.name === name)
    if (existe) {
        return res.status(400).json({ mensaje: 'Ya está registrado un producto con ese nombre.' })
    }

    const nuevoId = productosData.length > 0
        ? Math.max(...productosData.map(p => p.id)) + 1
        : 1

    const nuevoProducto = {
        id: nuevoId,
        name,
        description,
        image,
        price,
        category,
        destacado: destacado === 'true' || destacado === true
    }

    productosData.push(nuevoProducto)

    writeFile('./data/productos.json', JSON.stringify(productosData, null, 2))
    res.status(201).json({ mensaje: 'Producto creado exitosamente.', producto: nuevoProducto })
})

router.post('/porCategoria', (req, res) => {
    const categoria = req.body.category

    if (!categoria || typeof categoria !== 'string') {
        return res.status(400).json('El campo "category" es obligatorio y debe ser una cadena de texto.')
    }

    if (categoria === 'componentes' || categoria === 'PCs' || categoria === 'perifericos') {
        const result = productosData.filter(e => e.category === categoria);
        if(result.length > 0){
            res.status(200).json(result)
        } else{
            res.status(404).json(`No hay productos en la categoría ${categoria}.`)
        }
    } else{
        res.status(400).json(`La categoría ingresada es incorrecta. Escriba "componentes", "PCs" o "perifericos"`)
    }
})

router.put('/cambiarPrecio', (req, res) => {
    const id = req.body.id
    const nuevoPrecio = req.body.nuevo_precio
    
    if (typeof id !== 'number' || id <= 0) {
        return res.status(400).json('El campo "id" es obligatorio y debe ser un número mayor que 0.')
    }

    if (typeof nuevoPrecio !== 'number' || isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
        return res.status(400).json('El campo "nuevo_precio" es obligatorio y debe ser un número mayor que 0.')
    }

    try{
        const indice = productosData.findIndex(e => e.id === id)

        if (indice === -1) {
            return res.status(404).json(`No se encontró un producto con id ${id}.`)
        }

        productosData[indice].price = nuevoPrecio

        writeFile('./data/productos.json', JSON.stringify(productosData, null, 2))
        res.status(200).json('Precio del producto modificado correctamente')

    }catch(error){
        res.status(500).json('Error al actualizar el precio del producto.')
    }
})


export default router