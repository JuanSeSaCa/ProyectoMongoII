const { ObjectId } = require("mongodb");

/**
 * Valida si el id de la película es un ObjectId válido
 * y verifica si existe en la base de datos.
 *
 * @param {ObjectId} id - El id de la película.
 * @param {Object} peliculasModel - La instancia del modelo de películas.
 * @returns {Promise<void>}
 * @throws {Error} Si el id no es válido o la película no existe.
 */
async function validateFilmId(id, peliculasModel) {
    if (!ObjectId.isValid(id)) {
        throw new Error('El id proporcionado no es válido.');
    }

    const filmDetail = await peliculasModel.collection.findOne({ _id: new ObjectId(id) });

    if (!filmDetail) {
        throw new Error('El id de la película ingresada no existe, por favor revíselo nuevamente.');
    }
}

module.exports = {
    validateFilmId
};
