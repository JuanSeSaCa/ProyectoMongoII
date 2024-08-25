// Importa la función 'body' del paquete 'express-validator'
const { body } = require('express-validator');

/**
 * @description Valida los datos necesarios para verificar la disponibilidad de boletos.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const checkAvailableBoletasValidationRules = () => {
    return [
        // Validación del campo 'id' en el cuerpo de la solicitud
        body('id')
            // Verifica que el campo 'id' no esté vacío
            .notEmpty().withMessage('El ID de la función es requerido')
            // Verifica que el campo 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID de la función debe ser un identificador MongoDB válido')
    ];
};

/**
 * @description Valida los datos necesarios para reservar asientos.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const reservarAsientosValidationRules = () => {
    return [
        // Validación del campo 'id' en el cuerpo de la solicitud
        body('id')
            // Verifica que el campo 'id' no esté vacío
            .notEmpty().withMessage('El ID de la función es requerido')
            // Verifica que el campo 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID de la función debe ser un identificador MongoDB válido'),
        
        // Validación del campo 'asientosSeleccionados' en el cuerpo de la solicitud
        body('asientosSeleccionados')
            // Verifica que 'asientosSeleccionados' sea un arreglo con al menos un elemento
            .isArray({ min: 1 }).withMessage('Debe proporcionar al menos un asiento para reservar')
            // Valida el contenido del arreglo 'asientosSeleccionados'
            .custom((asientosSeleccionados) => {
                // Verifica que 'asientosSeleccionados' sea un arreglo y tenga al menos un elemento
                if (!Array.isArray(asientosSeleccionados) || asientosSeleccionados.length === 0) {
                    throw new Error('Debe proporcionar al menos un asiento para reservar');
                }
                return true;
            })
    ];
};

/**
 * @description Valida los datos necesarios para cancelar una reserva de asientos.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const cancelarReservaValidationRules = () => {
    return [
        // Validación del campo 'id' en el cuerpo de la solicitud
        body('id')
            // Verifica que el campo 'id' no esté vacío
            .notEmpty().withMessage('El ID de la función es requerido')
            // Verifica que el campo 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID de la función debe ser un identificador MongoDB válido'),
        
        // Validación del campo 'asientosCancelar' en el cuerpo de la solicitud
        body('asientosCancelar')
            // Verifica que 'asientosCancelar' sea un arreglo con al menos un elemento
            .isArray({ min: 1 }).withMessage('Debe proporcionar al menos un asiento para cancelar la reserva')
            // Valida el contenido del arreglo 'asientosCancelar'
            .custom((asientosCancelar) => {
                // Verifica que 'asientosCancelar' sea un arreglo y tenga al menos un elemento
                if (!Array.isArray(asientosCancelar) || asientosCancelar.length === 0) {
                    throw new Error('Debe proporcionar al menos un asiento para cancelar la reserva');
                }
                return true;
            })
    ];
};

// Exporta las funciones de validación para ser utilizadas en otras partes de la aplicación
module.exports = {
    checkAvailableBoletasValidationRules,
    reservarAsientosValidationRules,
    cancelarReservaValidationRules
};
