import {readFile} from 'fs/promises'

const archivoUsuarios = await readFile ('./data/usuarios.json', 'utf-8')
const usuariosData = JSON.parse(archivoUsuarios)

export const usuarioPorId = (id) => {
    return usuariosData.find(e => e.idUsuario === id)
}