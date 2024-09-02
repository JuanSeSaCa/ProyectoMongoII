const { ObjectId } = require("mongodb"); // * Importa 'ObjectId' de la librería 'mongodb'
const Connect = require("../index"); // * Importa la clase base 'Connect' desde el archivo '../index'
const { validateFilmId } = require("../dto/peliculasDto");

/**
 * Clase `Peliculas`
 * 
 * Maneja las operaciones relacionadas con las películas y sus funciones en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
class Peliculas extends Connect {
    static instance; // * Propiedad estática para implementar el patrón Singleton

    constructor() {
        if (typeof Peliculas.instance === "object") { // ? Verifica si ya existe una instancia de la clase 'Peliculas'
            return Peliculas.instance; // /! Si ya existe una instancia, la retorna y evita crear una nueva
        }
        super(); // * Llama al constructor de la clase base 'Connect'
        this.collection = this.db.collection('peliculas'); // * Asigna la colección 'peliculas' de la base de datos a la propiedad 'collection'
        this.funcionesCollection = this.db.collection('funciones'); // * Asigna la colección 'funciones' de la base de datos a la propiedad 'funcionesCollection'
        Peliculas.instance = this; // * Guarda la instancia actual en la propiedad estática 'instance'
        return this; // * Retorna la instancia de la clase 'Peliculas'
    }

    /**
     * Recupera todas las películas de la colección 'peliculas'.
     * 
     * @returns {Promise<Array<Object>>} Arreglo de documentos de películas.
     */
    async findPeliculas() {
        try {
            return await this.collection.find({}).toArray(); // * Realiza una búsqueda de todas las películas y las retorna como un array
        } catch (error) {
            console.error(`Error al recuperar películas: ${error.message}`); // /! Loguea un mensaje de error si falla la búsqueda
            throw new Error('No se pudieron recuperar las películas.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Recupera todas las funciones futuras disponibles junto con los detalles de las películas asociadas.
     * 
     * @returns {Promise<Array<Object>>} Arreglo de funciones con los detalles de las películas.
     */
    async getAllFilmsAvailable() {
        try {
            return await this.funcionesCollection.aggregate([
                {
                    $match: {
                        Date_inicio: { $gte: new Date("2024-08-08T15:00:00.000Z") } // * Filtra solo funciones futuras
                    }
                },
                {
                    $lookup: {
                        from: "peliculas", // * Realiza un lookup con la colección 'peliculas'
                        localField: "id_pelicula", // * Campo de la colección 'funciones' que se relaciona con 'peliculas'
                        foreignField: "_id", // * Campo de la colección 'peliculas' que se relaciona con 'funciones'
                        as: "peliculas" // * Nombre del nuevo campo agregado con los documentos coincidentes
                    }
                },
                {
                    $unwind: "$peliculas" // * Descompone el array de peliculas en documentos individuales
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                "$$ROOT", "$peliculas" // * Combina el documento de funciones con el de películas
                            ]
                        }
                    }
                },
                {
                    $project: {
                        id_lugar: 0, // - Excluye el campo 'id_lugar' del resultado
                        peliculas: 0, // - Excluye el campo 'peliculas' del resultado
                        Date_fin: 0 // - Excluye el campo 'Date_fin' del resultado
                    }
                }
            ]).toArray(); // * Convierte el resultado de la agregación a un array
        } catch (error) {
            console.error(`Error al obtener funciones disponibles: ${error.message}`); // /! Loguea un mensaje de error si falla la búsqueda
            throw new Error('No se pudieron obtener las funciones disponibles.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Recupera los detalles de una película específica por su ID.
     * 
     * @param {string} id - El ID de la película a recuperar.
     * @returns {Promise<Object>} Documento con los detalles de la película.
     */
    async getAllDetailsFilms(id) {
        try {
            const objectId = new ObjectId(id); // * Convierte el ID proporcionado en un ObjectId
            const filmDetail = await this.collection.findOne({ _id: objectId }); // * Busca una película por su ID

            if (!filmDetail) { // ? Verifica si la película existe
                throw new Error('El id de la película ingresada no existe, por favor revíselo nuevamente.'); // /! Lanza un error si la película no se encuentra
            }

            return filmDetail; // * Retorna los detalles de la película
        } catch (error) {
            console.error(`Error al obtener detalles de la película: ${error.message}`); // /! Loguea un mensaje de error si falla la búsqueda
            throw new Error('No se pudieron obtener los detalles de la película.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Crea una nueva película en la colección 'peliculas'.
     * 
     * @param {Object} peliculaData - Datos de la película a crear.
     * @returns {Promise<Object>} Resultado de la operación de inserción.
     */
    async createPelicula(peliculaData) {
        try {
            const result = await this.collection.insertOne(peliculaData); // * Inserta un nuevo documento de película en la colección
            return result; // * Retorna el resultado de la operación de inserción
        } catch (error) {
            console.error(`Error al crear la película: ${error.message}`); // /! Loguea un mensaje de error si falla la inserción
            throw new Error('No se pudo crear la película.'); // / ! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Actualiza los detalles de una película específica por su ID.
     * 
     * @param {string} id - El ID de la película a actualizar.
     * @param {Object} updateData - Datos a actualizar en la película.
     * @returns {Promise<Object>} Resultado de la operación de actualización.
     */
    async updatePelicula(id, updateData) {
        try {
            const result = await this.collection.updateOne(
                { _id: new ObjectId(id) }, // * Filtro por ID de la película
                { $set: updateData } // * Establece los datos a actualizar
            );
            return result; // * Retorna el resultado de la operación de actualización
        } catch (error) {
            console.error(`Error al actualizar la película: ${error.message}`); // /! Loguea un mensaje de error si falla la actualización
            throw new Error('No se pudo actualizar la película.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Elimina una película específica por su ID.
     * 
     * @param {string} id - El ID de la película a eliminar.
     * @returns {Promise<Object>} Resultado de la operación de eliminación.
     */
    async deletePelicula(id) {
        try {
            const result = await this.collection.deleteOne({ _id: new ObjectId(id) }); // * Elimina el documento de película por ID
            return result; // * Retorna el resultado de la operación de eliminación
        } catch (error) {
            console.error(`Error al eliminar la película: ${error.message}`); // /! Loguea un mensaje de error si falla la eliminación
            throw new Error('No se pudo eliminar la película.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }
}

module.exports = Peliculas; // * Exporta la clase 'Peliculas' para su uso en otros módulos
