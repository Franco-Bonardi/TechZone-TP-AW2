import fs from 'fs';
import { connectToDatabase } from '../db/connection.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import ProductoModel from '../db/schemas/productos.schema.js'; 
import UsuarioModel from '../db/schemas/usuarios.schema.js'; 
import VentaModel from '../db/schemas/ventas.schemas.js'; 

const dataPath = './data/';

const leerJSON = (nombreArchivo) => {
    try {
        const data = fs.readFileSync(dataPath + nombreArchivo, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer el archivo ${nombreArchivo}:`, error.message);
        return [];
    }
};

const transformarUsuarios = (usuarios) => {
    return usuarios.map(usuario => {
        // Verifica si el campo 'nacimiento' existe y es una cadena (como "22/08/1985")
        if (usuario.nacimiento && typeof usuario.nacimiento === 'string' && usuario.nacimiento.includes('/')) {
            // Divide la cadena DD/MM/YYYY
            const [dia, mes, anio] = usuario.nacimiento.split('/');
            
            // Crea un objeto Date. JavaScript usa meses de 0 a 11, por eso restamos 1 al mes.
            usuario.nacimiento = new Date(anio, mes - 1, dia); 
        }
        return usuario;
    });
};

const seedData = async () => {
    console.log('Iniciando el proceso de carga de datos iniciales...');
    
    try {
        // 1. CONEXIÓN A LA BASE DE DATOS
        await connectToDatabase();
        console.log('Conexión establecida con MongoDB TechZone.');

        // Cargar datos desde los archivos JSON
        const productos = leerJSON('productos.json');
        let usuarios = leerJSON('usuarios.json');
        const ventas = leerJSON('ventas.json');

        if (usuarios.length > 0) {
            usuarios = transformarUsuarios(usuarios);
        }

        // 2. LIMPIEZA DE COLECCIONES (Recomendado para evitar duplicados)
        await ProductoModel.deleteMany({});
        await UsuarioModel.deleteMany({});
        await VentaModel.deleteMany({});
        console.log('Colecciones limpiadas (eliminados todos los datos previos).');

        // 3. INSERCIÓN DE NUEVOS DATOS
        if (productos.length > 0) {
            await ProductoModel.insertMany(productos);
            console.log(`Productos cargados: ${productos.length}`);
        } else {
            console.log('No hay productos en el JSON para cargar.');
        }
        
        if (usuarios.length > 0) {
            console.log('Encriptando contraseñas de usuarios iniciales...');
            for (const user of usuarios) {
                // Generar el salt y hashear la contraseña
                const salt = await bcrypt.genSalt(10); 
                user.contraseña = await bcrypt.hash(user.contraseña, salt);
            }
            console.log('Encriptación completada.');
            await UsuarioModel.insertMany(usuarios);
            console.log(`Usuarios cargados: ${usuarios.length}`);
        } else {
            console.log('No hay usuarios en el JSON para cargar.');
        }

        if (ventas.length > 0) {
            await VentaModel.insertMany(ventas);
            console.log(`Ventas cargadas: ${ventas.length}`);
        } else {
            console.log('No hay ventas en el JSON para cargar.');
        }

        console.log('\n Carga de datos iniciales finalizada con éxito.');

    } catch (error) {
        console.error('\n ERROR CRÍTICO durante la carga de datos:', error);
        console.error('Asegúrate de que MongoDB esté corriendo y los Modelos están correctamente importados.');
    } finally {
        await mongoose.connection.close(); 
        console.log('Conexión a la base de datos cerrada.');
    }
};

seedData();