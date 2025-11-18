import { connectToDatabase } from "../connection.js";
import Venta from "../schemas/ventas.schemas.js";

/*
export const createVenta = async({id, idUsuario, fecha, total, direccion, productos}) => {
    try {
        await connectToDatabase()
        const res = await Venta.create({id, idUsuario, fecha, total, direccion, productos})
        console.log(res)
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}
*/

export const createVenta = async (ventaData) => {
    try {
        await connectToDatabase();
        return await Venta.create(ventaData);
    } catch (error) {
        console.error("Error en createVenta (Mongoose):", error);
        throw error;
    }
};

export const findAllVentas = async () => {
    try {
        await connectToDatabase()
        const res = await Venta.find()
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}
