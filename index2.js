import express from 'express'
import dotenv from 'dotenv'

import usuariosRouter from './routes/usuarios.routes.js'
import productosRouter from './routes/productos.routes.js'
import ventasRouter from './routes/ventas.routes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
})

app.use('/usuarios', usuariosRouter)
app.use('/productos', productosRouter)
app.use('/ventas', ventasRouter)
