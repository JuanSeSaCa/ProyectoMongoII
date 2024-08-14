import { connect } from "../../helper/db/connect.js";
import { ObjectId } from "mongodb";

/**
 * Clase `Peliculas`
 * 
 * Maneja las operaciones relacionadas con las películas y sus funciones en la base de datos MongoDB.
 * 
 * @class
 * @extends connect
 */
export class Peliculas extends connect {
    /**
     * Constructor de la clase Peliculas
     * 
     * Utiliza el patrón Singleton para asegurar que solo haya una instancia de esta clase.
     */
    constructor() {
        // Si la instancia ya existe, devolver la instancia existente
        if (typeof Peliculas.instance === "object") {
            return Peliculas.instance;
        }
        super();
        // Inicialización de las colecciones en la base de datos
        this.collection = this.db.collection('peliculas');
        this.lugarCollection = this.db.collection('lugar');
        this.funcionesCollection = this.db.collection('funciones');
        // Asignar la instancia actual a la variable estática 'instance'
        Peliculas.instance = this;
        return this;
    }

    /**
     * Recupera todas las películas disponibles.
     * 
     * @returns {Promise<Array<Object>>} Un arreglo de objetos con todas las películas disponibles.
     */
    async findPeliculas() {
        try {
            // Consultar la colección 'Peliculas' y devolver todos los documentos como un array
            let res = await this.collection.find({}).toArray();
            return res;
        } catch (error) {
            // Captura y retorna errores si ocurre un problema
            return { status: 'Error', mensaje: error.message };
        }
    }

    /**
     * API para listar todas las películas disponibles.
     * 
     * Este método obtiene todas las funciones de películas disponibles en cartelera,
     * junto con los detalles de cada película, excluyendo campos innecesarios.
     * 
     * @returns {Promise<Array<Object> | Object>} 
     * - Un array con los detalles de las funciones de películas disponibles si la operación es exitosa.
     * - Un objeto con el estado y mensaje de error si ocurre un problema durante la consulta.
     */
    async getAllFilmsAvailable() {
        try {
            // Consultar las funciones disponibles y unir con los detalles de películas
            const FuncionesDisponibles = await this.funcionesCollection.aggregate([
                {
                    $match: {
                        Date_inicio: { $gte: new Date() } // Solo funciones futuras
                    }
                },
                {
                    $lookup: {
                        from: "Peliculas",
                        localField: "id_pelicula",
                        foreignField: "_id",
                        as: "Peliculas"
                    }
                },
                {
                    $unwind: "$Peliculas" // Descompone el array de Peliculas en documentos individuales
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                "$$ROOT", "$Peliculas" // Combina el documento de funciones con el de películas
                            ]
                        }
                    }
                },
                {
                    $project: {
                        id_lugar: 0, // Excluye el campo id_lugar
                        Peliculas: 0, // Excluye el campo Peliculas
                        Date_fin: 0 // Excluye el campo Date_fin
                    }
                }
            ]).toArray();

            // Retornar las funciones disponibles
            return FuncionesDisponibles;
        } catch (error) {
            // Captura y retorna errores en la agregación
            return { status: 'Error', mensaje: error.message || 'Error inesperado' };
        }
    }

    /**
     * API para obtener los detalles de una película específica por su id.
     * 
     * Permite la consulta de información detallada sobre una película específica, 
     * incluyendo la sinopsis.
     * 
     * @param {Object} data - Objeto que contiene el identificador de la película.
     * @param {string} data.id - Identificador único de la película.
     * 
     * @returns {Promise<Object | Object>} 
     * - Un objeto con los detalles de la película si existe.
     * - Un objeto con el estado y mensaje de error si el id no existe.
     * 
     * @throws {Error} Lanza un error si ocurre un problema durante la consulta.
     */
    async getAllDetailsFilms(data) {
        const { id } = data;
        try {
            // Convertir el id a ObjectId
            const objectId = new ObjectId(id);

            // Buscar la película por ID
            const filmDetail = await this.collection.findOne({ _id: objectId });

            // Verificar si el documento existe
            if (!filmDetail) {
                return { status: 'Not Found', mensaje: 'El id de la película ingresada no existe, por favor revíselo nuevamente.' };
            }

            // Retornar los detalles de la película
            return filmDetail;
        } catch (error) {
            // Captura y retorna errores si ocurre un problema
            return { status: 'Error', mensaje: error.message || 'Error inesperado' };
        }
    }
}
