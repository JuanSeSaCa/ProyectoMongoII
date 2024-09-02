const { ObjectId } = require("mongodb");

/**
 * Valida si el ID del cliente es un ObjectId válido y existe en la base de datos.
 *
 * @param {string} id - El ID del cliente.
 * @param {Object} clientesModel - La instancia del modelo de clientes.
 * @returns {Promise<void>}
 * @throws {Error} Si el ID no es válido o el cliente no existe.
 */
async function validateClientId(id, clientesModel) {
    if (!ObjectId.isValid(id)) {
        throw new Error('El ID proporcionado no es válido.');
    }

    const cliente = await clientesModel.collection.findOne({ _id: new ObjectId(id) });

    if (!cliente) {
        throw new Error('Cliente no encontrado.');
    }
}

/**
 * Valida la información del nuevo usuario para asegurarse de que no existan conflictos.
 *
 * @param {Object} nuevoUsuario - El objeto con los datos del nuevo usuario.
 * @param {Object} clientesModel - La instancia del modelo de clientes.
 * @returns {Promise<void>}
 * @throws {Error} Si hay conflictos con el correo electrónico, teléfono o nickname.
 */
async function validateNewUser(nuevoUsuario, clientesModel) {
    const { email, telefono, nickname, categoria } = nuevoUsuario;
    const categoriasPermitidas = ['Administrador', 'Usuario Estándar', 'Usuario VIP'];

    if (!categoriasPermitidas.includes(categoria)) {
        throw new Error('Categoría no válida.');
    }

    const emailExistente = await clientesModel.collection.findOne({ email });
    if (emailExistente) {
        throw new Error('El correo electrónico ya está en uso.');
    }

    const telefonoExistente = await clientesModel.collection.findOne({ telefono });
    if (telefonoExistente) {
        throw new Error('El número de teléfono ya está en uso.');
    }

    const nicknameExistente = await clientesModel.collection.findOne({ nickname });
    if (nicknameExistente) {
        throw new Error('El nombre de usuario ya está en uso.');
    }
}

/**
 * Valida si el número de tarjeta VIP es válido y pertenece al cliente.
 *
 * @param {Object} data - Datos necesarios para la verificación.
 * @param {Object} clientesModel - La instancia del modelo de clientes.
 * @returns {Promise<void>}
 * @throws {Error} Si la tarjeta no es válida o no pertenece al cliente.
 */
async function validateVIPCard(data, clientesModel) {
    const { id, numeroTarjeta } = data;

    const cliente = await clientesModel.collection.findOne({ _id: new ObjectId(id) });

    if (!cliente) {
        throw new Error('Cliente no encontrado.');
    }

    const tarjeta = cliente.tarjeta.find(t => t.numero === numeroTarjeta && t.estado === 'activo');

    if (!tarjeta) {
        throw new Error('Tarjeta no válida o no pertenece al cliente.');
    }
}

/**
 * Valida el rol del usuario para asegurarse de que sea válido.
 *
 * @param {string} rol - El nuevo rol del usuario.
 * @throws {Error} Si el rol no es válido.
 */
function validateUserRole(rol) {
    const rolesValidos = ['Administrador', 'Usuario Estándar', 'Usuario VIP'];
    if (!rolesValidos.includes(rol)) {
        throw new Error('Rol no válido.');
    }
}

module.exports = {
    validateClientId,
    validateNewUser,
    validateVIPCard,
    validateUserRole
};