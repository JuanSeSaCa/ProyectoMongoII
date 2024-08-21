import { connect } from "../../helper/db/connect.js";
import { ObjectId } from "mongodb";

/**
 * *Clase Clientes para gestionar las operaciones relacionadas con los clientes.
 * TODO: Extiende la clase connect para conectarse a la base de datos MongoDB.
 */
export class Clientes extends connect {
    /**
     * * Constructor de la clase Clientes.
     * TODO: Implementa el patrón Singleton para asegurar que solo exista una instancia de esta clase.
     */
    constructor() {
        if (typeof Clientes.instance === "object") {
            return Clientes.instance;
        }
        super();
        this.base = this.db
        this.collection = this.db.collection('clientes');
        Clientes.instance = this;
        return this;
    }

    /**
     * * API para Listar Usuarios:
     * * Obtiene todos los clientes de la colección 'Cliente'.
     * @returns {Array} Arreglo de documentos de clientes.
     */
    async findClientes() {
        let res = await this.collection.find({}).toArray();
        return res;
    }

    /**
     * *API para Verificar Tarjeta VIP
     * TODO: Verifica la validez de una tarjeta VIP durante el proceso de compra.
     * @param {string} nombre - El nombre del cliente.
     * @param {string} numeroTarjeta - El número de la tarjeta a verificar.
     * @returns {Object} Un objeto que indica el estado y el mensaje del resultado de la verificación.
     * @returns {error} Si el nombre del cliente, la tarjeta o algun dato no es correcto.
     */
    
    async verificarTarjetaVIP(data) {
        const {id, numeroTarjeta}=data
        try {
            // Buscar el cliente por nombre
            const cliente = await this.collection.findOne({ _id: new ObjectId(id) });

            // Si no se encuentra el cliente, retornar un mensaje de error
            if (!cliente) {
                return { status: 'Not Found', mensaje: 'Cliente no encontrado.' };
            }

            // Verificar si la tarjeta pertenece al cliente y está activa
            const tarjeta = cliente.tarjeta.find(t => t.numero === numeroTarjeta && t.estado === 'activo');

            // Si la tarjeta no es válida o no pertenece al cliente, retornar un mensaje de error
            if (!tarjeta) {
                return { status: 'Error', mensaje: 'Tarjeta no válida o no pertenece al cliente.' };
            }

            // Si la tarjeta es válida, retornar un mensaje de éxito
            return { status: 'Success', mensaje: 'Tarjeta válida. Puede proceder con la compra.' };

        } catch (error) {
            // Captura y retorna errores
            let [status, mensaje] = `${error}`.split(": ");
            return { status, mensaje };
        }
    }

   
   /**
 * Crea un nuevo usuario en la base de datos.
 * @param {Object} nuevoUsuario - Objeto con los datos del usuario.
 * @param {string} nuevoUsuario.nombre - El nombre del usuario.
 * @param {string} nuevoUsuario.apellido - El apellido del usuario.
 * @param {string} nuevoUsuario.nickname - El apodo del usuario.
 * @param {string} nuevoUsuario.email - El correo electrónico del usuario.
 * @param {string} nuevoUsuario.telefono - El número de teléfono del usuario.
 * @param {string} nuevoUsuario.contrasena - La contraseña del usuario (será encriptada).
 * @param {string} nuevoUsuario.categoria - La categoría del usuario (Administrador, Usuario Estándar, Usuario VIP).
 * @returns {Object} Un objeto que indica el estado y el mensaje del resultado de la creación del usuario.
 */
   async crearUsuario(nuevoUsuario) {
    const { nombre, apellido, nickname, email, telefono, contrasena, categoria } = nuevoUsuario;

    // Crear el objeto de usuario con todos los datos necesarios
    const usuario = {
        nombre,
        apellido,
        nickname,
        email,
        telefono,
        contrasena, // Contraseña sin encriptar
        categoria,
        descuento: this.obtenerDescuentoPorCategoria(categoria),
        tarjeta: []
    };

    try {
        // Validar que el email, teléfono y nickname no estén en uso
        const emailExistente = await this.collection.findOne({ email });
        if (emailExistente) {
            return { status: 'Error', mensaje: 'El correo electrónico ya está en uso.' };
        }

        const telefonoExistente = await this.collection.findOne({ telefono });
        if (telefonoExistente) {
            return { status: 'Error', mensaje: 'El número de teléfono ya está en uso.' };
        }

        const nicknameExistente = await this.collection.findOne({ nickname });
        if (nicknameExistente) {
            return { status: 'Error', mensaje: 'El nombre de usuario ya está en uso.' };
        }

        // Validar categoría
        const categoriasPermitidas = ['Administrador', 'Usuario Estandar', 'Usuario VIP'];
        if (!categoriasPermitidas.includes(categoria)) {
            return { status: 'Error', mensaje: 'Categoría no válida.' };
        }

        // Insertar el usuario en la base de datos
        const resultado = await this.collection.insertOne(usuario);

        // Crear el usuario en la base de datos del sistema (este paso puede necesitar ajustes)
        await this.db.command({
            createUser: nickname,
            pwd: contrasena, // Encriptar la contraseña antes de usarla
            roles: [{ role: categoria, db: 'cineCampus' }]
        });

        return { status: 'Success', mensaje: 'Usuario creado correctamente.', data: resultado };

    } catch (error) {
        // Captura y retorna errores
        let [status, mensaje] = error.message.split(": ");
        return { status: status || 'Error', mensaje: mensaje || 'Error desconocido' };
    }
}


/**
 * Obtiene el descuento aplicable basado en la categoría del usuario.
 * @param {string} categoria - La categoría del usuario.
 * @returns {number} El porcentaje de descuento aplicable.
 */
obtenerDescuentoPorCategoria(categoria) {
    switch (categoria) {
        case 'Administrador':
            return 20;
        case 'Usuario Estándar':
            return 30;
        case 'Usuario VIP':
            return 45;
        default:
            return 0;
    }
}

