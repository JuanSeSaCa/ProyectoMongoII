// Importa el modelo de Asientos desde la ruta especificada.
const Asientos = require('../../server/model/asientosModel');

/**
 * @description Función para listar todos los asientos disponibles según los criterios proporcionados.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express, que contiene datos en `req.body`.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
exports.getSeats = async (req, res) => {
    // Crea una nueva instancia del modelo Asientos.
    const asientosModel = new Asientos();
    
    try {
        // Usa el método findAsientos() del modelo para obtener los asientos según los criterios en `req.body`.
        const asientos = await asientosModel.findAsientos(req.body);
        
        // Si la operación es exitosa, responde con un estado 200 y la lista de asientos en formato JSON.
        res.status(200).json(asientos);
    } catch (error) {
        // Si ocurre un error, responde con un estado 500 y un mensaje de error en formato JSON.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};
