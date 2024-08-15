import { connect } from "../../helper/db/connect.js";// Importa la clase 'connect' para manejar la conexión a la base de datos
import { ObjectId } from "mongodb"; // Importa 'ObjectId' para manejar identificadores únicos en MongoDB

// La clase 'Asientos' extiende la funcionalidad de la clase 'connect'
export class Asientos extends connect {
    constructor() {
        // Implementación del patrón Singleton: verifica si ya existe una instancia de 'Asientos'
        if (typeof Asientos.instance === "object") {
            return Asientos.instance; // Si ya existe, retorna la misma instancia
        }
        super(); // Llama al constructor de la clase 'connect' para inicializar la conexión
        this.collection = this.db.collection('asientos'); // Define la colección 'asientos' en la base de datos
        Asientos.instance = this; // Guarda la instancia actual de 'Asientos'
        return this; // Retorna la instancia actual de 'Asientos'
    }

    // Método asincrónico para encontrar todos los documentos en la colección 'asientos'
    async findAsientos() {
        let res = await this.collection.find({}).toArray(); // Realiza una consulta que devuelve todos los asientos
        return res; // Retorna el resultado de la consulta como un array
    }
}
