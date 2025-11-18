Autor: Franco Bonardi

(¡IMPORTANTE!): Dado que la base de datos es local, es necesario ejecutar el siguiente comando, que creará la base de datos TechZone en MongoDB y cargará los productos, usuarios y ventas desde los archivos JSON de prueba. Comando:
npm run seed

Luego de ejecutar el anterior comando, recién allí debe ejecutarse el siguiente comando para levantar el servidor en el puerto 3000:
npm run dev


Si se desea loguear, para luego simular una compra, puede utilizar los siguientes datos:
usuario antonio@ejemplo.com
contraseña: 123

Ahora también es posible crear un nuevo usuario a través del registro.
Todo está migrado hacia un esquema de base de datos no relacional, con contraseñas escriptadas.
