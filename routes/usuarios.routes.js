import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'
import { createUsuario, findAllUsuarios, findLastUser, findUserAndLogin } from "../db/actions/usuarios.actions.js";

const router = Router()

const archivoUsuarios = await readFile('./data/usuarios.json', 'utf-8')
const usuariosData = JSON.parse(archivoUsuarios)

const archivoVentas = await readFile('./data/ventas.json', 'utf-8')
const ventasData = JSON.parse(archivoVentas)


router.get('/listadoCompletoUsuarios', async (req, res) => {
    try {
        const result = await findAllUsuarios()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json()
    }
})


router.get('/byId/:idUsuario', (req, res) => {
    const id = parseInt(req.params.idUsuario)

    if (isNaN(id) || id <= 0) {
        return res.status(400).json('El parámetro "idUsuario" debe ser un número mayor que 0.')
    }

    const result = usuariosData.find(e => e.idUsuario === id)

    if (result){
        res.status(200).json(result)
    } else {
        res.status(404).json(`El id de usuario número ${id} no existe`)
    }
})

router.get('/porEmail/:email', (req, res) => {
    const emailUsuario = req.params.email

    if (!emailUsuario || typeof emailUsuario !== 'string') {
        return res.status(400).json('El parámetro "email" es obligatorio y debe ser una cadena de texto.')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailUsuario)) {
        return res.status(400).json('El formato del email ingresado es incorrecto.')
    }

    const result = usuariosData.find(e => e.email === emailUsuario)

    if (result){
        res.status(200).json(result)
    } else {
        res.status(404).json(`No se encontró ningún usuario con ese email.`)
    }
})

router.post('/login', async (req, res) => {
    const emailUsuario = req.body.email
    const pass = req.body.contraseña

    const camposEsperados = ['email', 'contraseña']
    const camposRecibidos = Object.keys(req.body)

    const camposExtra = camposRecibidos.filter(campo => !camposEsperados.includes(campo))
    if (camposExtra.length > 0) {
        return res.status(400).json(`Campos no permitidos: ${camposExtra.join(', ')}`)
    }

    if (!emailUsuario || !pass) {
        return res.status(400).json(`Son necesarios los campos "email" y "contraseña".`)
    }

    if (typeof emailUsuario !== 'string' || typeof pass !== 'string') {
        return res.status(400).json(`Los campos "email" y "contraseña" deben ser texto (string).`)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailUsuario)) {
        return res.status(400).json(`El formato del email no es válido.`)
    }

    try {
        const usuarioAutenticado = await findUserAndLogin(emailUsuario, pass);
        
        if (usuarioAutenticado) {
            res.status(200).json({
                mensaje: 'Login realizado con éxito',
                usuario: usuarioAutenticado
            });
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas (email o contraseña no válidos).' });
        }
    } catch (error) {
        console.error('Error al intentar loguear usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al procesar el login.' });
    }
})

