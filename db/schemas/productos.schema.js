import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const ProductSchema = new Schema({
    id: {type:Number, required:true},
    name: {type: String, required:true},
    description: {type: String, required:true},
    image: {type: String},
    price: {type:Number, required:true},
    category: {type:String, required:true},
    destacado: {type:Boolean, required:true}
})

const Product = models.product || model('product',ProductSchema)

export default Product