// Importa el módulo de conexión a la base de datos.
const Connect = require("../index.js");

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

    /**
     * Constructor de la clase `Asientos`.
     * 
     * @constructor
     * @returns {Asientos} Instancia única de la clase `Asientos`.
     */
    constructor() {
        // Verifica si ya existe una instancia de `Asientos`.
        if (typeof Asientos.instance === "object") {
            // Si existe, retorna la instancia ya creada para asegurar un Singleton.
            return Asientos.instance;
        }

        // Llama al constructor de la clase base `Connect`.
        super();
        
        // Asigna la colección 'asientos' de la base de datos a una propiedad de la instancia.
        this.collection = this.db.collection('asientos');
        
        // Guarda la instancia actual como la instancia única.
        Asientos.instance = this;
        
        // Retorna la instancia actual.
        return this;
    }

    /**
     * Recupera todos los asientos disponibles en la base de datos.
     * 
     * @async 
     * @method findAsientos
     * @returns {Promise<Array<Object>>} Una promesa que resuelve a un arreglo de objetos que representan los asientos.
     */
    async findAsientos() {
        try {
            // Realiza una consulta a la colección de 'asientos' y convierte el resultado a un arreglo.
            return await this.collection.find({}).toArray();
        } catch (error) {
            // Manejo de errores: imprime el error en la consola y lanza un error personalizado.
            console.error(`Error al mostrar los asientos: ${error.message}`);
            throw new Error('No se pudieron mostrar los asientos.');
        }
    }
};
