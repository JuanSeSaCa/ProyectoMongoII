const Connect = require("../index.js"); // * Importa la clase base Connect que maneja la conexión a la base de datos
const { ObjectId } = require("mongodb"); // * Importa ObjectId desde el paquete mongodb para manejar identificadores de documentos
const { validateClientId, validateNewUser, validateVIPCard, validateUserRole } = require("../dto/clientesDto.js"); // * Importa funciones de validación y verificación desde DTOs relacionados con clientes

/**
 * * Clase `Clientes`
 * 
 * * Maneja las operaciones relacionadas con los clientes en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
class Clientes extends Connect {
    static instance; // * Propiedad estática para almacenar la instancia única de la clase

    constructor() {
        if (typeof Clientes.instance === "object") { // * Verifica si ya existe una instancia de la clase
            return Clientes.instance; // * Retorna la instancia existente para implementar el patrón Singleton
        }
        super(); // * Llama al constructor de la clase base para establecer la conexión con la base de datos
        this.collection = this.db.collection('clientes'); // * Establece la colección 'clientes' de la base de datos
        Clientes.instance = this; // * Guarda la instancia actual como única
        return this; // * Retorna la instancia de la clase
    }

    /**
     * * Recupera todos los clientes disponibles en la base de datos.
     * 
     * @returns {Promise<Array<Object>>} Un arreglo de objetos que representan los clientes.
     */
    async findClientes() {
        try {
            return await this.collection.find({}).toArray(); // * Recupera todos los clientes y los convierte a un arreglo
        } catch (error) { // ! Maneja errores que puedan ocurrir durante la recuperación
            console.error(`Error al recuperar clientes: ${error.message}`); // * Imprime un mensaje de error en la consola
            throw new Error('No se pudieron recuperar los clientes.'); // ! Lanza un error si ocurre un problema
        }
    }

    /**
     * * Verifica si la tarjeta VIP es válida para el cliente.
     * 
     * @param {Object} data - Datos necesarios para la verificación de la tarjeta VIP.
     * @returns {Promise<Object>} Un objeto con el estado de la verificación y un mensaje.
     */
    async verificarTarjetaVIP(data) {
        try {
            await validateVIPCard(data, this); // * Valida la tarjeta VIP usando la función importada
            return { status: 'Success', mensaje: 'Tarjeta válida. Puede proceder con la compra.' }; // * Retorna éxito si la tarjeta es válida
        } catch (error) { // ! Maneja errores que puedan ocurrir durante la verificación
            return { status: 'Error', mensaje: error.message }; // * Retorna un mensaje de error si la tarjeta no es válida
        }
    }

    /**
     * * Crea un nuevo usuario en la base de datos.
     * 
     * @param {Object} nuevoUsuario - Datos del nuevo usuario.
     * @returns {Promise<Object>} Un objeto con el estado de la creación y un mensaje.
     */
    async crearUsuario(nuevoUsuario) {
        try {
            await validateNewUser(nuevoUsuario, this); // * Valida la información del nuevo usuario usando la función importada
            
            const usuario = {
                ...nuevoUsuario, // * Copia los datos del nuevo usuario
                descuento: this.obtenerDescuentoPorCategoria(nuevoUsuario.categoria), // * Asigna el descuento basado en la categoría
                tarjeta: [] // * Inicializa el campo de tarjeta como vacío
            };

            const resultado = await this.collection.insertOne(usuario); // * Inserta el nuevo usuario en la colección 'clientes'

            await this.db.command({
                createUser: nuevoUsuario.nickname, // * Crea un nuevo usuario en el sistema con el nickname proporcionado
                pwd: nuevoUsuario.contrasena, // * Asigna la contraseña del nuevo usuario
                roles: [{ role: nuevoUsuario.categoria, db: 'CineCampus' }] // * Asigna el rol basado en la categoría del nuevo usuario
            });

            return { status: 'Success', mensaje: 'Usuario creado correctamente.', data: resultado }; // * Retorna éxito y los datos del resultado
        } catch (error) { // ! Maneja errores que puedan ocurrir durante la creación del usuario
            return { status: 'Error', mensaje: error.message || 'Error desconocido' }; // * Retorna un mensaje de error si ocurre un problema
        }
    }

    /**
     * * Obtiene los detalles de un usuario específico.
     * 
     * @param {string} id - ID del usuario cuyo detalle se quiere obtener.
     * @returns {Promise<Object>} Un objeto con el estado de la operación, un mensaje y los detalles del usuario.
     */
    async obtenerDetallesUsuario(id) {
        try {
            await validateClientId(id, this); // * Valida el ID del cliente usando la función importada
            const cliente = await this.collection.findOne({ _id: new ObjectId(id) }); // * Busca el cliente en la colección por su ID

            return {
                status: 'Success', // * Retorna éxito si se encuentran los detalles del usuario
                mensaje: 'Detalles del usuario obtenidos correctamente.',
                data: {
                    nombre: cliente.nombre, // * Nombre del cliente
                    apellido: cliente.apellido, // * Apellido del cliente
                    nickname: cliente.nickname, // * Nickname del cliente
                    email: cliente.email, // * Correo electrónico del cliente
                    telefono: cliente.telefono, // * Número de teléfono del cliente
                    categoria: cliente.categoria, // * Categoría del cliente
                    descuento: cliente.descuento, // * Descuento asignado al cliente
                    tarjetas: JSON.stringify(cliente.tarjeta, null, 2) // * Tarjetas asociadas al cliente, formateadas como JSON
                }
            };
        } catch (error) { // ! Maneja errores que puedan ocurrir durante la obtención de detalles
            return { status: 'Error', mensaje: error.message || 'Error inesperado' }; // * Retorna un mensaje de error si ocurre un problema
        }
    }

    /**
     * * Actualiza el rol de un usuario específico.
     * 
     * @param {string} id - ID del usuario cuyo rol se quiere actualizar.
     * @param {string} nuevoRol - El nuevo rol que se asignará al usuario.
     * @returns {Promise<Object>} Un objeto con el estado de la actualización y un mensaje.
     */
    async actualizarRolUsuario(id, nuevoRol) {
        try {
            validateUserRole(nuevoRol); // * Valida el nuevo rol usando la función importada
            await validateClientId(id, this); // * Valida el ID del cliente usando la función importada
            
            const resultado = await this.collection.updateOne(
                { _id: new ObjectId(id) }, // * Filtra el cliente por su ID
                { $set: { categoria: nuevoRol } } // * Actualiza la categoría del cliente con el nuevo rol
            );

            const updateResult = await this.db.command({
                updateUser: (await this.collection.findOne({ _id: new ObjectId(id) })).nickname, // * Obtiene el nickname del usuario para actualizarlo
                roles: [{ role: nuevoRol, db: 'CineCampus' }] // * Actualiza el rol del usuario en la base de datos
            });

            return { status: 'Success', mensaje: 'Rol actualizado correctamente.', data: updateResult }; // * Retorna éxito y los datos del resultado
        } catch (error) { // ! Maneja errores que puedan ocurrir durante la actualización del rol
            return { status: 'Error', mensaje: error.message }; // * Retorna un mensaje de error si ocurre un problema
        }
    }
}

module.exports = Clientes; // * Exporta la clase Clientes para ser utilizada en otras partes de la aplicación
