const Connect = require("../index.js"); // * Importa la clase base Connect que maneja la conexión a la base de datos
const { ObjectId } = require("mongodb"); // * Importa ObjectId desde el paquete mongodb para manejar identificadores de documentos
const { validarEntradaBoleto, calcularPrecioTotal } = require("../dto/boletosDto.js"); // * Importa funciones de validación y cálculo de DTOs relacionados con boletos

/**
 * * Clase `Boletas`
 * 
 * * Maneja las operaciones relacionadas con las boletas en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
class Boletas extends Connect {
    static instance; // * Propiedad estática para almacenar la instancia única de la clase

    constructor() {
        if (typeof Boletas.instance === "object") { // * Verifica si ya existe una instancia de la clase
            return Boletas.instance; // * Retorna la instancia existente para implementar el patrón Singleton
        }
        super(); // * Llama al constructor de la clase base para establecer la conexión con la base de datos
        this.collection = this.db.collection('boletas'); // * Establece la colección 'boletas' de la base de datos
        Boletas.instance = this; // * Guarda la instancia actual como única
        return this; // * Retorna la instancia de la clase
    }

    /**
     * * Recupera todas las boletas disponibles en la base de datos.
     * 
     * @returns {Promise<Array<Object>>} Un arreglo de objetos que representan las boletas.
     */
    async findBoletas() {
        try {
            return await this.collection.find({}).toArray(); // * Recupera todas las boletas y las convierte a un arreglo
        } catch (error) { // ! Maneja errores que puedan ocurrir durante la recuperación
            console.error(`Error al recuperar boletas: ${error.message}`); // * Imprime un mensaje de error en la consola
            throw new Error('No se pudieron recuperar las boletas.'); // ! Lanza un error si ocurre un problema
        }
    }

    /**
     * * Crea un nuevo boleto en la base de datos.
     * 
     * @param {Object} params - Parámetros necesarios para crear el boleto.
     * @param {ObjectId} params._id_cliente - ID del cliente.
     * @param {ObjectId} params.id_pelicula - ID de la película.
     * @param {ObjectId} params.id_sala - ID de la sala.
     * @param {Date} params.Date_compra - Fecha de compra.
     * @param {string} params.asiento_reservado - Código del asiento reservado.
     * @returns {Promise<Object>} El boleto creado.
     */
    async crearBoleto(params) {
        try {
            const salasCollection = this.db.collection('salas'); // * Obtiene la colección 'salas' de la base de datos
            const funcionesCollection = this.db.collection('funciones'); // * Obtiene la colección 'funciones' de la base de datos

            // 1. * Obtener datos de sala y función
            const sala = await salasCollection.findOne({ _id: new ObjectId(params.id_sala) }); // * Busca la sala correspondiente por ID
            const funcion = await funcionesCollection.findOne({ 
                id_pelicula: new ObjectId(params.id_pelicula), 
                id_sala: new ObjectId(params.id_sala) 
            }); // * Busca la función correspondiente por IDs de película y sala

            // 2. * Validar entrada
            const { error, asiento } = validarEntradaBoleto(params, sala, funcion); // * Valida los datos de la entrada del boleto
            if (error) { // ! Verifica si hubo un error en la validación
                throw new Error(error); // ! Lanza un error si la validación falla
            }

            // 3. * Calcular el precio del boleto
            const precioTotal = calcularPrecioTotal(sala.precio_base, asiento.tippo_asiento); // * Calcula el precio total del boleto basándose en el tipo de asiento

            // 4. * Crear el boleto
            const nuevoBoleto = {
                _id_cliente: new ObjectId(params._id_cliente), // * Asigna el ID del cliente
                id_pelicula: new ObjectId(params.id_pelicula), // * Asigna el ID de la película
                id_sala: new ObjectId(params.id_sala), // * Asigna el ID de la sala
                Date_compra: params.Date_compra, // * Asigna la fecha de compra
                asiento_reservado: params.asiento_reservado, // * Asigna el asiento reservado
                precio_total: precioTotal // * Asigna el precio total calculado
            };

            await this.collection.insertOne(nuevoBoleto); // * Inserta el nuevo boleto en la colección 'boletas'

            // 5. * Actualizar la disponibilidad del asiento
            await salasCollection.updateOne(
                { _id: new ObjectId(params.id_sala), "asientos.codigo_asiento": params.asiento_reservado },
                { $set: { "asientos.$.estado": "reserved" } } // * Marca el asiento como reservado en la base de datos
            );

            return nuevoBoleto; // * Retorna el boleto creado
        } catch (error) { // ! Maneja errores que puedan ocurrir durante la creación del boleto
            console.error(`Error al crear boleto: ${error.message}`); // * Imprime un mensaje de error en la consola
            throw new Error('No se pudo crear el boleto.'); // ! Lanza un error si ocurre un problema
        }
    }
}

module.exports = Boletas; // * Exporta la clase Boletas para ser utilizada en otras partes de la aplicación
