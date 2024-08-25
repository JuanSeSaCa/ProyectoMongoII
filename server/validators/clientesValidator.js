// Importa las funciones 'param' y 'body' del paquete 'express-validator'
const { param, body } = require('express-validator');

/**
 * @description Valida los datos necesarios para crear un nuevo cliente.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const createClientValidationRules = () => {
    return [
        // Validación del campo 'nombre' en el cuerpo de la solicitud
        body('nombre')
            // Verifica que el campo 'nombre' no esté vacío
            .notEmpty().withMessage('El nombre es requerido'),
        
        // Validación del campo 'apellido' en el cuerpo de la solicitud
        body('apellido')
            // Verifica que el campo 'apellido' no esté vacío
            .notEmpty().withMessage('El apellido es requerido'),

        // Validación del campo 'nickname' en el cuerpo de la solicitud
        body('nickname')
            // Verifica que el campo 'nickname' no esté vacío
            .notEmpty().withMessage('El apodo es requerido'),
        
        // Validación del campo 'email' en el cuerpo de la solicitud
        body('email')
            // Verifica que el campo 'email' sea un correo electrónico válido
            .isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
        
        // Validación del campo 'telefono' en el cuerpo de la solicitud
        body('telefono')
            // Verifica que el campo 'telefono' no esté vacío
            .notEmpty().withMessage('El teléfono es requerido'),
        
        // Validación del campo 'contrasena' en el cuerpo de la solicitud
        body('contrasena')
            // Verifica que el campo 'contrasena' no esté vacío
            .notEmpty().withMessage('La contraseña es requerida'),
        
        // Validación del campo 'categoria' en el cuerpo de la solicitud
        body('categoria')
            // Verifica que el campo 'categoria' no esté vacío
            .notEmpty().withMessage('La categoría es requerida')
    ];
};

/**
 * @description Valida los datos necesarios para verificar una tarjeta VIP.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const verifyVIPCardValidationRules = () => {
    return [
        // Validación del campo 'id' en el cuerpo de la solicitud
        body('id')
            // Verifica que el campo 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID del cliente debe ser válido'),

        // Validación del campo 'numeroTarjeta' en el cuerpo de la solicitud
        body('numeroTarjeta')
            // Verifica que el campo 'numeroTarjeta' no esté vacío
            .notEmpty().withMessage('El número de la tarjeta es requerido')
    ];
};

// Exporta las funciones de validación para ser utilizadas en otras partes de la aplicación
module.exports = {
    createClientValidationRules,
    verifyVIPCardValidationRules
};
