const Connect = require("../index.cjs"); // * Importa la clase base Connect para manejar la conexión a la base de datos
const { ObjectId } = require("mongodb"); // * Importa ObjectId desde el paquete mongodb para manejar identificadores de documentos
const {
    asegurarFuncionExiste,
    asegurarLugarExiste,
    asegurarAsientosDisponibles,
    asegurarAsientosParaReservar,
    asegurarAsientosParaCancelar,
} = require("../dto/funcionesDto.cjs"); // * Importa funciones de validación desde DTOs relacionados con funciones

/**
 * * Clase `Funciones`
 * 
 * * Maneja las operaciones relacionadas con las funciones en la base de datos MongoDB.
 * 
 * @class
 * @extends Connect
 */
class Funciones extends Connect {
    static instance; // * Propiedad estática para almacenar la instancia única de la clase

    constructor() {
        if (typeof Funciones.instance === "object") { // * Verifica si ya existe una instancia de la clase
            return Funciones.instance; // * Retorna la instancia existente para implementar el patrón Singleton
        }
        super(); // * Llama al constructor de la clase base para establecer la conexión con la base de datos
        this.collection = this.db.collection('funciones'); // * Establece la colección 'funciones' de la base de datos
        this.asientosCollection = this.db.collection('asientos'); // * Establece la colección 'asientos' de la base de datos
        this.lugarCollection = this.db.collection('salas'); // * Establece la colección 'salas' de la base de datos
        Funciones.instance = this; // * Guarda la instancia actual como única
        return this; // * Retorna la instancia de la clase
    }

    /**
     * * Recupera todas las funciones disponibles en la base de datos.
     * 
     * @returns {Promise<Array<Object>>} Un arreglo de objetos que representan las funciones.
     */
    async findFunciones() {
        try {
            return await this.collection.find({}).toArray(); // * Recupera todas las funciones y las convierte a un arreglo
        } catch (error) { // ! Maneja errores que puedan ocurrir durante la recuperación
            console.error(`Error al recuperar funciones: ${error.message}`); // * Imprime un mensaje de error en la consola
            throw new Error('No se pudieron recuperar las funciones.'); // ! Lanza un error si ocurre un problema
        }
    }

