// Importa el modelo de Funciones desde la ruta especificada.
const Funciones = require('../model/funcionesModel');

/**
 * @description Lista todas las funciones de cine disponibles.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const getFunciones = async (req, res) => {
    const funcionesModel = new Funciones();
    
    try {
        // Obtiene todas las funciones de cine usando el método findFunciones() del modelo.
        const funciones = await funcionesModel.findFunciones();
        
        // Responde con un estado 200 y la lista de funciones en formato JSON.
        res.status(200).json(funciones);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * @description Verifica la disponibilidad de asientos para una función específica.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express, que contiene el ID de la función en `req.body`.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const checkAvailableBoletas = async (req, res) => {
    const funcionesModel = new Funciones();
    const { id } = req.body; // Extrae el ID de la función desde el cuerpo de la solicitud.
    
    try {
        // Verifica la disponibilidad de boletas para la función con el ID proporcionado.
        const result = await funcionesModel.findAvailableBoletas({ id });
        
        // Responde con un estado 200 y el resultado de la verificación en formato JSON.
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * @description Reserva asientos para una función específica.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express, que contiene el ID de la función y los asientos seleccionados en `req.body`.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const reservarAsientos = async (req, res) => {
    const funcionesModel = new Funciones();
    const { id, asientosSeleccionados } = req.body; // Extrae el ID de la función y los asientos seleccionados desde el cuerpo de la solicitud.
    
    try {
        // Reserva los asientos seleccionados para la función con el ID proporcionado.
        const result = await funcionesModel.reservarAsientos({ id, asientosSeleccionados });
        
        // Responde con un estado 200 y el resultado de la reserva en formato JSON.
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * @description Cancela la reserva de asientos para una función específica.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express, que contiene el ID de la función y los asientos a cancelar en `req.body`.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const cancelarReserva = async (req, res) => {
    const funcionesModel = new Funciones();
    const { id, asientosCancelar } = req.body; // Extrae el ID de la función y los asientos a cancelar desde el cuerpo de la solicitud.
    
    try {
        // Cancela la reserva de los asientos especificados para la función con el ID proporcionado.
        const result = await funcionesModel.cancelarReserva({ id, asientosCancelar });
        
        // Responde con un estado 200 y el resultado de la cancelación en formato JSON.
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos.
module.exports = {
    getFunciones,
    checkAvailableBoletas,
    reservarAsientos,
    cancelarReserva
};
