import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const ProductoSchema = new Schema({
    idProducto: { type: String, required: true },
    cantidad: { type: Number, required: true }
});

const VentaSchema = new Schema({
    id: {type: Number, required:true},
    idUsuario: {type: Number, required:true},
    fecha: {type: String, required:true},
    total: {type: Number, required:true},
    direccion: {type:String, required:true},
    productos: [ProductoSchema]
})

const Venta = models.venta || model('venta',VentaSchema)

export default Venta
