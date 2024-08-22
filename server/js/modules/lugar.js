import { connect } from "../../helper/db/connect.js";
import { ObjectId } from "mongodb";

// Clase que maneja las operaciones relacionadas con los lugares (salas)
export class Lugares extends connect {
    /**
     * Constructor de la clase Lugares
     * Utiliza el patrón Singleton para asegurar que solo haya una instancia de esta clase.
     */
    constructor() {
        // Si la instancia ya existe, devolverla en lugar de crear una nueva
        if (typeof Lugares.instance === "object") {
            return Lugares.instance;
        }
        super();
        // Inicialización de la colección 'Lugar' en la base de datos
        this.collection = this.db.collection('lugar');
        // Asignar la instancia actual a la variable estática 'instance'
        Lugares.instance = this;
        return this;
    }

    /**
     * Método para obtener todas las salas de la colección
     * @returns {Array} - Un array con los documentos de todas las salas
     */
    async findSalas() {
        // Consultar la colección 'Lugar' y devolver todos los documentos como un array
        let res = await this.collection.find({}).toArray();
        return res;
    }
}
