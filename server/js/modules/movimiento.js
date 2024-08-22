import { connect } from "../../helper/db/connect.js";
import { ObjectId } from "mongodb";

// Clase que maneja las operaciones relacionadas con los movimientos
export class Movimientos extends connect {
    /**
     * Constructor de la clase Movimientos
     * Utiliza el patrón Singleton para asegurar que solo haya una instancia de esta clase.
     */
    constructor() {
        // Si la instancia ya existe, devolverla en lugar de crear una nueva
        if (typeof Movimientos.instance === "object") {
            return Movimientos.instance;
        }
        super();
        // Inicialización de la colección 'Movimiento' en la base de datos
        this.collection = this.db.collection('movimiento');
        // Asignar la instancia actual a la variable estática 'instance'
        Movimientos.instance = this;
        return this;
    }

    /**
     * Método para obtener todos los movimientos de la colección
     * @returns {Array} - Un array con los documentos de todos los movimientos
     */
    async findMovimientos() {
        // Consultar la colección 'Movimiento' y devolver todos los documentos como un array
        let res = await this.collection.find({}).toArray();
        return res;
    }
}
