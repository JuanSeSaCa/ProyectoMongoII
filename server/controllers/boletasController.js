// Importa el modelo de Boletas desde la ruta especificada.
// Asegúrate de que la ruta es correcta para evitar errores al importar el módulo.
const Boletas = require('../model/boletasModel.js'); 

/** 
 * @description Función para listar todas las boletas.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const getBoletas = async (req, res) => {
    // Crea una nueva instancia del modelo Boletas.
    const boletasModel = new Boletas();
    
    try {
        // Usa el método findBoletas() del modelo para obtener todas las boletas.
        const boletas = await boletasModel.findBoletas();
        
        // Si la operación es exitosa, responde con un estado 200 y la lista de boletas en formato JSON.
        res.status(200).json(boletas);
    } catch (error) {
        // Si ocurre un error, responde con un estado 500 y un mensaje de error en formato JSON.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

// Exporta la función getBoletas para que pueda ser utilizada en otros módulos.
module.exports = {
    getBoletas
};
const Boletas = require('../model/boletasModel.js'); // Asegúrate de que la ruta es correcta

/**
 
Lista todas las boletas.*/
const getBoletas = async (req, res) => {
    const boletasModel = new Boletas();
    try {
        const boletas = await boletasModel.findBoletas();
        res.status(200).json(boletas);
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

module.exports = {
    getBoletas
};