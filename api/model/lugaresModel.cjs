const Connect = require("../index.cjs"); // * Importa la clase base 'Connect' desde el archivo '../index.js'

/**
 * Clase `Lugares`
 * 
 * Maneja las operaciones relacionadas con las salas de cine en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
class Lugares extends Connect {
    static instance; // * Propiedad estática para implementar el patrón Singleton

    constructor() {
        if (typeof Lugares.instance === "object") { // ? Verifica si ya existe una instancia de la clase 'Lugares'
            return Lugares.instance; // /! Si ya existe una instancia, la retorna y evita crear una nueva
        }
        super(); // * Llama al constructor de la clase base 'Connect'
        this.collection = this.db.collection('salas'); // * Asigna la colección 'salas' de la base de datos a la propiedad 'collection'
        Lugares.instance = this; // * Guarda la instancia actual en la propiedad estática 'instance'
        return this; // * Retorna la instancia de la clase 'Lugares'
    }

    /**
     * Recupera todas las salas disponibles en la base de datos.
     * 
     * @returns {Promise<Array<Object>>} Un arreglo de objetos que representan las salas.
     */
    async findSalas() {
        try {
            return await this.collection.find({}).toArray(); // * Realiza una búsqueda de todas las salas y las retorna como un array
        } catch (error) {
            console.error(`Error al recuperar salas: ${error.message}`); // /! Loguea un mensaje de error si falla la búsqueda
            throw new Error('No se pudieron recuperar las salas.'); // / ! Lanza un nuevo error si ocurre una excepción
        }
    }
}

module.exports = Lugares; // * Exporta la clase 'Lugares' para su uso en otros módulos
