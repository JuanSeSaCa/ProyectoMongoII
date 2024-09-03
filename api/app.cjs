const express = require("express");
const app = express();
const cors = require('cors'); // * Importar el middleware CORS

// * Configuración de CORS
app.use(cors()); // Permitir todas las solicitudes desde cualquier origen

// * Importar los routers desde router.js
const { 
    peliculasRouter, 
    asientosRouter, 
    boletasRouter, 
    clientesRouter, 
    funcionesRouter, 
    salasRouter 
} = require("./router.cjs");

// * Middleware para parsear JSON
app.use(express.json());

// * Middleware para servir archivos estáticos (comentado, agregar según sea necesario)
// const path = require('path');
// app.use('/css', express.static(path.join(__dirname, process.env.EXPRESS_STATIC, 'css'))); // ? Sirve archivos CSS
// app.use('/js', express.static(path.join(__dirname, process.env.EXPRESS_STATIC, 'js'))); // ? Sirve archivos JavaScript
// app.use('/storage', express.static(path.join(__dirname, process.env.EXPRESS_STATIC, 'storage'))); // ? Sirve archivos de almacenamiento

// * Rutas de la API
app.use('/api/peliculas', peliculasRouter); // ? Rutas relacionadas con películas
app.use('/api/asientos', asientosRouter); // ? Rutas relacionadas con asientos
app.use('/api/boletas', boletasRouter); // ? Rutas relacionadas con boletas
app.use('/api/clientes', clientesRouter); // ? Rutas relacionadas con clientes
app.use('/api/funciones', funcionesRouter); // ? Rutas relacionadas con funciones de cine
app.use('/api/salas', salasRouter); // ? Rutas relacionadas con salas de cine

// * Middleware para manejar errores 403
app.use((req, res, next) => {
    //! Respuesta de error 403 (Prohibido)
    res.status(403).json({ message: "No tiene autorización" });
});

// * Middleware para manejar errores 404
app.use((req, res) => {
    //! Respuesta de error 404 (Recurso no encontrado)
    res.status(404).json({ message: "Recurso no encontrado" });
});

// * Configuración del servidor
const config = {
    port: process.env.VITE_PORT_BACKEND || 3000, // ? Puerto del servidor (por defecto 3000 si no se especifica)
    host: process.env.VITE_HOST || 'localhost'  // ? Host del servidor (por defecto 'localhost' si no se especifica)
};

// * Iniciar el servidor
app.listen(config.port, config.host, () => {
    console.log(`Servidor corriendo en http://${config.host}:${config.port}`); // * Mensaje de confirmación al iniciar el servidor
});