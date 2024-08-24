const Connect = require("../index.js"); // * Importa la clase base 'Connect' desde el archivo '../index.js'
const { ObjectId } = require("mongodb"); // * Importa 'ObjectId' de la librería 'mongodb'

/**
 * Clase `Funciones`
 * 
 * Maneja las operaciones relacionadas con las funciones y la disponibilidad de asientos en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
class Funciones extends Connect {
    static instance; // * Propiedad estática para implementar el patrón Singleton

    constructor() {
        if (typeof Funciones.instance === "object") { // ? Verifica si ya existe una instancia de la clase 'Funciones'
            return Funciones.instance; // /! Si ya existe una instancia, la retorna y evita crear una nueva
        }
        super(); // * Llama al constructor de la clase base 'Connect'
        this.collection = this.db.collection('funciones'); // * Asigna la colección 'funciones' de la base de datos a la propiedad 'collection'
        this.asientosCollection = this.db.collection('asientos'); // * Asigna la colección 'asientos' de la base de datos a la propiedad 'asientosCollection'
        this.lugarCollection = this.db.collection('salas'); // * Asigna la colección 'salas' de la base de datos a la propiedad 'lugarCollection'
        Funciones.instance = this; // * Guarda la instancia actual en la propiedad estática 'instance'
        return this; // * Retorna la instancia de la clase 'Funciones'
    }

    /**
     * Recupera todas las funciones de la colección 'funciones'.
     * 
     * @returns {Promise<Array<Object>>} Arreglo de documentos de funciones.
     */
    async findFunciones() {
        try {
            return await this.collection.find({}).toArray(); // * Realiza una búsqueda de todas las funciones y las retorna como un array
        } catch (error) {
            console.error(`Error al recuperar funciones: ${error.message}`); // /! Loguea un mensaje de error si falla la búsqueda
            throw new Error('No se pudieron recuperar las funciones.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Verifica la disponibilidad de boletos para una función específica.
     * 
     * @param {Object} param0 - Objeto con el ID de la función.
     * @returns {Object} Objeto con el estado, mensaje y los datos de la disponibilidad de asientos.
     */
    async findAvailableBoletas({ id }) {
        try {
            const funcion = await this.collection.findOne({ _id: new ObjectId(id) }); // * Busca la función por ID

            if (!funcion) { // ? Verifica si la función existe
                throw new Error('La función ingresada no existe, por favor revíselo nuevamente.'); // /! Lanza un error si la función no se encuentra
            }

            const lugar = await this.lugarCollection.findOne({ _id: new ObjectId(funcion.id_lugar) }); // * Busca la sala de la función por su ID
            if (!lugar) { // ? Verifica si la sala existe
                throw new Error('La sala especificada no existe, por favor revíselo nuevamente.'); // /! Lanza un error si la sala no se encuentra
            }

            const asientos = await this.asientosCollection.find({ id_lugar: new ObjectId(funcion.id_lugar) }).toArray(); // * Busca los asientos por ID de la sala
            if (asientos.length === 0) { // ? Verifica si existen asientos en la sala
                throw new Error('Los asientos para la sala especificada no existen.'); // -/! Lanza un error si no se encuentran asientos
            }

            const asientosOcupados = funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento); // * Extrae los códigos de los asientos ocupados
            const asientosDisponibles = asientos.flatMap(asiento => asiento.codigo) // * Extrae los códigos de los asientos disponibles
                .filter(asiento => !asientosOcupados.includes(asiento.codigo_asiento)) // * Filtra los asientos disponibles excluyendo los ocupados
                .map(asiento => asiento.codigo_asiento); // * Mapea para obtener solo los códigos de los asientos disponibles

            return {
                status: 'Success',
                mensaje: 'Consulta de disponibilidad realizada con éxito.', // * Retorna éxito si la consulta de disponibilidad se realizó correctamente
                datos: {
                    sala: lugar.nombre, // * Nombre de la sala
                    asientosDisponibles: asientosDisponibles // * Lista de asientos disponibles
                }
            };

        } catch (error) {
            console.error(`Error al verificar disponibilidad de boletos: ${error.message}`); // /! Loguea un mensaje de error si falla la consulta
            throw new Error('No se pudo verificar la disponibilidad de boletos.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Reserva los asientos seleccionados para una función específica.
     * 
     * @param {Object} param0 - Objeto con el ID de la función y los asientos seleccionados.
     * @returns {Object} Objeto con el estado y el mensaje del resultado de la reserva.
     */
    async reservarAsientos({ id, asientosSeleccionados }) {
        try {
            const funcion = await this.collection.findOne({ _id: new ObjectId(id) }); // * Busca la función por ID
            if (!funcion) { // ? Verifica si la función existe
                throw new Error('La función ingresada no existe, por favor revíselo nuevamente.'); // /! Lanza un error si la función no se encuentra
            }

            const lugar = await this.lugarCollection.findOne({ _id: new ObjectId(funcion.id_lugar) }); // * Busca la sala de la función por su ID
            if (!lugar) { // ? Verifica si la sala existe
                throw new Error('La sala especificada no existe, por favor revíselo nuevamente.'); // /! Lanza un error si la sala no se encuentra
            }

            const asientos = await this.asientosCollection.find({ id_lugar: new ObjectId(funcion.id_lugar) }).toArray(); // * Busca los asientos por ID de la sala
            if (asientos.length === 0) { // ? Verifica si existen asientos en la sala
                throw new Error('No se encontraron los asientos para la sala especificada.'); // /! Lanza un error si no se encuentran asientos
            }

            const todosAsientos = asientos.flatMap(asiento => asiento.codigo); // * Extrae todos los códigos de los asientos disponibles
            const asientosOcupados = new Set(funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento)); // * Crea un Set con los códigos de los asientos ocupados

            for (const codigo of asientosSeleccionados) { // * Itera sobre los asientos seleccionados para la reserva
                const asiento = todosAsientos.find(a => a.codigo_asiento === codigo); // * Busca el asiento por código
                if (!asiento) { // ? Verifica si el asiento existe en la sala
                    throw new Error(`El asiento ${codigo} no existe en la sala.`); // /! Lanza un error si el asiento no se encuentra
                }
                if (asientosOcupados.has(codigo)) { // ? Verifica si el asiento ya está ocupado
                    throw new Error(`El asiento ${codigo} ya está reservado.`); // /! Lanza un error si el asiento ya está reservado
                }
            }

            const asientosAReservar = asientosSeleccionados.map(codigo => ({ codigo_asiento: codigo, estado: 'reservado' })); // * Crea un array con los asientos a reservar
            await this.collection.updateOne(
                { _id: new ObjectId(id) },
                { $push: { Asientos_Ocupados: { $each: asientosAReservar } } } // * Actualiza la función agregando los asientos reservados
            );

            return {
                status: 'Success',
                mensaje: 'Asientos reservados con éxito.' // * Retorna éxito si la reserva de asientos se realizó correctamente
            };

        } catch (error) {
            console.error(`Error al reservar asientos: ${error.message}`); // /! Loguea un mensaje de error si falla la reserva
            throw new Error('No se pudieron reservar los asientos.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }

    /**
     * Cancela la reserva de los asientos seleccionados para una función específica.
     * 
     * @param {Object} param0 - Objeto con el ID de la función y los asientos a cancelar.
     * @returns {Object} Objeto con el estado y el mensaje del resultado de la cancelación.
     */
    async cancelarReserva({ id, asientosCancelar }) {
        try {
            const objectId = new ObjectId(id); // * Crea un ObjectId a partir del ID proporcionado
            const funcion = await this.collection.findOne({ _id: objectId }); // * Busca la función por ID
            if (!funcion) { // ? Verifica si la función existe
                throw new Error('La función ingresada no existe, por favor revíselo nuevamente.'); // /! Lanza un error si la función no se encuentra
            }

            const asientosOcupados = new Set(funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento)); // * Crea un Set con los códigos de los asientos ocupados

            for (const codigo of asientosCancelar) { // * Itera sobre los asientos seleccionados para cancelar
                if (!asientosOcupados.has(codigo)) { // ? Verifica si el asiento está reservado
                    throw new Error(`El asiento ${codigo} no está reservado para esta función.`); // /! Lanza un error si el asiento no está reservado
                }
            }

            const result = await this.collection.updateOne(
                { _id: objectId },
                { $pull: { Asientos_Ocupados: { codigo_asiento: { $in: asientosCancelar } } } } // * Actualiza la función eliminando los asientos cancelados
            );

            if (result.modifiedCount === 0) { // ? Verifica si se modificó la colección
                throw new Error('No se pudo cancelar la reserva de asientos.'); // /! Lanza un error si no se pudo cancelar la reserva
            }

            return {
                status: 'Success',
                mensaje: 'Reserva de asientos cancelada con éxito.' // * Retorna éxito si la cancelación de la reserva se realizó correctamente
            };

        } catch (error) {
            console.error(`Error al cancelar la reserva de asientos: ${error.message}`); // /! Loguea un mensaje de error si falla la cancelación
            throw new Error('No se pudo cancelar la reserva de asientos.'); // /! Lanza un nuevo error si ocurre una excepción
        }
    }
}

module.exports = Funciones; // * Exporta la clase 'Funciones' para su uso en otros módulos
