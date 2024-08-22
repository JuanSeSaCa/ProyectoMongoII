import { connect } from "../../helper/db/connect.js"; // Importa la clase 'connect' para manejar la conexión a la base de datos
import { ObjectId } from "mongodb"; // Importa 'ObjectId' para manejar identificadores únicos en MongoDB

// La clase 'Tickets' extiende la funcionalidad de la clase 'connect'
export class Tickets extends connect {
    constructor() {
        // Implementación del patrón Singleton: verifica si ya existe una instancia de 'Tickets'
        if (typeof Tickets.instance === "object") {
            return Tickets.instance; // Si ya existe, retorna la misma instancia
        }
        super(); // Llama al constructor de la clase 'connect' para inicializar la conexión
        this.collection = this.db.collection('Tickets'); // Define la colección 'tickets' en la base de datos
        Tickets.instance = this; // Guarda la instancia actual de 'Tickets'
        return this; // Retorna la instancia actual de 'Tickets'
    }

    // Método asincrónico para encontrar todos los documentos en la colección 'tickets'
    async findTickets() {
        let res = await this.collection.find({}).toArray(); // Realiza una consulta que devuelve todos los tickets
        return res; // Retorna el resultado de la consulta como un array
    }
}
