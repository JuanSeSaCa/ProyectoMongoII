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
        body('_id_cliente') // * Valida el campo '_id_cliente'
            .notEmpty().withMessage('El ID del cliente es requerido') // * Asegura que el campo no esté vacío y muestra un mensaje de error si lo está
            .isMongoId().withMessage('El ID del cliente debe ser un identificador MongoDB válido'), // * Verifica que el campo sea un identificador MongoDB válido
    
        body('id_pelicula') // * Valida el campo 'id_pelicula'
            .notEmpty().withMessage('El ID de la película es requerido') // * Asegura que el campo no esté vacío y muestra un mensaje de error si lo está
            .isMongoId().withMessage('El ID de la película debe ser un identificador MongoDB válido'), // * Verifica que el campo sea un identificador MongoDB válido
    
        body('id_sala') // * Valida el campo 'id_sala'
            .notEmpty().withMessage('El ID de la sala es requerido') // * Asegura que el campo no esté vacío y muestra un mensaje de error si lo está
            .isMongoId().withMessage('El ID de la sala debe ser un identificador MongoDB válido'), // * Verifica que el campo sea un identificador MongoDB válido
    
        body('Date_compra') // * Valida el campo 'Date_compra'
            .notEmpty().withMessage('La fecha de compra es requerida') // * Asegura que el campo no esté vacío y muestra un mensaje de error si lo está
            .isISO8601().withMessage('La fecha de compra debe ser una fecha válida en formato ISO 8601'), // * Verifica que el campo sea una fecha válida en formato ISO 8601
    
        body('asiento_reservado') // * Valida el campo 'asiento_reservado'
            .notEmpty().withMessage('El código del asiento es requerido') // * Asegura que el campo no esté vacío y muestra un mensaje de error si lo está
            .isString().withMessage('El código del asiento debe ser una cadena de caracteres') // * Verifica que el campo sea una cadena de caracteres
    ];
    
};

// Exporta las funciones de validación para ser utilizadas en otras partes de la aplicación
module.exports = {
    boletaDetailsValidationRules,
    createBoletaValidationRules
};
