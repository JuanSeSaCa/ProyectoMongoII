// Importa las funciones 'body' y 'param' del paquete 'express-validator'
const { body, param } = require('express-validator');

/**
 * @description Valida los datos necesarios para crear una nueva película.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const createFilmValidationRules = () => {
    return [
        // Validación del campo 'titulo' en el cuerpo de la solicitud
        body('titulo')
            // Verifica que el campo 'titulo' no esté vacío
            .notEmpty().withMessage('El título es requerido')
            // Verifica que el campo 'titulo' sea una cadena de caracteres
            .isString().withMessage('El título debe ser una cadena de caracteres'),

        // Validación del campo 'genero' en el cuerpo de la solicitud
        body('genero')
            // Verifica que el campo 'genero' no esté vacío
            .notEmpty().withMessage('El género es requerido')
            // Verifica que el campo 'genero' sea una cadena de caracteres
            .isString().withMessage('El género debe ser una cadena de caracteres'),

        // Validación del campo 'duracion' en el cuerpo de la solicitud
        body('duracion')
            // Verifica que el campo 'duracion' no esté vacío
            .notEmpty().withMessage('La duración es requerida')
            // Verifica que el campo 'duracion' sea un número
            .isNumeric().withMessage('La duración debe ser un número'),

        // Validación del campo 'sinopsis' en el cuerpo de la solicitud
        body('sinopsis')
            // El campo 'sinopsis' es opcional
            .optional()
            // Verifica que el campo 'sinopsis' sea una cadena de caracteres
            .isString().withMessage('La sinopsis debe ser una cadena de caracteres'),

        // Validación del campo 'fechaEstreno' en el cuerpo de la solicitud
        body('fechaEstreno')
            // Verifica que el campo 'fechaEstreno' no esté vacío
            .notEmpty().withMessage('La fecha de estreno es requerida')
            // Verifica que el campo 'fechaEstreno' sea una fecha válida en formato ISO 8601
            .isISO8601().withMessage('La fecha de estreno debe ser una fecha válida en formato ISO 8601')
    ];
};

/**
 * @description Valida los datos necesarios para actualizar una película existente.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const updateFilmValidationRules = () => {
    return [
        // Validación del campo 'id' en el cuerpo de la solicitud
        body('id')
            // Verifica que el campo 'id' no esté vacío
            .notEmpty().withMessage('El ID de la película es requerido')
            // Verifica que el campo 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID de la película debe ser un identificador MongoDB válido'),

        // Validación del campo 'titulo' en el cuerpo de la solicitud
        body('titulo')
            // El campo 'titulo' es opcional
            .optional()
            // Verifica que el campo 'titulo' sea una cadena de caracteres
            .isString().withMessage('El título debe ser una cadena de caracteres'),

        // Validación del campo 'genero' en el cuerpo de la solicitud
        body('genero')
            // El campo 'genero' es opcional
            .optional()
            // Verifica que el campo 'genero' sea una cadena de caracteres
            .isString().withMessage('El género debe ser una cadena de caracteres'),

        // Validación del campo 'duracion' en el cuerpo de la solicitud
        body('duracion')
            // El campo 'duracion' es opcional
            .optional()
            // Verifica que el campo 'duracion' sea un número
            .isNumeric().withMessage('La duración debe ser un número'),

        // Validación del campo 'sinopsis' en el cuerpo de la solicitud
        body('sinopsis')
            // El campo 'sinopsis' es opcional
            .optional()
            // Verifica que el campo 'sinopsis' sea una cadena de caracteres
            .isString().withMessage('La sinopsis debe ser una cadena de caracteres'),

        // Validación del campo 'fechaEstreno' en el cuerpo de la solicitud
        body('fechaEstreno')
            // El campo 'fechaEstreno' es opcional
            .optional()
            // Verifica que el campo 'fechaEstreno' sea una fecha válida en formato ISO 8601
            .isISO8601().withMessage('La fecha de estreno debe ser una fecha válida en formato ISO 8601')
    ];
};

/**
 * @description Valida los parámetros de la solicitud para obtener detalles de una película.
 * @returns {Array} Arreglo de validaciones para los parámetros de la solicitud.
 */
const filmDetailsValidationRules = () => {
    return [
        // Validación del parámetro 'id' en la solicitud
        param('id')
            // Verifica que el parámetro 'id' no esté vacío
            .notEmpty().withMessage('El ID de la película es requerido')
            // Verifica que el parámetro 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID de la película debe ser un identificador MongoDB válido')
    ];
};

/**
 * @description Valida los datos necesarios para eliminar una película.
 * @returns {Array} Arreglo de validaciones para los datos del cuerpo de la solicitud.
 */
const deleteFilmValidationRules = () => {
    return [
        // Validación del campo 'id' en el cuerpo de la solicitud
        body('id')
            // Verifica que el campo 'id' no esté vacío
            .notEmpty().withMessage('El ID de la película es requerido')
            // Verifica que el campo 'id' sea un identificador de MongoDB válido
            .isMongoId().withMessage('El ID de la película debe ser un identificador MongoDB válido')
    ];
};

// Exporta las funciones de validación para ser utilizadas en otras partes de la aplicación
module.exports = {
    createFilmValidationRules,
    updateFilmValidationRules,
    filmDetailsValidationRules,
    deleteFilmValidationRules
};
