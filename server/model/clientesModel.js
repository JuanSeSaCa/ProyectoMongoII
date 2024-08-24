const Connect = require("../index.js"); // * Importa la clase base 'Connect' desde el archivo '../index.js'
const { ObjectId } = require("mongodb"); // * Importa 'ObjectId' de la librería 'mongodb'

/**
 * Clase `Clientes`
 * 
 * Maneja las operaciones relacionadas con los clientes en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
class Clientes extends Connect {
    static instance; // * Propiedad estática para implementar el patrón Singleton

    constructor() {
        if (typeof Clientes.instance === "object") { // ? Verifica si ya existe una instancia de la clase 'Clientes'
            return Clientes.instance; // /! Si ya existe una instancia, la retorna y evita crear una nueva
        }
        super(); // * Llama al constructor de la clase base 'Connect'
        this.collection = this.db.collection('clientes'); // * Asigna la colección 'clientes' de la base de datos a la propiedad 'collection'
        Clientes.instance = this; // * Guarda la instancia actual en la propiedad estática 'instance'
        return this; // * Retorna la instancia de la clase 'Clientes'
    }

    /**
     * Recupera todos los clientes de la colección 'clientes'.
     * 
     * @returns {Promise<Array<Object>>} Arreglo de documentos de clientes.
     */
    async findClientes() {
        try {
            return await this.collection.find({}).toArray(); // * Realiza una búsqueda de todos los clientes y los retorna como un array
        } catch (error) {
            console.error(`Error al recuperar clientes: ${error.message}`); // /! Loguea un mensaje de error si falla la búsqueda
            throw new Error('No se pudieron recuperar los clientes.'); // */! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Verifica la validez de una tarjeta VIP durante el proceso de compra.
     * 
     * @param {Object} data - Datos necesarios para la verificación.
     * @returns {Object} Objeto con el estado y el mensaje de la verificación.
     */
    async verificarTarjetaVIP(data) {
        const { id, numeroTarjeta } = data; // * Desestructura los datos de la tarjeta y el ID del cliente
        try {
            const cliente = await this.collection.findOne({ _id: new ObjectId(id) }); // * Busca el cliente por ID

            if (!cliente) { // ? Verifica si el cliente existe
                return { status: 'Not Found', mensaje: 'Cliente no encontrado.' }; // /! Si no se encuentra el cliente, retorna un error
            }

            const tarjeta = cliente.tarjeta.find(t => t.numero === numeroTarjeta && t.estado === 'activo'); // * Verifica si la tarjeta es válida y está activa

            if (!tarjeta) { // ? Verifica si la tarjeta encontrada es válida
                return { status: 'Error', mensaje: 'Tarjeta no válida o no pertenece al cliente.' }; // /! Si no es válida, retorna un error
            }

            return { status: 'Success', mensaje: 'Tarjeta válida. Puede proceder con la compra.' }; // * Retorna éxito si la tarjeta es válida
        } catch (error) {
            let [status, mensaje] = `${error}`.split(": "); // * Divide el mensaje de error para retornar un objeto estructurado
            return { status, mensaje }; // * Retorna el estado y el mensaje del error
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     * 
     * @param {Object} nuevoUsuario - Objeto con los datos del usuario.
     * @returns {Object} Objeto con el estado y el mensaje del resultado de la creación del usuario.
     */
    async crearUsuario(nuevoUsuario) {
        const { nombre, apellido, nickname, email, telefono, contrasena, categoria } = nuevoUsuario; // * Desestructura los datos del nuevo usuario

        const usuario = { // * Define el objeto usuario con los datos proporcionados y el descuento calculado
            nombre,
            apellido,
            nickname,
            email,
            telefono,
            contrasena,
            categoria,
            descuento: this.obtenerDescuentoPorCategoria(categoria), // * Calcula el descuento basado en la categoría del usuario
            tarjeta: []
        };

        try {
            // ? Verifica si el email, teléfono o nickname ya existen en la base de datos
            const emailExistente = await this.collection.findOne({ email });
            if (emailExistente) {
                return { status: 'Error', mensaje: 'El correo electrónico ya está en uso.' }; // /! Retorna un error si el email ya está en uso
            }

            const telefonoExistente = await this.collection.findOne({ telefono });
            if (telefonoExistente) {
                return { status: 'Error', mensaje: 'El número de teléfono ya está en uso.' }; // /! Retorna un error si el teléfono ya está en uso
            }

            const nicknameExistente = await this.collection.findOne({ nickname });
            if (nicknameExistente) {
                return { status: 'Error', mensaje: 'El nombre de usuario ya está en uso.' }; // /! Retorna un error si el nickname ya está en uso
            }

            // ? Verifica si la categoría proporcionada es válida
            const categoriasPermitidas = ['Administrador', 'Usuario Estándar', 'Usuario VIP'];
            if (!categoriasPermitidas.includes(categoria)) {
                return { status: 'Error', mensaje: 'Categoría no válida.' }; // /! Retorna un error si la categoría no es válida
            }

            const resultado = await this.collection.insertOne(usuario); // * Inserta el nuevo usuario en la colección

            await this.db.command({ // * Crea un usuario de base de datos con el rol correspondiente
                createUser: nickname,
                pwd: contrasena,
                roles: [{ role: categoria, db: 'CineCampus' }]
            });

            return { status: 'Success', mensaje: 'Usuario creado correctamente.', data: resultado }; // * Retorna éxito si el usuario fue creado correctamente
        } catch (error) {
            let [status, mensaje] = error.message.split(": "); // * Divide el mensaje de error para retornar un objeto estructurado
            return { status: status || 'Error', mensaje: mensaje || 'Error desconocido' }; // * Retorna el estado y el mensaje del error
        }
    }

    /**
     * Obtiene el descuento aplicable basado en la categoría del usuario.
     * 
     * @param {string} categoria - La categoría del usuario.
     * @returns {number} El porcentaje de descuento aplicable.
     */
    obtenerDescuentoPorCategoria(categoria) {
        switch (categoria) { // * Calcula el descuento según la categoría del usuario
            case 'Administrador':
                return 20; // * Descuento del 20% para administradores
            case 'Usuario Estándar':
                return 30; // * Descuento del 30% para usuarios estándar
            case 'Usuario VIP':
                return 45; // * Descuento del 45% para usuarios VIP
            default:
                return 0; // * Retorna 0 si la categoría no es válida
        }
    }

    /**
     * Obtiene la información detallada de un usuario por su ID.
     * 
     * @param {string} id - El ID del usuario.
     * @returns {Object} Objeto que contiene los detalles del usuario.
     */
    async obtenerDetallesUsuario(id) {
        try {
            if (!id) {
                return { status: 'Error', mensaje: 'ID no proporcionado.' }; // /! Retorna un error si no se proporciona un ID
            }

            const cliente = await this.collection.findOne({ _id: new ObjectId(id) }); // * Busca al cliente por su ID

            if (!cliente) { // ? Verifica si el cliente existe
                return { status: 'Not Found', mensaje: 'Cliente no encontrado.' }; // /! Retorna un error si no se encuentra el cliente
            }

            return {
                status: 'Success',
                mensaje: 'Detalles del usuario obtenidos correctamente.', // * Retorna éxito con los detalles del usuario si se encuentra
                data: {
                    nombre: cliente.nombre,
                    apellido: cliente.apellido,
                    nickname: cliente.nickname,
                    email: cliente.email,
                    telefono: cliente.telefono,
                    categoria: cliente.categoria,
                    descuento: cliente.descuento,
                    tarjetas: JSON.stringify(cliente.tarjeta, null, 2) // * Retorna las tarjetas del cliente en formato JSON
                }
            };
        } catch (error) {
            return { status: 'Error', mensaje: error.message || 'Error inesperado' }; // * Retorna un error en caso de excepción
        }
    }

    /**
     * Actualiza el rol de un usuario.
     * 
     * @param {ObjectId} id - ID del usuario.
     * @param {string} nuevoRol - Nuevo rol del usuario.
     * @returns {Promise<Object>} Objeto con el estado y el mensaje de la actualización.
     */
    async actualizarRolUsuario(id, nuevoRol) {
        try {
            const rolesValidos = ['Administrador', 'Usuario Estándar', 'Usuario VIP']; // * Define los roles válidos
            if (!rolesValidos.includes(nuevoRol)) {
                return { status: 'Error', mensaje: 'Rol no válido.' }; // /! Retorna un error si el nuevo rol no es válido
            }

            const user = await this.collection.findOne({ _id: new ObjectId(id) }); // * Busca al usuario por su ID
            if (!user) {
                return { status: 'Not Found', mensaje: 'Cliente no encontrado.' }; // /! Retorna un error si no se encuentra el usuario
            }

            const resultado = await this.collection.updateOne( // * Actualiza el rol del usuario en la colección
                { _id: new ObjectId(id) },
                { $set: { categoria: nuevoRol } }
            );

            if (resultado.matchedCount === 0) { // ? Verifica si se encontró al usuario para actualizar
                return { status: 'Not Found', mensaje: 'Cliente no encontrado.' }; // /! Retorna un error si no se encuentra el usuario
            }

            const updateResult = await this.db.command({ // * Actualiza el rol del usuario en la base de datos
                updateUser: user.nickname,
                roles: [{ role: nuevoRol, db: 'CineCampus' }]
            });

            return { status: 'Success', mensaje: 'Rol actualizado correctamente.', data: updateResult }; // * Retorna éxito si el rol fue actualizado correctamente
        } catch (error) {
            let [status, mensaje] = `${error}`.split(": "); // * Divide el mensaje de error para retornar un objeto estructurado
            return { status, mensaje }; // * Retorna el estado y el mensaje del error
        }
    }
}

module.exports = Clientes; // * Exporta la clase 'Clientes' para su uso en otros módulos