    /**
     * * Consulta la disponibilidad de boletos para una función específica.
     * 
     * @param {Object} params - Parámetros necesarios para la consulta de disponibilidad.
     * @param {string} params.id - ID de la función.
     * @returns {Promise<Object>} Un objeto con el estado de la consulta y los asientos disponibles.
     */
    async findAvailableBoletas({ id }) {
        try {
            const funcion = await this.collection.findOne({ _id: new ObjectId(id) }); // * Recupera la función por ID
            asegurarFuncionExiste(funcion); // * Verifica que la función exista

            const lugar = await this.lugarCollection.findOne({ _id: new ObjectId(funcion.id_lugar) }); // * Recupera la sala por ID de la función
            asegurarLugarExiste(lugar); // * Verifica que la sala exista

            const asientos = await this.asientosCollection.find({ id_lugar: new ObjectId(funcion.id_lugar) }).toArray(); // * Recupera los asientos de la sala
            asegurarAsientosDisponibles(asientos); // * Verifica que los asientos estén disponibles

            const asientosOcupados = new Set(funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento)); // * Crea un conjunto de asientos ocupados
            const asientosDisponibles = asientos.flatMap(asiento => asiento.codigo) // * Mapea los asientos disponibles
                .filter(asiento => !asientosOcupados.has(asiento.codigo_asiento)) // * Filtra los asientos no ocupados
                .map(asiento => asiento.codigo_asiento); // * Mapea los códigos de los asientos disponibles

            return {
                status: 'Success', // * Retorna éxito si la consulta se realiza correctamente
                mensaje: 'Consulta de disponibilidad realizada con éxito.',
                datos: {
                    sala: lugar.nombre, // * Nombre de la sala
                    asientosDisponibles: asientosDisponibles // * Lista de asientos disponibles
                }
            };

        } catch (error) { // ! Maneja errores que puedan ocurrir durante la consulta de disponibilidad
            console.error(`Error al verificar disponibilidad de boletos: ${error.message}`); // * Imprime un mensaje de error en la consola
            throw new Error('No se pudo verificar la disponibilidad de boletos.'); // ! Lanza un error si ocurre un problema
        }
    }

    /**
     * * Reserva asientos para una función específica.
     * 
     * @param {Object} params - Parámetros necesarios para la reserva de asientos.
     * @param {string} params.id - ID de la función.
     * @param {Array<string>} params.asientosSeleccionados - Lista de códigos de asientos seleccionados para reservar.
     * @returns {Promise<Object>} Un objeto con el estado de la reserva y un mensaje.
     */
    async reservarAsientos({ id, asientosSeleccionados }) {
        try {
            const funcion = await this.collection.findOne({ _id: new ObjectId(id) }); // * Recupera la función por ID
            asegurarFuncionExiste(funcion); // * Verifica que la función exista

            const lugar = await this.lugarCollection.findOne({ _id: new ObjectId(funcion.id_lugar) }); // * Recupera la sala por ID de la función
            asegurarLugarExiste(lugar); // * Verifica que la sala exista

            const asientos = await this.asientosCollection.find({ id_lugar: new ObjectId(funcion.id_lugar) }).toArray(); // * Recupera los asientos de la sala
            asegurarAsientosDisponibles(asientos); // * Verifica que los asientos estén disponibles

            const todosAsientos = asientos.flatMap(asiento => asiento.codigo); // * Obtiene todos los asientos de la sala
            const asientosOcupados = new Set(funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento)); // * Crea un conjunto de asientos ocupados

            asegurarAsientosParaReservar(todosAsientos, asientosOcupados, asientosSeleccionados); // * Verifica que los asientos seleccionados se puedan reservar

            const asientosAReservar = asientosSeleccionados.map(codigo => ({ codigo_asiento: codigo, estado: 'reservado' })); // * Crea un arreglo con los asientos a reservar
            await this.collection.updateOne(
                { _id: new ObjectId(id) }, // * Filtra por ID de la función
                { $push: { Asientos_Ocupados: { $each: asientosAReservar } } } // * Agrega los asientos reservados a la lista de asientos ocupados
            );

            return {
                status: 'Success', // * Retorna éxito si la reserva se realiza correctamente
                mensaje: 'Asientos reservados con éxito.'
            };

        } catch (error) { // ! Maneja errores que puedan ocurrir durante la reserva
            console.error(`Error al reservar asientos: ${error.message}`); // * Imprime un mensaje de error en la consola
            throw new Error('No se pudieron reservar los asientos.'); // ! Lanza un error si ocurre un problema
        }
    }

    /**
     * * Cancela la reserva de asientos para una función específica.
     * 
     * @param {Object} params - Parámetros necesarios para cancelar la reserva de asientos.
     * @param {string} params.id - ID de la función.
     * @param {Array<string>} params.asientosCancelar - Lista de códigos de asientos a cancelar.
     * @returns {Promise<Object>} Un objeto con el estado de la cancelación y un mensaje.
     */
    async cancelarReserva({ id, asientosCancelar }) {
        try {
            const objectId = new ObjectId(id); // * Convierte el ID a ObjectId
            const funcion = await this.collection.findOne({ _id: objectId }); // * Recupera la función por ID
            asegurarFuncionExiste(funcion); // * Verifica que la función exista

            const asientosOcupados = new Set(funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento)); // * Crea un conjunto de asientos ocupados
            asegurarAsientosParaCancelar(asientosOcupados, asientosCancelar); // * Verifica que los asientos a cancelar sean válidos

            const result = await this.collection.updateOne(
                { _id: objectId }, // * Filtra por ID de la función
                { $pull: { Asientos_Ocupados: { codigo_asiento: { $in: asientosCancelar } } } } // * Elimina los asientos de la lista de asientos ocupados
            );

            if (result.modifiedCount === 0) { // ! Verifica si la actualización afectó algún documento
                throw new Error('No se pudo cancelar la reserva de asientos.'); // ! Lanza un error si no se canceló ninguna reserva
            }

            return {
                status: 'Success', // * Retorna éxito si la cancelación se realiza correctamente
                mensaje: 'Reserva de asientos cancelada con éxito.'
            };

        } catch (error) { // ! Maneja errores que puedan ocurrir durante la cancelación
            console.error(`Error al cancelar la reserva de asientos: ${error.message}`); // * Imprime un mensaje de error en la consola
            throw new Error('No se pudo cancelar la reserva de asientos.'); // ! Lanza un error si ocurre un problema
        }
    }
}

module.exports = Funciones; // * Exporta la clase Funciones para ser utilizada en otras partes de la aplicación
