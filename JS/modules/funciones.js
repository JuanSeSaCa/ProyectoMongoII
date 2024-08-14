import { ObjectId } from "mongodb";
import { connect } from "../../helper/db/connect.js";

/**
 * Clase que maneja las funciones y operaciones relacionadas con las funciones de cine.
 */
export class Funciones extends connect {
  static instance;

  /**
   * Constructor de la clase.
   */
  constructor() {
    if (typeof Funciones.instance === "object") {
      return Funciones.instance;
    }
    super();
    // Inicialización de las colecciones
    this.collection = this.db.collection('funciones');
    this.peliculasCollection = this.db.collection('peliculas');
    this.salasCollection = this.db.collection('salas');
    this.asientosCollection = this.db.collection('asientos');
    this.lugarCollection = this.db.collection('lugar');

    Funciones.instance = this;
    return this;
  }

  /**
   * Método para obtener todas las funciones.
   * @returns {Array} - Todas las funciones.
   */
  async findFunciones() {
    return await this.collection.find({}).toArray();
  };

  /**
   * API para verificar disponibilidad de asientos en una función específica.
   * @param {ObjectId} id - ID de la función.
   * @returns {Object} - Estado de disponibilidad de asientos.
   */
  async findAvailableTickets(data) {
    const { id } = data;
    try {
      // Buscar la función por ID
      const funcion = await this.collection.findOne({ _id: new ObjectId(id) });
      if (!funcion) {
        return { status: 'Not Found', mensaje: 'La función ingresada no existe, por favor revíselo nuevamente.' };
      }

      // Buscar la sala en la colección de 'lugar'
      const lugar = await this.lugarCollection.findOne({ _id: new ObjectId(funcion.id_lugar) });
      if (!lugar) {
        return { status: 'Not Found', mensaje: 'La sala especificada no existe, por favor revíselo nuevamente.' };
      }

      // Buscar los asientos en la colección de 'Asiento'
      const asientos = await this.asientosCollection.find({ id_lugar: new ObjectId(funcion.id_lugar) }).toArray();
      if (asientos.length === 0) {
        return { status: 'Not Found', mensaje: 'Los asientos para la sala especificada no existen.' };
      }

      // Obtener los asientos ocupados
      const asientosOcupados = funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento);

      // Calcular los asientos disponibles
      const asientosDisponibles = asientos
        .flatMap(asiento => asiento.codigo)
        .filter(asiento => !asientosOcupados.includes(asiento.codigo_asiento))
        .map(asiento => asiento.codigo_asiento);

      return {
        status: 'Success',
        mensaje: 'Consulta de disponibilidad realizada con éxito.',
        datos: {
          sala: lugar.nombre,
          asientosDisponibles
        }
      };

    } catch (error) {
      return { status: 'Error', mensaje: error.message || 'Error inesperado' };
    }
  }

  /**
   * API para reservar asientos en una función específica.
   * @param {ObjectId} id - ID de la función.
   * @param {Array} asientosSeleccionados - Array de códigos de asientos a reservar.
   * @returns {Object} - Estado de la operación de reserva.
   */
  async reservarAsientos(data) {
    const { id, asientosSeleccionados } = data;
    try {
      const funcion = await this.collection.findOne({ _id: new ObjectId(id) });
      if (!funcion) {
        return { status: 'Not Found', mensaje: 'La función ingresada no existe, por favor revíselo nuevamente.' };
      }

      const lugar = await this.lugarCollection.findOne({ _id: new ObjectId(funcion.id_lugar) });
      if (!lugar) {
        return { status: 'Not Found', mensaje: 'La sala especificada no existe, por favor revíselo nuevamente.' };
      }

      const asientos = await this.asientosCollection.find({ id_lugar: new ObjectId(funcion.id_lugar) }).toArray();
      if (asientos.length === 0) {
        return { status: 'Not Found', mensaje: 'No se encontraron los asientos para la sala especificada.' };
      }


      // Aplanar la lista de asientos en un solo array
      const todosAsientos = asientos.flatMap(asiento => asiento.codigo);

      // Obtener los códigos de asientos ocupados de la función
      const asientosOcupados = new Set(funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento));

      // Verificar disponibilidad de los asientos seleccionados
      for (const codigo of asientosSeleccionados) {
        const asiento = todosAsientos.find(a => a.codigo_asiento === codigo);
        if (!asiento) {
          return { status: 'Error', mensaje: `El asiento ${codigo} no existe en la sala.` };
        }
        if (asientosOcupados.has(codigo)) {
          return { status: 'Error', mensaje: `El asiento ${codigo} ya está reservado.` };
        }
      }

      // Reservar los asientos
      const asientosAReservar = asientosSeleccionados.map(codigo => ({ codigo_asiento: codigo, estado: 'reservado' }));
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { Asientos_Ocupados: { $each: asientosAReservar } } }
      );

      // Formatear la respuesta
      return {
        status: 'Success',
        mensaje: 'Asientos reservados con éxito.'
      };

    } catch (error) {
      // Captura y retorna errores
      return { status: 'Error', mensaje: error.message || 'Error inesperado' };
    }
  }

  /**
   * * API para Cancelar Reserva de Asientos:
   * Permite la cancelación de una reserva de asientos ya realizada.
   * @param {ObjectId} id - El ID de la función en la que se desea cancelar la reserva.
   * @param {Array} asientosCancelar - Una lista de códigos de asientos a cancelar.
   * @returns {Object} - Un objeto con el estado y el mensaje de la operación.
   */
  async cancelarReserva(data) {
    const { id, asientosCancelar } = data;

    try {
      // Convertir el ID a ObjectId
      const objectId = new ObjectId(id);

      // Buscar la función por ID
      const funcion = await this.collection.findOne({ _id: objectId });
      if (!funcion) {
        return { status: 'Not Found', mensaje: 'La función ingresada no existe, por favor revíselo nuevamente.' };
      }

      // Verificar los asientos ocupados
      const asientosOcupados = new Set(funcion.Asientos_Ocupados.map(asiento => asiento.codigo_asiento));

      // Verificar que los asientos a cancelar estén ocupados
      for (const codigo of asientosCancelar) {
        if (!asientosOcupados.has(codigo)) {
          return { status: 'Error', mensaje: `El asiento ${codigo} no está reservado para esta función.` };
        }
      }

      // Cancelar los asientos utilizando $pull
      const result = await this.collection.updateOne(
        { _id: objectId },
        { $pull: { Asientos_Ocupados: { codigo_asiento: { $in: asientosCancelar } } } }
      );

      if (result.modifiedCount === 0) {
        return { status: 'Error', mensaje: 'No se pudo cancelar la reserva de asientos.' };
      }

      // Formatear la respuesta
      return {
        status: 'Success',
        mensaje: 'Reserva de asientos cancelada con éxito.'
      };

    } catch (error) {
      // Captura y retorna errores
      return { status: 'Error', mensaje: error.message || 'Error inesperado' };
    }
  }

}    