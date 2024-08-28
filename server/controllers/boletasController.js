const Boletas = require('../model/boletosModel'); // * Importa el modelo de Boletas desde el archivo boletasModel.js. Asegúrate de que la ruta es correcta

/**
 * * Controlador para manejar las operaciones relacionadas con los boletos.
 * 
 * @class
 */
class BoletasController {
    /**
     * * Obtiene todas las boletas.
     * 
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static async getBoletas(req, res) {
        const boletasModel = new Boletas(); // * Crea una instancia del modelo Boletas
        try {
            const boletas = await boletasModel.findBoletas(); // * Llama al método findBoletas del modelo para obtener todas las boletas
            res.status(200).json(boletas); // * Devuelve un estado 200 y la lista de boletas en formato JSON
        } catch (error) {
            res.status(500).json({ status: 'Error', mensaje: error.message }); // ! Devuelve un error 500 y el mensaje de error si ocurre una excepción
        }
    }

    /**
     * * Crea un nuevo boleto.
     * 
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    static async createBoleto(req, res) {
        const boletasModel = new Boletas(); // * Crea una instancia del modelo Boletas
        try {
            const params = req.body; // * Obtiene los datos del cuerpo de la solicitud
            const nuevoBoleto = await boletasModel.crearBoleto(params); // * Llama al método crearBoleto del modelo para crear un nuevo boleto con los datos proporcionados
            res.status(201).json(nuevoBoleto); // * Devuelve un estado 201 y el nuevo boleto en formato JSON
        } catch (error) {
            res.status(500).json({ status: 'Error', mensaje: error.message }); // ! Devuelve un error 500 y el mensaje de error si ocurre una excepción
        }
    }
}

// * Exporta la clase BoletasController para que pueda ser utilizada en otras partes de la aplicación
module.exports = BoletasController;
