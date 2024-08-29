// Importa la función 'param' del paquete 'express-validator'
const { param } = require('express-validator');

/**
 * @description Valida los parámetros de la solicitud para obtener detalles de un asiento (en caso de ser necesario).
 * @returns {Array} Arreglo de validaciones para los parámetros de la solicitud.
 */
const seatDetailsValidationRules = () => {
    return [
        // Validación del parámetro 'id' de la solicitud
        param('id')
            // Verifica que el parámetro 'id' no esté vacío
            .notEmpty().withMessage('El ID del asiento es requerido')
            // Verifica que el parámetro 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID del asiento debe ser un identificador MongoDB válido')
    ];
};

// Exporta la función de validación para ser utilizada en otras partes de la aplicación
module.exports = {
    seatDetailsValidationRules
};