router.post('/registro', async (req, res) => {
    const { nombre, apellido, email, contraseña, direccion, opcionEntrega, date } = req.body;
    
    let nuevoIdUsuario;
    
    try {
        const ultimoUsuario = await findLastUser();
        // Si hay un último usuario, sumamos 1. Si no hay, empezamos en 1.
        nuevoIdUsuario = ultimoUsuario ? ultimoUsuario.idUsuario + 1 : 1;
    } catch (error) {
        console.error('Error al calcular el nuevo idUsuario:', error);
        return res.status(500).json({ mensaje: 'Error interno al generar ID de usuario.' });
    }

    const nuevoUsuarioData = {
        idUsuario: nuevoIdUsuario,
        nombre: nombre,
        apellido: apellido,
        email: email,
        contraseña: contraseña,
        direccion: direccion,
        formaEntrega: opcionEntrega === 'opcionLocal' ? 'local' : 'envio',
        nacimiento: date, // Mongoose lo convertirá a Date
    };

    try {
        const usuarioCreado = await createUsuario(nuevoUsuarioData);

        res.status(201).json({
            mensaje: 'Usuario registrado con éxito.',
            usuario: usuarioCreado
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        
        if (error.code === 11000) { // Código de error de MongoDB para duplicados (Unique index)
            return res.status(400).json({ mensaje: 'El email ingresado ya está registrado.' });
        }
        
        res.status(500).json({ mensaje: 'Error interno al registrar el usuario.' });
    }
});


/*

router.post('/registro', (req, res) => {
    const { nombre, apellido, contraseña, email, direccion, formaEntrega, nacimiento } = req.body

    const camposEsperados = ['nombre', 'apellido', 'contraseña', 'email', 'direccion', 'formaEntrega', 'nacimiento']
    const camposRecibidos = Object.keys(req.body)

    const camposExtra = camposRecibidos.filter(campo => !camposEsperados.includes(campo))
    if (camposExtra.length > 0) {
        return res.status(400).json({ mensaje: `Campos no permitidos: ${camposExtra.join(', ')}` })
    }

    if (!nombre || !apellido || !email || !contraseña || !direccion || !formaEntrega || !nacimiento) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' })
    }

    if (typeof nombre !== 'string' ||
        typeof apellido !== 'string' ||
        typeof contraseña !== 'string' ||
        typeof email !== 'string' ||
        typeof direccion !== 'string' ||
        typeof nacimiento !== 'string') {
        return res.status(400).json({ mensaje: 'Los campos nombre, apellido, contraseña, email, direccion y nacimiento deben ser texto (string).' })
    }

    if (typeof formaEntrega !== 'number') {
        return res.status(400).json({ mensaje: 'El campo "formaEntrega" debe ser numérico.' })
    }

    if (formaEntrega !== 1 && formaEntrega !== 2) {
        return res.status(400).json({ mensaje: 'El campo "formaEntrega" solo puede tener el valor 1 o 2.' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ mensaje: 'El formato del email no es válido.' })
    }

    const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    if (!fechaRegex.test(nacimiento)) {
        return res.status(400).json({ mensaje: 'El formato de la fecha de nacimiento no es válido. Se requiere dd/mm/yyyy.' })
    }

    const existe = usuariosData.find(u => u.email === email)
    if (existe) {
        return res.status(400).json({ mensaje: 'El email ya está registrado.' })
    }

    const nuevoId = usuariosData.length > 0
        ? Math.max(...usuariosData.map(u => u.idUsuario)) + 1
        : 1

    const nuevoUsuario = {
        idUsuario: nuevoId,
        nombre,
        apellido,
        contraseña,
        email,
        direccion,
        formaEntrega,
        nacimiento
    }

    usuariosData.push(nuevoUsuario)

    writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2))
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.', usuario: nuevoUsuario })
})

*/


router.put('/cambiarDireccion', (req, res) => {
    const id = req.body.idUsuario
    const nuevaDireccion = req.body.direccion
    
    const camposEsperados = ['idUsuario', 'direccion']
    const camposRecibidos = Object.keys(req.body)
    const camposExtra = camposRecibidos.filter(campo => !camposEsperados.includes(campo))

    if (camposExtra.length > 0) {
        return res.status(400).json(`Campos no permitidos: ${camposExtra.join(', ')}`)
    }

    if (!id || !nuevaDireccion) {
        return res.status(400).json('Debes enviar "idUsuario" y "direccion".')
    }

    if (typeof id !== 'number') {
        return res.status(400).json('El campo "idUsuario" debe ser numérico.')
    }

    if (typeof nuevaDireccion !== 'string') {
        return res.status(400).json('El campo "direccion" debe ser texto (string).')
    }

    const indice = usuariosData.findIndex(e => e.idUsuario === id)

    if (indice === -1) {
        return res.status(404).json('No se encontró un usuario con ese ID.')
    }

    try{
        usuariosData[indice].direccion = nuevaDireccion

        writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2))
        res.status(200).json('Dirección modificada con éxito.')

    }catch(error){
        res.status(500).json('Error al actualizar la dirección.')
    }
})

router.delete('/eliminarUsuario/:idUsuario', (req, res) => {
    const id = parseInt(req.params.idUsuario)

    try {
        const usuarioIndex = usuariosData.findIndex(u => u.idUsuario === id)
        if (usuarioIndex === -1) {
            return res.status(404).json(`El usuario con ID ${id} no existe.`)
        }

        const tieneVentas = ventasData.some(v => v.idUsuario === id)
        if (tieneVentas) {
            return res.status(400).json(`No se puede eliminar el usuario con ID ${id} porque tiene ventas asociadas.`)
        }

        usuariosData.splice(usuarioIndex, 1)

        writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2))

        res.status(200).json(`Usuario con ID ${id} eliminado correctamente.`)
    } catch (error) {
        res.status(500).json('Error interno al intentar eliminar el usuario.')
    }
})


export default router