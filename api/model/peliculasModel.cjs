// api/model/peliculasModel.cjs
const { ObjectId } = require('mongodb');
const Connect = require('../index.cjs'); // Ajusta la ruta según tu estructura
const { validateFilmId } = require('../dto/peliculasDto.cjs');

class Peliculas {
    static instance;

    constructor() {
        if (Peliculas.instance) {
            return Peliculas.instance;
        }

        this.connect = new Connect();
        this.connect.connect()
            .then(() => {
                if (!this.connect.db) {
                    throw new Error('La base de datos no está disponible.');
                }
                this.collection = this.connect.db.collection('peliculas');
                this.funcionesCollection = this.connect.db.collection('funciones');
                Peliculas.instance = this;
            })
            .catch(error => {
                console.error(`Error en la conexión: ${error.message}`);
                throw error;
            });
    }

    async findPeliculas() {
        try {
            return await this.collection.find({}).toArray();
        } catch (error) {
            console.error(`Error al recuperar películas: ${error.message}`);
            throw new Error('No se pudieron recuperar las películas.');
        }
    }

    async getAllFilmsAvailable() {
        try {
            return await this.funcionesCollection.aggregate([
                {
                    $match: {
                        Date_inicio: { $gte: new Date() }
                    }
                },
                {
                    $lookup: {
                        from: 'peliculas',
                        localField: 'id_pelicula',
                        foreignField: '_id',
                        as: 'peliculas'
                    }
                },
                {
                    $unwind: '$peliculas'
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                '$$ROOT', '$peliculas'
                            ]
                        }
                    }
                },
                {
                    $project: {
                        id_lugar: 0,
                        peliculas: 0,
                        Date_fin: 0
                    }
                }
            ]).toArray();
        } catch (error) {
            console.error(`Error al obtener funciones disponibles: ${error.message}`);
            throw new Error('No se pudieron obtener las funciones disponibles.');
        }
    }

    async getAllDetailsFilms(id) {
        try {
            if (!validateFilmId) {
                throw new Error('Función de validación no está disponible.');
            }

            await validateFilmId(id, this); // Asegúrate de pasar la instancia de Peliculas

            const objectId = new ObjectId(id);
            const filmDetail = await this.collection.findOne({ _id: objectId });

            if (!filmDetail) {
                throw new Error('El id de la película ingresada no existe, por favor revíselo nuevamente.');
            }

            return filmDetail;
        } catch (error) {
            console.error(`Error al obtener detalles de la película: ${error.message}`);
            throw new Error('No se pudieron obtener los detalles de la película.');
        }
    }

    async createPelicula(peliculaData) {
        try {
            const result = await this.collection.insertOne(peliculaData);
            return result;
        } catch (error) {
            console.error(`Error al crear la película: ${error.message}`);
            throw new Error('No se pudo crear la película.');
        }
    }

    async updatePelicula(id, updateData) {
        try {
            const result = await this.collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );
            return result;
        } catch (error) {
            console.error(`Error al actualizar la película: ${error.message}`);
            throw new Error('No se pudo actualizar la película.');
        }
    }

    async deletePelicula(id) {
        try {
            const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
            return result;
        } catch (error) {
            console.error(`Error al eliminar la película: ${error.message}`);
            throw new Error('No se pudo eliminar la película.');
        }
    }
}

module.exports = Peliculas;