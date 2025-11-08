/* De momento no lo uso

export const auth = async ({email, contraseña}) => {
    const user = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
            },
        body: JSON.stringify({'email': email, 'contraseña': contraseña})
    }).then((res) => {
        if (!res.ok){
            throw new Error(`Error en la petición`)
        }
        return res.json()
    }).catch(error => {
        console.error('Error: ', error)
        throw new Error(`Error en la petición`)
    })
    return user
}
*/