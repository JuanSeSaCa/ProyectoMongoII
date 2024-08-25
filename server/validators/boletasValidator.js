// Importa las funciones 'param' y 'body' del paquete 'express-validator'
const { param, body } = require('express-validator');

/**
 * @description Valida los parámetros de la solicitud para obtener detalles de una boleta específica.
 * @returns {Array} Arreglo de validaciones para los parámetros de la solicitud.
 */
const boletaDetailsValidationRules = () => {
    return [
        // Validación del parámetro 'id' de la solicitud
        param('id')
            // Verifica que el parámetro 'id' no esté vacío
            .notEmpty().withMessage('El ID de la boleta es requerido')
            // Verifica que el parámetro 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID de la boleta debe ser un identificador MongoDB válido')
    ];
};

/**
 * @description Valida los datos necesarios para crear una nueva boleta.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const createBoletaValidationRules = () => {
    return [
        // Validación del campo 'evento' en el cuerpo de la solicitud
        body('evento')
            // Verifica que el campo 'evento' no esté vacío
            .notEmpty().withMessage('El nombre de la pelicula es requerido')
            // Verifica que el campo 'evento' sea una cadena de caracteres
            .isString().withMessage('El nombre de la pelicula debe ser una cadena de caracteres'),
        
        // Validación del campo 'fecha' en el cuerpo de la solicitud
        body('fecha')
            // Verifica que el campo 'fecha' no esté vacío
            .notEmpty().withMessage('La fecha es requerida')
            // Verifica que el campo 'fecha' sea una fecha válida en formato ISO 8601
            .isISO8601().withMessage('La fecha debe ser una fecha válida en formato ISO 8601')
    ];
};

// Exporta las funciones de validación para ser utilizadas en otras partes de la aplicación
module.exports = {
    boletaDetailsValidationRules,
    createBoletaValidationRules
};
