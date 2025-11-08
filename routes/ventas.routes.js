import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'
import { usuarioPorId } from "../utils/usuarios.js";
import { productoPorId } from "../utils/productos.js";

const router = Router()

const archivoVentas = await readFile('./data/ventas.json', 'utf-8')
const ventasData = JSON.parse(archivoVentas)

router.get('/byIdUsuario/:idUsuario', (req, res) => {
  const id = parseInt(req.params.idUsuario)

  const result = ventasData.filter(e => e.idUsuario === id)

  if (result.length > 0) {
    const resultWithNames = result.map(venta => ({
      ...venta,
      productos: venta.productos.map(p => ({
        nombre: productoPorId(p.idProducto),
        cantidad: p.cantidad
      }))
    }))

    res.status(200).json(resultWithNames)
  } else {
    res.status(404).json(`El id de usuario número ${id} no existe, o no se registran ventas a ese usuario aún.`)
  }
})

router.get('/porIdProducto/:producto', (req, res) => {
    const producto = parseInt(req.params.producto)

    const result = ventasData.filter(venta => 
        venta.productos.some(p => p.idProducto === producto)
    )

    if (result.length > 0){
        res.status(200).json(result)
    } else {
        res.status(404).json(`No se registran ventas del producto consultado aún.`)
    }
})

router.post('/nuevaVenta', async (req, res) => {
    const { idUsuario, fecha, total, direccion, productos } = req.body

    if (!idUsuario || !fecha || !total || !direccion || !productos) {
        return res.status(400).json('Faltan datos para registrar la venta.')
    }

    if (typeof idUsuario !== 'number') {
        return res.status(400).json('El campo idUsuario debe ser un número.');
    }

    if (typeof fecha !== 'string') {
        return res.status(400).json('El campo fecha debe ser una cadena de texto (por ejemplo: "2025-10-25").');
    }

    if (typeof total !== 'number') {
        return res.status(400).json('El campo total debe ser un número.');
    }

    if (typeof direccion !== 'string') {
        return res.status(400).json('El campo direccion debe ser una cadena de texto.');
    }

    try {
        const nuevoId = ventasData.length > 0 ? ventasData[ventasData.length - 1].id + 1 : 1

        let productosArray = productos;

        if (typeof productos === 'string') {
        try {
            productosArray = JSON.parse(productos);
        } catch {
            return res.status(400).json('El formato de productos no es válido.');
        }
        }

        if (!Array.isArray(productosArray)) {
        return res.status(400).json('El campo productos debe ser un array de objetos.');
        }

        const nuevaVenta = {
            id: nuevoId,
            idUsuario,
            fecha,
            total,
            direccion,
            productos: productosArray
        }

        ventasData.push(nuevaVenta)

        await writeFile('./data/ventas.json', JSON.stringify(ventasData, null, 2))

        res.status(201).json({
            mensaje: 'Venta registrada correctamente.',
            venta: nuevaVenta
        })
    } catch (error) {
        console.error('Error al registrar venta:', error)
        res.status(500).json('Error al registrar la nueva venta.')
    }
})

router.post('/buscarPorFecha', (req, res) => {
    const { desde, hasta } = req.body

    if (!desde && !hasta) {
        return res.status(400).json('Debe indicar al menos una fecha ("desde" o "hasta").')
    }

    if (desde && typeof desde !== 'string') {
        return res.status(400).json('El campo "desde" debe ser una cadena de texto entre comillas (formato YYYY-MM-DD).')
    }
    if (hasta && typeof hasta !== 'string') {
        return res.status(400).json('El campo "hasta" debe ser una cadena de texto entre comillas (formato YYYY-MM-DD).')
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/
    if (desde && !fechaRegex.test(desde)) {
        return res.status(400).json('El campo "desde" debe tener formato "YYYY-MM-DD".')
    }
    if (hasta && !fechaRegex.test(hasta)) {
        return res.status(400).json('El campo "hasta" debe tener formato "YYYY-MM-DD".')
    }

    try {
        const desdeDate = desde ? new Date(desde) : new Date('2000-01-01')
        const hastaDate = hasta ? new Date(hasta) : new Date()

        const resultado = ventasData.filter(e => {
            const fechaVenta = new Date(e.fecha)
            return fechaVenta >= desdeDate && fechaVenta <= hastaDate
        })

        if (resultado.length === 0) {
            return res.status(404).json('No se encontraron ventas en ese rango de fechas.')
        }

        const resultadoTransformado = resultado.map(venta => {
            return {
            ...venta,
            productos: venta.productos.map(p => ({
                nombre: productoPorId(p.idProducto),
                cantidad: p.cantidad
            }))
        }
        })

        res.status(200).json(resultadoTransformado)
    } catch (error) {
        res.status(500).json('Error al buscar las ventas por fecha.')
    }
})

router.put('/modificarVenta', (req, res) => {
    const { id, nuevo_total, nuevos_productos } = req.body

    if (id === undefined || nuevo_total === undefined || nuevos_productos === undefined) {
        return res.status(400).json('Faltan datos para modificar la venta.');
    }

    if (typeof id !== 'number') {
        return res.status(400).json('El campo "id" debe ser un número.');
    }

    if (typeof nuevo_total !== 'number') {
        return res.status(400).json('El campo "nuevo_total" debe ser un número.');
    }

    if (!Array.isArray(nuevos_productos)) {
        return res.status(400).json('El campo "nuevos_productos" debe ser un array de objetos.');
    }

    for (const p of nuevos_productos) {
        if (typeof p.idProducto !== 'number' || typeof p.cantidad !== 'number') {
            return res.status(400).json('Cada producto debe tener "idProducto" y "cantidad" como números.');
        }
    }

    try{
        const indice = ventasData.findIndex(e => e.id === id)

        if (indice === -1) {
            return res.status(404).json('No se encontró la venta con el ID indicado.');
        }

        ventasData[indice].total = nuevo_total
        ventasData[indice].productos = nuevos_productos

        writeFile('./data/ventas.json', JSON.stringify(ventasData, null, 2))
        res.status(200).json('Venta modificada correctamente')

    }catch(error){
        res.status(500).json('Error al actualizar la venta.')
    }
})


export default router