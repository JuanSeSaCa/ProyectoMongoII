const Connect = require("../index.js"); // * Importa la clase base 'Connect' desde el archivo '../index.js'
const { ObjectId } = require("mongodb"); // * Importa 'ObjectId' de la librería 'mongodb'

/**
 * Clase `Boletas`
 * 
 * Maneja las operaciones relacionadas con las boletas en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
class Boletas extends Connect {
    static instance; // * Propiedad estática para implementar el patrón Singleton

    constructor() {
        if (typeof Boletas.instance === "object") { // ? Verifica si ya existe una instancia de la clase 'Boletas'
            return Boletas.instance; // ! Si ya existe una instancia, la retorna y evita crear una nueva
        }
        super(); // * Llama al constructor de la clase base 'Connect'
        this.collection = this.db.collection('boletas'); // * Asigna la colección 'boletas' de la base de datos a la propiedad 'collection'
        Boletas.instance = this; // * Guarda la instancia actual en la propiedad estática 'instance'
        return this; // * Retorna la instancia de la clase 'Boletas'
    }

    /**
     * Recupera todas las boletas disponibles en la base de datos.
     * 
     * @returns {Promise<Array<Object>>} Un arreglo de objetos que representan las boletas.
     */
    async findBoletas() {
        try {
            return await this.collection.find({}).toArray(); // * Realiza una búsqueda de todas las boletas y las retorna como un array
        } catch (error) {
            console.error(`Error al recuperar boletas: ${error.message}`); // ! Loguea un mensaje de error si falla la búsqueda
            throw new Error('No se pudieron recuperar las boletas.'); // ! Lanza un nuevo error si ocurre una excepción
        }
    }
}

module.exports = Boletas; // * Exporta la clase 'Boletas' para su uso en otros módulos
