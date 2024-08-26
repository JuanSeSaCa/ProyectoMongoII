const Lugares = require('../model/lugaresModel.js'); // Importa el modelo de lugares

/**
 * * Lista todas las salas de cine.
 * ? Esta función maneja una solicitud GET para obtener todas las salas de cine desde la base de datos.
 */
const getSalas = async (req, res) => {
    const lugaresModel = new Lugares(); // Crea una instancia del modelo Lugares
    try {
        const salas = await lugaresModel.findSalas(); // ? Realiza una consulta a la base de datos para obtener las salas de cine
        res.status(200).json(salas); // * Devuelve las salas de cine en formato JSON con un estado 200 (OK)
    } catch (error) {
        //! Manejo de errores: Si hay un error durante la consulta, devuelve un estado 500 (Error del Servidor)
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

// Exporta la función getSalas para que pueda ser utilizada en otras partes de la aplicación
module.exports = {
    getSalas
};
