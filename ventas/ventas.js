export const crearOrdenDeCompra = async (ordenDeCompraData) => {
    try {
        const response = await fetch(`http://localhost:3000/ventas/nuevaVenta`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ordenDeCompraData),
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(`Error ${response.status}: ${errorData.message || 'Fallo al crear la orden.'}`);
        }

        const respuesta = await response.json();
        return respuesta; // El backend devuelve { mensaje, venta }
    } catch (error) {
        console.error('Error al crear la orden de compra:', error);
        throw error;
    }
}