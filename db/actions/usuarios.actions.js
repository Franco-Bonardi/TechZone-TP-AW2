import { connectToDatabase } from "../connection.js";
import User from "../schemas/usuarios.schema.js";
import bcrypt from 'bcrypt';

export const findAllUsuarios = async () => {
    try {
        await connectToDatabase()
        const res = await User.find()
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}

export const createUsuario = async (userData) => {
    try {
        await connectToDatabase();
        
        const nuevoUsuario = await User.create(userData);
        
        const { contraseña, ...usuarioSinContraseña } = nuevoUsuario.toObject();
        
        return usuarioSinContraseña;
    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error; 
    }
};


/**
 * Busca un usuario por email y verifica la contraseña hasheada.
 * @param {string} email 
 * @param {string} contraseña Ingresada en texto plano
 * @returns {object|null} El usuario sin la contraseña si el login es exitoso, o null.
 */

export const findUserAndLogin = async (email, contraseña) => {
    await connectToDatabase();
    
    // 1. Buscar el usuario, forzando la inclusión del campo 'contraseña'
    const user = await User.findOne({ email }).select('+contraseña').lean(); 

    if (!user) {
        return null;
    }

    // 2. Comparar la contraseña ingresada con el hash guardado
    const esValida = await bcrypt.compare(contraseña, user.contraseña); 
    
    if (!esValida) {
        return null;
    }

    // 3. Devolver el usuario SIN el hash de la contraseña
    const { contraseña: _, ...usuarioSinContraseña } = user;
    return usuarioSinContraseña;
};

/**
 * Busca el usuario con el idUsuario más alto.
 * @returns {object|null} El usuario con el idUsuario máximo o null si la colección está vacía.
 */
export const findLastUser = async () => {
    try {
        await connectToDatabase();
        // Busca un usuario, ordenando de forma descendente por idUsuario (-1)
        // y limita el resultado a 1.
        const lastUser = await User.findOne({})
            .sort({ idUsuario: -1 })
            .exec();

        return lastUser;
    } catch (error) {
        console.error("Error al buscar último usuario:", error);
        throw error;
    }
};
