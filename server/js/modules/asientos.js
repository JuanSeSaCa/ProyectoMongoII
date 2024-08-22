// import { connect } from "../../helper/db/connect.js";// Importa la clase 'connect' para manejar la conexión a la base de datos
// import { ObjectId } from "mongodb"; // Importa 'ObjectId' para manejar identificadores únicos en MongoDB

// // La clase 'Asientos' extiende la funcionalidad de la clase 'connect'
// export class Asientos extends connect {
//     constructor() {
//         // Implementación del patrón Singleton: verifica si ya existe una instancia de 'Asientos'
//         if (typeof Asientos.instance === "object") {
//             return Asientos.instance; // Si ya existe, retorna la misma instancia
//         }
//         super(); // Llama al constructor de la clase 'connect' para inicializar la conexión
//         this.collection = this.db.collection('asientos'); // Define la colección 'asientos' en la base de datos
//         Asientos.instance = this; // Guarda la instancia actual de 'Asientos'
//         return this; // Retorna la instancia actual de 'Asientos'
//     }

//     // Método asincrónico para encontrar todos los documentos en la colección 'asientos'
//     async findAsientos() {
//         let res = await this.collection.find({}).toArray(); // Realiza una consulta que devuelve todos los asientos
//         return res; // Retorna el resultado de la consulta como un array
//     }
// }


import express from 'express'; // Importa Express para manejar rutas y servidores
import { ObjectId } from 'mongodb'; // Importa 'ObjectId' para manejar identificadores únicos en MongoDB
import { connect } from '../../index.js'; // Importa la clase 'connect' para manejar la conexión a la base de datos

// @CLASS 'Asientos' extiende la funcionalidad de la clase 'connect' para manejar la colección 'asientos'
export class Asientos extends connect {
    constructor() {
        // @SINGLETON Implementación del patrón Singleton: verifica si ya existe una instancia de 'Asientos'
        if (typeof Asientos.instance === 'object') {
            return Asientos.instance; // @RETURN Si ya existe, retorna la misma instancia
        }
        super(); // Llama al constructor de la clase 'connect' para inicializar la conexión
        this.collection = this.db.collection('asientos'); // Define la colección 'asientos' en la base de datos
        Asientos.instance = this; // Guarda la instancia actual de 'Asientos'
        return this; // Retorna la instancia actual de 'Asientos'
    }

    // @METHOD Método asincrónico para encontrar todos los documentos en la colección 'asientos'
    async findAsientos() {
        try {
            const res = await this.collection.find({}).toArray(); // Realiza una consulta que devuelve todos los asientos
            return res; // @RETURN Retorna el resultado de la consulta como un array
        } catch (error) {
            console.error('Error al encontrar asientos:', error); // @ERROR Manejador de errores para capturar y mostrar errores en la consola
            throw error; // Lanza el error para que pueda ser manejado externamente
        }
    }

    // @METHOD Método para encontrar un asiento específico por su ID
    async findAsientoById(id) {
        try {
            const asiento = await this.collection.findOne({ _id: new ObjectId(id) }); // Realiza una consulta para encontrar un asiento por su ID
            return asiento; // @RETURN Retorna el asiento encontrado o null si no se encuentra
        } catch (error) {
            console.error('Error al encontrar asiento por ID:', error); // @ERROR Manejador de errores para capturar y mostrar errores en la consola
            throw error; // Lanza el error para que pueda ser manejado externamente
        }
    }
}

// @EXPRESS Inicializa Express
const app = express();
app.use(express.json()); // Middleware para parsear JSON en las solicitudes

// @ROUTE Ruta para obtener todos los asientos
app.get('/asientos', async (req, res) => {
    const asientos = new Asientos();
    try {
        const result = await asientos.findAsientos(); // Llama al método para obtener todos los asientos
        res.json(result); // Responde con el resultado en formato JSON
    } catch (error) {
        res.status(500).send('Error al obtener los asientos'); // Responde con un mensaje de error si ocurre un problema
    }
});

// @ROUTE Ruta para obtener un asiento por ID
app.get('/asientos/:id', async (req, res) => {
    const asientos = new Asientos();
    try {
        const result = await asientos.findAsientoById(req.params.id); // Llama al método para obtener un asiento por ID
        if (result) {
            res.json(result); // Responde con el asiento encontrado en formato JSON
        } else {
            res.status(404).send('Asiento no encontrado'); // Responde con un mensaje de error si no se encuentra el asiento
        }
    } catch (error) {
        res.status(500).send('Error al obtener el asiento'); // Responde con un mensaje de error si ocurre un problema
    }
});

// @SERVER Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000'); // Muestra un mensaje en la consola indicando que el servidor está corriendo
});
