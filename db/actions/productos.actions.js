import { connectToDatabase } from "../connection.js";
import Product from "../schemas/productos.schema.js";

export const createProd = async({name, description, image, price, category, destacado}) => {
    try {
        await connectToDatabase()
        const res = await Product.create({name, description, image, price, category, destacado})
        console.log(res)
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}

export const findAll = async () => {
    try {
        await connectToDatabase()
        const res = await Product.find()
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}

export const findByCategory = async (category) => {
    try {
        await connectToDatabase()
        const res = await Product.find({category: category})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}
