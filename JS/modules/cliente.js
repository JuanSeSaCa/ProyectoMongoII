// Importa la clase 'connect' desde el archivo de conexión de la base de datos.
// Esto se usa como base para la conexión a la base de datos.
import {connect} from "../../db/connection.js"

// Define la clase 'cliente' que extiende de 'connect'.
// Esto significa que 'cliente' hereda las funcionalidades de la clase 'connect'.
export class cliente extends connect {
    // Declara una propiedad estática 'instance' para implementar el patrón Singleton.
    static instance;

    // El constructor se encarga de inicializar la instancia de 'cliente'.
    constructor(){
        // Si ya existe una instancia de 'cliente', la devuelve en lugar de crear una nueva.
        if(typeof cliente.instance === "object"){
            return cliente.instance;
        }
        // Llama al constructor de la clase padre (connect) para establecer la conexión.
        super();
        // Asigna la instancia actual a 'cliente.instance'.
        cliente.instance = this;
    }

    /**
     *  @function createClientAndUser()
     * Crea un nuevo cliente y usuario en la base de datos.
     *
     * @param {Object} data - Datos del cliente y usuario a crear.
     * @param {string} data._id - Identificador único del cliente (opcional).
     * @param {boolean} data.vip - Indica si el cliente es VIP.
     * @param {string} data.nombre - Nombre del cliente.
     * @param {string} data.nick - Apodo del cliente (también se usa para el nombre de usuario).
     * @param {string} data.email - Correo electrónico del cliente.
     * @param {string} data.cedula - Cédula del cliente (también se usa como contraseña del usuario).
     * @param {string} data.telefono - Número de teléfono del cliente.
     * @param {string} data.rol - Rol del usuario en la base de datos.
     * 
     * @returns {Promise<Object>} Un objeto con el mensaje y los detalles de la operación. 
     * @returns {string} return.mensaje - Mensaje que indica el resultado de la operación.
     * @returns {Object} return.datos - Detalles de la inserción en la colección "cliente".
     * @returns {Object} return.usuario - Detalles del usuario creado en la base de datos.
     */
    async createClientAndUser(data){
        try{
            // Reconecta a la base de datos para asegurar que la conexión esté activa.
            await this.reconnect();

            // Selecciona la colección "cliente" en la base de datos.
            let collection = this.db.collection("cliente");

            // Desestructura el objeto 'data' para obtener los campos necesarios.
            let {_id, nombre, nick: apodo, email:correo, cedula: codigo, telefono, rol} = data;

            // Verifica si ya existe un cliente con el mismo apodo, cédula o correo.
            let condicion = await collection.find({
                $or:[
                    {nick: apodo},
                    {cedula: codigo},
                    {email: correo}
                ]
            }).toArray();

            // Si ya existe, retorna un mensaje indicando que el usuario ya existe.
            if(condicion.length) return {mensaje: "El usuario ya existe", user: condicion};

            // Inserta los datos del nuevo cliente en la colección "cliente".
            const res = await collection.insertOne({
                _id, nombre, nick: apodo, email:correo, cedula: codigo, telefono, rol
            });

            // Crea un nuevo usuario en la base de datos MongoDB con el apodo y la cédula como contraseña.
            const usuario = await this.db.command({
                createUser: apodo,
                pwd: `${codigo}`,
                roles: [
                    {role: rol, db: process.env.MONGO_DB}
                ]
            });

            // Cierra la conexión a la base de datos.
            await this.close();

            // Retorna un mensaje indicando que el usuario fue creado exitosamente.
            return {mensaje: "El usuario fue creado", datos: res, usuario: usuario};
        } catch(error){
            // Si ocurre un error, lo imprime en la consola.
            console.error("Error al crear el usuario:", error);
        }
    }

