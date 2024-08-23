const Lugares = require('../model/lugaresModel.js');

/**
 
Lista todas las salas de cine.*/
const getSalas = async (req, res) => {
    const lugaresModel = new Lugares();
    try {
        const salas = await lugaresModel.findSalas();
        res.status(200).json(salas);
    } catch (error) {
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

module.exports = {
    getSalas
};