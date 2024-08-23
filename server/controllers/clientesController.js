// Importa el modelo de Clientes desde la ruta especificada.
const Clientes = require('../model/clientesModel.js');

/**
 * @description Lista todos los clientes en la base de datos.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const getClientes = async (req, res) => {
    const clientesModel = new Clientes();
    
    try {
        // Obtiene todos los clientes utilizando el método findClientes() del modelo.
        const clientes = await clientesModel.findClientes();
        
        // Responde con un estado 200 y la lista de clientes en formato JSON.
        res.status(200).json(clientes);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * @description Verifica la tarjeta VIP de un cliente.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express, que contiene datos en `req.body`.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const verificarTarjetaVIP = async (req, res) => {
    const clientesModel = new Clientes();
    
    try {
        // Verifica la tarjeta VIP usando los datos proporcionados en `req.body`.
        const resultado = await clientesModel.verificarTarjetaVIP(req.body);
        
        // Responde con un estado 200 y el resultado de la verificación en formato JSON.
        res.status(200).json(resultado);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * @description Crea un nuevo cliente en la base de datos.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express, que contiene los datos del nuevo cliente en `req.body`.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const crearCliente = async (req, res) => {
    const clientesModel = new Clientes();
    
    try {
        // Crea un nuevo cliente utilizando los datos proporcionados en `req.body`.
        const resultado = await clientesModel.crearUsuario(req.body);
        
        // Responde con un estado 201 y los detalles del cliente recién creado en formato JSON.
        res.status(201).json(resultado);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * @description Obtiene los detalles de un cliente específico.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express, que contiene el ID del cliente en `req.params.id`.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const obtenerDetallesCliente = async (req, res) => {
    const clientesModel = new Clientes();
    
    try {
        // Obtiene los detalles de un cliente específico usando el ID proporcionado en `req.params.id`.
        const resultado = await clientesModel.obtenerDetallesUsuario(req.params.id);
        
        // Responde con un estado 200 y los detalles del cliente en formato JSON.
        res.status(200).json(resultado);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * @description Actualiza el rol de un cliente.
 * @async Esta función es asíncrona debido al uso de `await`.
 * @param {Object} req - El objeto de solicitud (request) de Express, que contiene el ID del cliente y el nuevo rol en `req.body`.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 */
const actualizarRolCliente = async (req, res) => {
    const clientesModel = new Clientes();
    
    try {
        // Actualiza el rol de un cliente usando el ID y el nuevo rol proporcionados en `req.body`.
        const resultado = await clientesModel.actualizarRolUsuario(req.body.id, req.body.nuevoRol);
        
        // Responde con un estado 200 y el resultado de la actualización en formato JSON.
        res.status(200).json(resultado);
    } catch (error) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error.
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos.
module.exports = {
    getClientes,
    verificarTarjetaVIP,
    crearCliente,
    obtenerDetallesCliente,
    actualizarRolCliente
};
  