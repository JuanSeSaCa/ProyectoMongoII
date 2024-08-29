const Asientos = require('../../api/model/asientosModel.cjs');

// * Controlador para listar todos los asientos.
exports.getSeats = async (req, res) => {
    // * Crear una instancia del modelo Asientos
    const asientosModel = new Asientos();
    
    try {
        // * Intentar obtener todos los asientos con los filtros de la solicitud
        const asientos = await asientosModel.findAsientos(req.body);
        
        // * Responder con un código 200 y los asientos obtenidos en formato JSON
        res.status(200).json(asientos);
    } catch (error) {
        // ! En caso de error, responder con un código 500 y un mensaje de error
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};
