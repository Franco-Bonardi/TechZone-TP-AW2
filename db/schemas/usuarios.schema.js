import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, models, model } = mongoose;

const UserSchema = new Schema({
    idUsuario: {type: Number},
    nombre: {type: String, required:true},
    apellido: {type: String, required:true},
    contraseña: {type:String, required:true, select: false},
    email: {type:String, required:true},
    direccion: {type:String, required:true},
    formaEntrega: {type:String, required:true},
    nacimiento: {type:Date, required:true}
})

UserSchema.methods.compararContraseña = async function (contraseñaIngresada) {
    // 'this.contraseña' es el hash guardado en la base de datos
    // bcrypt.compare() compara el string con el hash. Es una operación asíncrona.
    const esCorrecta = await bcrypt.compare(contraseñaIngresada, this.contraseña);
    return esCorrecta;
};

UserSchema.pre('save', async function (next) {
    const user = this;

    // Solo hasheamos si la contraseña ha sido modificada (o es nueva)
    if (!user.isModified('contraseña')) {
        return next();
    }

    try {
        // 1. Generar el salt (el factor aleatorio para el hasheo)
        const salt = await bcrypt.genSalt(10); 
        
        const hash = await bcrypt.hash(user.contraseña, salt);
        user.contraseña = hash;
        
        next();
    } catch (error) {
        return next(error);
    }
});

const User = models.user || model('user',UserSchema)

export default User
