// Importa el módulo de conexión a la base de datos y el DTO de Asientos.
const Connect = require("../index.js");
const AsientosDTO = require("./AsientosDTO.js"); // Asegúrate de tener la ruta correcta al archivo DTO

/**
 * Clase `Asientos`
 * 
 * Maneja las operaciones relacionadas con los asientos en la base de datos MongoDB.
 * 
 * @class Asientos
 * @extends Connect
 */
module.exports = class Asientos extends Connect {
    // Declaración de una propiedad estática para implementar el patrón Singleton.
    static instance;

    constructor() {
        if (typeof Asientos.instance === "object") {
            return Asientos.instance;
        }

        super();
        this.collection = this.db.collection('asientos');
        Asientos.instance = this;
        return this;
    }

    async findAsientos() {
        try {
            const asientosArray = await this.collection.find({}).toArray();
            // Utiliza el DTO para transformar los datos antes de retornarlos
            return AsientosDTO.fromDatabaseArray(asientosArray);
        } catch (error) {
            console.error(`Error al mostrar los asientos: ${error.message}`);
            throw new Error('No se pudieron mostrar los asientos.');
        }
    }
};
