const Asientos = require('../model/asientosModel');

/**
 
Lista todos los asientos.*/
exports.getSeats = async (req, res) => {
    const asientosModel = new Asientos();
    try {
        const asientos = await asientosModel.findAsientos(req.body);
        res.status(200).json(asientos);
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};