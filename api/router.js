const express = require('express');
const { validationResult } = require('express-validator');

// Importar controladores
const peliculasController = require('./controllers/peliculasController.js');
const asientosController = require('./controllers/asientosController.js');
const boletasController = require('./controllers/boletasController.js');
const clientesController = require('./controllers/clientesController.js');
const funcionesController = require('./controllers/funcionesController.js');
const lugaresController = require('./controllers/lugaresController.js');

// Importar validadores
const peliculasValidator = require('./validators/peliculasValidator.js');
const asientosValidator = require('./validators/asientosValidator.js');
const funcionesValidator = require('./validators/funcionesValidator.js');
const clientesValidator = require('./validators/clientesValidator.js');

// Verifica que todo se ha importado correctamente
// console.log('Peliculas Controller:', peliculasController);
// console.log('Asientos Controller:', asientosController);
// console.log('Boletas Controller:', boletasController);
// console.log('Clientes Controller:', clientesController);
// console.log('Funciones Controller:', funcionesController);
// console.log('Lugares Controller:', lugaresController);

const peliculasRouter = express.Router();
const asientosRouter = express.Router();
const boletasRouter = express.Router();
const clientesRouter = express.Router();
const funcionesRouter = express.Router();
const salasRouter = express.Router();

// Middleware para manejar errores de validación
/**
 * Middleware para validar los resultados de la validación.
 * Retorna un error 400 con detalles si hay errores, o continúa al siguiente middleware si no hay errores.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

//-------------------------------------- // PELICULAS // ------------------------------------------------

/**
 * Obtiene la lista de todas las películas.
 */
peliculasRouter.get('/', peliculasController.getPeliculas);

/**
 * Obtiene las películas disponibles.
 */
peliculasRouter.get('/available', peliculasController.getFilmsAvailable);

/**
 * Obtiene los detalles de una película específica.
 * Valida el ID de la película antes de obtener los detalles.
 */
peliculasRouter.get('/:id', peliculasValidator.filmDetailsValidationRules(), validate, peliculasController.getFilmDetails);

/**
 * Crea una nueva película.
 * Valida los datos de la película antes de crearla.
 */
peliculasRouter.post('/', peliculasValidator.createFilmValidationRules(), validate, peliculasController.createPelicula);

/**
 * Actualiza una película existente.
 * Valida los datos de la película antes de actualizarla.
 */
peliculasRouter.post('/update', peliculasValidator.updateFilmValidationRules(), validate, peliculasController.updatePelicula);

/**
 * Elimina una película especificada.
 */
peliculasRouter.post('/delete', peliculasController.deletePelicula);

//-------------------------------------- // ASIENTOS // ------------------------------------------------

/**
 * Obtiene la lista de asientos disponibles.
 */
asientosRouter.get('/',  asientosController.getSeats);

//-------------------------------------- // BOLETAS // ------------------------------------------------

/**
 * Obtiene la lista de boletas.
 */
boletasRouter.get('/', boletasController.getBoletas);

//-------------------------------------- // CLIENTES // ------------------------------------------------

/**
 * Obtiene la lista de clientes.
 */
clientesRouter.get('/', clientesController.getClientes);

/**
 * Verifica una tarjeta VIP.
 * Valida los datos de la tarjeta VIP antes de verificarla.
 */
clientesRouter.post('/verificar-tarjeta', clientesValidator.verifyVIPCardValidationRules(), validate, clientesController.verificarTarjetaVIP);

/**
 * Crea un nuevo cliente.
 * Valida los datos del cliente antes de crear uno nuevo.
 */
clientesRouter.post('/', clientesValidator.createClientValidationRules(), validate, clientesController.crearCliente);

/**
 * Obtiene los detalles de un cliente específico.
 */
clientesRouter.get('/:id', clientesController.obtenerDetallesCliente);

/**
 * Actualiza el rol de un cliente.
 */
clientesRouter.put('/actualizar-rol', clientesController.actualizarRolCliente);

//-------------------------------------- // FUNCIONES // ------------------------------------------------

/**
 * Obtiene la lista de funciones.
 */
funcionesRouter.get('/', funcionesController.getFunciones);

/**
 * Verifica la disponibilidad de boletas.
 * Valida los datos de la solicitud antes de verificar la disponibilidad.
 */
funcionesRouter.post('/available', funcionesValidator.checkAvailableBoletasValidationRules(), validate, funcionesController.checkAvailableBoletas);

/**
 * Reserva asientos para una función.
 * Valida los datos de la solicitud antes de realizar la reserva.
 */
funcionesRouter.post('/reservar', funcionesValidator.reservarAsientosValidationRules(), validate, funcionesController.reservarAsientos);

/**
 * Cancela una reserva de asientos.
 * Valida los datos de la solicitud antes de cancelar la reserva.
 */
funcionesRouter.post('/cancelar-reserva', funcionesValidator.cancelarReservaValidationRules(), validate, funcionesController.cancelarReserva);

//-------------------------------------- // SALAS (LUGARES) // ------------------------------------------------

/**
 * Obtiene la lista de salas.
 */
salasRouter.get('/', lugaresController.getSalas);

// Exportar todos los routers organizados
module.exports = {
    peliculasRouter,
    asientosRouter,
    boletasRouter,
    clientesRouter,
    funcionesRouter,
    salasRouter
};