    /**
     * @function getAllUser()
     * Obtiene una lista de todos los usuarios con detalles extendidos, 
     * incluyendo el rol basado en si el usuario es VIP.
     *
     * @returns {Promise<Object>} Un objeto que contiene el mensaje y la lista de usuarios.
     * @returns {string} return.mensaje - Mensaje que indica el resultado de la operación.
     * @returns {Object[]} return.usuarios - Array de objetos que representan a los usuarios con detalles extendidos.
     */
    async getAllUser() {
        try {
            // Reconecta a la base de datos para asegurar que la conexión esté activa.
            await this.reconnect();

            // Selecciona la colección "cliente" en la base de datos.
            let collection = this.db.collection("cliente");

            // Realiza una agregación para combinar datos de "cliente" con la colección "tarjeta".
            let detalles = await collection.aggregate([
                {
                    $lookup: {
                        from: 'tarjeta', // Colección "tarjeta".
                        localField: '_id', // Campo local que se usa para combinar.
                        foreignField: 'idCliente', // Campo en "tarjeta" que se usa para combinar.
                        as: 'estadoTarjeta', // Nombre del nuevo campo con los datos combinados.
                    }
                },
                {
                    // Proyecta (selecciona) los campos que se desean incluir en el resultado.
                    $project: {
                        vip: 1,
                        genero: 1,
                        nombre: 1,
                        nick: 1,
                        email: 1,
                        cedula: 1,
                        telefono: 1,
                        rol: 1,
                        estadoTarjeta: {
                            estado: 1, // Solo incluye el campo "estado" dentro de "estadoTarjeta".
                        },
                    }
                }
            ]).toArray();

            // Cierra la conexión a la base de datos.
            await this.close();

            // Retorna un mensaje y la lista de usuarios obtenida.
            return { mensaje: "Usuarios obtenidos", usuarios: detalles }; 
        } catch (error) {
            // Si ocurre un error, lo imprime en la consola y retorna un mensaje de error.
            console.error("Error al obtener los usuarios:", error);
            return { mensaje: "Error al obtener los usuarios", error: error.message };
        }
    }

    /**
     * @function UpdateRolOfUser()
     * Actualiza los roles de un usuario en la base de datos MongoDB.
     * 
     * @param {string} user - El nombre del usuario cuyo rol se desea actualizar. 
     * @param {Array<{role: string, db: string}>} data - Un array de objetos que representan los nuevos roles que se desean asignar al usuario.
     * 
     * @returns {Promise<Object>} Un objeto que contiene el mensaje de éxito o de error y los datos del resultado.
     */
    async UpdateRolOfUser(user, data){
        try{
            // Reconecta a la base de datos para asegurar que la conexión esté activa.
            await this.reconnect();

            // Obtiene la información del usuario de MongoDB.
            const userInfo = await this.db.command({ usersInfo: user });

            // Si el usuario no existe, retorna un mensaje indicando que no existe.
            if (userInfo.users.length == 0) {
                console.log("El usuario no existe.");
                this.close();
                return { mensaje: "El usuario no existe" };
            }

            // Obtiene los roles actuales del usuario.
            const currentRoles = userInfo.users[0].roles;

            // Si el usuario tiene roles actuales, los revoca.
            if (currentRoles.length > 0) {
                await this.db.command({
                    revokeRolesFromUser: user,
                    roles: currentRoles.map(role => ({ role: role.role, db: process.env.MONGO_DB }))
                });
            }

            // Asigna los nuevos roles proporcionados en 'data' al usuario.
            const usuario = await this.db.command({
                grantRolesToUser: user,
                roles: data 
            });

            // Cierra la conexión a la base de datos.
            await this.close();

            // Retorna un mensaje indicando que el rol del usuario fue actualizado exitosamente.
            return {mensaje: "El rol del usuario fue actualizado", datos: usuario};
        } catch(error){
            // Si ocurre un error, lo imprime en la consola.
            console.error("Error al actualizar el rol del usuario:", error);
        }
    }

    /**
     *  * @function getAllUserWithFilter()
     * Obtiene los detalles de todos los usuarios filtrados por rol.
     * 
     * @param {string} filter - El rol por el cual filtrar los usuarios.
     * 
     * @returns {Promise<Object>} Un objeto que contiene el mensaje de éxito y los detalles de los usuarios filtrados.
     */
    async getAllUserWithFilter(filter) {
        try {
            // Reconecta a la base de datos para asegurar que la conexión esté activa.
            await this.reconnect();

            // Selecciona la colección "cliente" en la base de datos.
            let collection = this.db.collection("cliente");

            // Realiza una agregación similar a 'getAllUser' pero solo incluye usuarios con el rol filtrado.
            let detalles = await collection
}  } } 