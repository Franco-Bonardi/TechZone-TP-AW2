export const getProductos = async (categoria) => {
    try{
        const response = await fetch(`http://localhost:3000/productos/porCategoria/${categoria}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok){
            throw new Error(`Error: ${response.status}`)
        }

        const productos = await response.json()
        return productos
    }catch(error){
        console.error('Error al traer los productos', error)
    }
}

export const getTodosLosProductos = async () => {
    try{
        const response = await fetch(`http://localhost:3000/productos/listadoCompleto`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok){
            throw new Error(`Error: ${response.status}`)
        }

        const productos = await response.json()
        return productos
    }catch(error){
        console.error('Error al traer los productos', error)
    }
}