    /**
     * * Obtiene la información detallada de un usuario por su ID.
     * @param {string} id - El ID del usuario.
     * @returns {Object} Un objeto que contiene los detalles del usuario, incluyendo su rol y el estado de sus tarjetas VIP.
     */
    async obtenerDetallesUsuario(data) {
    try {
        // Asegúrate de que 'data' sea un objeto y 'id' esté presente
        const { id } = data;

        if (!id) {
            return { status: 'Error', mensaje: 'ID no proporcionado.' };
        }

        // Buscar el cliente por ID
        const cliente = await this.collection.findOne({ _id: new ObjectId(id) });

        // Si no se encuentra el cliente, retornar un mensaje de error
        if (!cliente) {
            return { status: 'Not Found', mensaje: 'Cliente no encontrado.' };
        }

        // Retornar los detalles del cliente
        return {
            status: 'Success',
            mensaje: 'Detalles del usuario obtenidos correctamente.',
            data: {
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                nickname: cliente.nickname,
                email: cliente.email,
                telefono: cliente.telefono,
                categoria: cliente.categoria,
                descuento: cliente.descuento,
                tarjetas: JSON.stringify(cliente.tarjeta, null, 2)
            }
        };
    } catch (error) {
        // Captura y retorna errores
        return { status: 'Error', mensaje: error.message || 'Error inesperado' };
    }
}
/**
     * Actualiza el rol de un usuario.
     * @param {ObjectId} id - id del usuario.
     * @param {string} nuevoRol - Nuevo rol del usuario. Debe ser uno de los siguientes: 'Administrador', 'Usuario Estándar', 'Usuario VIP'.
     * @returns {Promise<Object>} - Objeto con el estado y el mensaje de la actualización del rol del usuario.
     */
async actualizarRolUsuario(data) {

    const {id, nuevoRol}= data
    try {
        // Validar el nuevo rol
        const rolesValidos = ['Administrador', 'Usuario Estándar', 'Usuario VIP'];
        if (!rolesValidos.includes(nuevoRol)) {
            return { status: 'Error', mensaje: 'Rol no válido. Los roles permitidos son Administrador, Usuario Estándar, Usuario VIP.' };
        }

        // Obtener el nickname del usuario
        const user = await this.collection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return { status: 'Not Found', mensaje: 'Cliente no encontrado.' };
        }

        const nicknameUser = user.nickname;

        // Actualizar el rol del usuario en la colección de usuarios
        const resultado = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { categoria: nuevoRol } }
        );

        if (resultado.matchedCount === 0) {
            return { status: 'Not Found', mensaje: 'Cliente no encontrado.' };
        }

        // Actualizar el rol del usuario a nivel de base de datos
        const updateResult = await this.db.command({
            updateUser: nicknameUser,
            roles: [{ role: nuevoRol, db: 'CineCampus' }]
        });

        return { status: 'Success', mensaje: 'Rol actualizado correctamente.', data: updateResult };

    } catch (error) {
        // Captura y retorna errores
        let [status, mensaje] = `${error}`.split(": ");
        return { status, mensaje };
    }
}
}