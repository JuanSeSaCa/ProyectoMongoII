import { ObjectId } from "mongodb";
import { connect } from "../../helper/connect.js";

// Creamos una clase llamada Cinema que hereda de la clase connect
export class Cinema extends connect {
  // Creamos una variable estática llamada instance que almacenará la instancia de la clase
  static instance;

  // Constructor de la clase Cinema
  constructor(conexion) {
    // Si la variable instance ya tiene un valor, significa que la clase ya ha sido instanciada
    if (typeof Cinema.instance == "object") {
      // En ese caso, devolvemos la instancia existente
      return Cinema.instance;
    }

    // Llamamos al constructor de la clase padre (connect) y le pasamos la conexión
    super(conexion);

    // Creamos referencias a las colecciones de MongoDB que vamos a utilizar
    this.cinema = this.db.collection("cinema");
    this.peliculas = this.db.collection("peliculas");
    this.salas = this.db.collection("salas");
    this.usuarios = this.db.collection("usuarios");

    // Asignamos la instancia actual a la variable instance
    Cinema.instance = this;
    return this;
  }

  // Método para obtener las entradas para una película y sala específicas
  async getEntradas(idPelicula, idSala, horario) {
    // Buscamos la película en la colección de películas
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    // Buscamos la sala en la colección de salas
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();
    // Buscamos las entradas en la colección de cinema que coincidan con la película, sala y horario
    const entradas = await this.cinema.find({ idPelicula: new ObjectId(idPelicula), idSala: new ObjectId(idSala), horario: horario }).toArray();

    // Si encontramos la película, la sala y las entradas, devolvemos las entradas
    if (pelicula.length > 0 && sala.length > 0 && entradas.length > 0) {
      return entradas;
    } else {
      // De lo contrario, devolvemos un mensaje de error
      return "No se encontraron entradas para la película y sala seleccionadas";
    }
  }

  // Método para obtener los horarios para una película y sala específicas
  async getHorarios(idPelicula, idSala) {
    // Buscamos la película en la colección de películas
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    // Buscamos la sala en la colección de salas
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();
    // Buscamos los horarios en la colección de cinema que coincidan con la película y sala
    const horarios = await this.cinema.find({ idPelicula: new ObjectId(idPelicula), idSala: new ObjectId(idSala) }).toArray();

    // Si encontramos la película, la sala y los horarios, devolvemos los horarios
    if (pelicula.length > 0 && sala.length > 0 && horarios.length > 0) {
      // Devolvemos un array con los horarios encontrados
      return horarios.map(horario => horario.horario);
    } else {
      // De lo contrario, devolvemos un mensaje de error
      return "No se encontraron horarios para la película y sala seleccionadas";
    }
  }

  // Método para obtener la información de una sala específica
  async getSala(idSala) {
    // Buscamos la sala en la colección de salas
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    // Si encontramos la sala, devolvemos la información de la sala
    if (sala.length > 0) {
      return sala[0];
    } else {
      // De lo contrario, devolvemos un mensaje de error
      return "No se encontró la sala seleccionada";
    }
  }

  // Método para obtener la información de una película específica
  async getPelicula(idPelicula) {
    // Buscamos la película en la colección de películas
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();

    // Si encontramos la película, devolv

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////* */
    import { ObjectId } from "mongodb";
import { connect } from "../../helper/connect.js";

export class Cinema extends connect {
  static instance;

  constructor(conexion) {
    if (typeof Cinema.instance == "object") {
      return Cinema.instance;
    }

    super(conexion);

    this.cinema = this.db.collection("cinema");
    this.peliculas = this.db.collection("peliculas");
    this.salas = this.db.collection("salas");
    this.usuarios = this.db.collection("usuarios");
    this.reservas = this.db.collection("reservas");
    this.asientos = this.db.collection("asientos");

    Cinema.instance = this;
    return this;
  }

  // Métodos para obtener información de la cinema
  async getEntradas(idPelicula, idSala, horario) {
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();
    const entradas = await this.cinema.find({ idPelicula: new ObjectId(idPelicula), idSala: new ObjectId(idSala), horario: horario }).toArray();

    if (pelicula.length > 0 && sala.length > 0 && entradas.length > 0) {
      return entradas;
    } else {
      return "No se encontraron entradas para la película y sala seleccionadas";
    }
  }

  async getHorarios(idPelicula, idSala) {
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();
    const horarios = await this.cinema.find({ idPelicula: new ObjectId(idPelicula), idSala: new ObjectId(idSala) }).toArray();

    if (pelicula.length > 0 && sala.length > 0 && horarios.length > 0) {
      return horarios.map(horario => horario.horario);
    } else {
      return "No se encontraron horarios para la película y sala seleccionadas";
    }
  }

  async getSala(idSala) {
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    if (sala.length > 0) {
      return sala[0];
    } else {
      return "No se encontró la sala seleccionada";
    }
  }

  async getPelicula(idPelicula) {
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();

    if (pelicula.length > 0) {
      return pelicula[0];
    } else {
      return "No se encontró la película seleccionada";
    }
  }

  // Métodos CRUD para reserva
  async createReserva(idUsuario, idPelicula, idSala, horario, asiento) {
    const usuario = await this.usuarios.find({ _id: new ObjectId(idUsuario) }).toArray();
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    if (usuario.length > 0 && pelicula.length > 0 && sala.length > 0) {
      const reserva = {
        idUsuario: new ObjectId(idUsuario),
        idPelicula: new ObjectId(idPelicula),
        idSala: new ObjectId(idSala),
        horario: horario,
        asiento: asiento,
      };

      const resultado = await this.reservas.insertOne(reserva);
      return resultado;
    } else {
      return "No se pudo crear la reserva";
    }
  }

  async getReserva(idReserva) {
    const reserva = await this.reservas.find({ _id: new ObjectId(idReserva) }).toArray();

    if (reserva.length > 0) {
      return reserva[0];
    } else {
      return "No se encontró la reserva seleccionada";
    }
  }

  async updateReserva(idReserva, llaveUpdate, cambio) {
    const reserva = await this.reservas.find({ _id: new ObjectId(idReserva) }).toArray();

    if (reserva.length > 0) {
      const resultado = await this.reservas.updateOne({ _id: new ObjectId(idReserva) }, { $set: { [llaveUpdate



//////////////////////
// Importamos la clase ObjectId de MongoDB para manejar los IDs de los documentos
import { ObjectId } from "mongodb";

// Importamos la clase connect de nuestro archivo helper/connect.js para establecer la conexión con la base de datos
import { connect } from "../../helper/connect.js";

// Definimos la clase Cinema que hereda de la clase connect
export class Cinema extends connect {
  // Definimos la variable instance para implementar el patrón de diseño Singleton
  static instance;

  // Constructor de la clase Cinema
  constructor(conexion) {
    // Si la variable instance ya tiene un valor, retornamos ese valor
    if (typeof Cinema.instance == "object") {
      return Cinema.instance;
    }

    // Llamamos al constructor de la clase padre (connect) y le pasamos la conexión
    super(conexion);

    // Definimos las colecciones que vamos a utilizar en nuestra base de datos
    this.cinema = this.db.collection("cinema");
    this.peliculas = this.db.collection("peliculas");
    this.salas = this.db.collection("salas");
    this.usuarios = this.db.collection("usuarios");
    this.reservas = this.db.collection("reservas");
    this.asientos = this.db.collection("asientos");

    // Asignamos el valor de la variable instance a la instancia actual de la clase Cinema
    Cinema.instance = this;
    return this;
  }

  // Método para obtener las entradas para una película y sala específicas
  async getEntradas(idPelicula, idSala, horario) {
    // Consultamos la película y la sala
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    // Validamos que la película y la sala existan
    if (pelicula.length > 0 && sala.length > 0) {
      // Consultamos las entradas para la película y la sala
      const entradas = await this.cinema.find({ idPelicula: new ObjectId(idPelicula), idSala: new ObjectId(idSala), horario: horario }).toArray();
      return entradas;
    } else {
      return "No se encontraron entradas para la película y sala seleccionadas";
    }
  }

  // Método para obtener los horarios para una película y sala específicas
  async getHorarios(idPelicula, idSala) {
    // Consultamos la película y la sala
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    // Validamos que la película y la sala existan
    if (pelicula.length > 0 && sala.length > 0) {
      // Consultamos los horarios para la película y la sala
      const horarios = await this.cinema.find({ idPelicula: new ObjectId(idPelicula), idSala: new ObjectId(idSala) }).toArray();
      return horarios.map(horario => horario.horario);
    } else {
      return "No se encontraron horarios para la película y sala seleccionadas";
    }
  }

  // Método para obtener la información de una sala específica
  async getSala(idSala) {
    // Consultamos la sala
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    // Validamos que la sala exista
    if (sala.length > 0) {
      return sala[0];
    } else {
      return "No se encontró la sala seleccionada";
    }
  }

  // Método para obtener la información de una película específica
  async getPelicula(idPelicula) {
    // Consultamos la película
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();

    // Validamos que la película exista
    if (pelicula.length > 0) {
      return pelicula[0];
    } else {
      return "No se encontró la película seleccionada";
    }
  }

  // Método para crear una reserva
  async createReserva(idUsuario, idPelicula, idSala, horario, asientos) {
    // Consultamos el usuario, la película y la sala
    const usuario = await this.usuarios.find({ _id: new ObjectId(idUsuario)


















    // Importamos la clase ObjectId de MongoDB para manejar los IDs de los documentos
import { ObjectId } from "mongodb";

// Importamos la clase connect de nuestro archivo helper/connect.js para establecer la conexión con la base de datos
import { connect } from "../../helper/connect.js";

// Definimos la clase Cinema que hereda de la clase connect
export class Cinema extends connect {
  // Definimos la variable instance para implementar el patrón de diseño Singleton
  static instance;

  // Constructor de la clase Cinema
  constructor(conexion) {
    // Si la variable instance ya tiene un valor, retornamos ese valor
    if (typeof Cinema.instance == "object") {
      return Cinema.instance;
    }

    // Llamamos al constructor de la clase padre (connect) y le pasamos la conexión
    super(conexion);

    // Definimos las colecciones que vamos a utilizar en nuestra base de datos
    this.cinema = this.db.collection("cinema");
    this.peliculas = this.db.collection("peliculas");
    this.salas = this.db.collection("salas");
    this.usuarios = this.db.collection("usuarios");
    this.reservas = this.db.collection("reservas");
    this.asientos = this.db.collection("asientos");

    // Asignamos el valor de la variable instance a la instancia actual de la clase Cinema
    Cinema.instance = this;
    return this;
  }

  // Método para obtener las entradas para una película y sala específicas
  async getEntradas(idPelicula, idSala, horario) {
    // Consultamos la película y la sala
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    // Validamos que la película y la sala existan
    if (pelicula.length > 0 && sala.length > 0) {
      // Consultamos las entradas para la película y la sala
      const entradas = await this.cinema.find({ idPelicula: new ObjectId(idPelicula), idSala: new ObjectId(idSala), horario: horario }).toArray();
      return entradas;
    } else {
      return "No se encontraron entradas para la película y sala seleccionadas";
    }
  }

  // Método para obtener los horarios para una película y sala específicas
  async getHorarios(idPelicula, idSala) {
    // Consultamos la película y la sala
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    // Validamos que la película y la sala existan
    if (pelicula.length > 0 && sala.length > 0) {
      // Consultamos los horarios para la película y la sala
      const horarios = await this.cinema.find({ idPelicula: new ObjectId(idPelicula), idSala: new ObjectId(idSala) }).toArray();
      return horarios.map(horario => horario.horario);
    } else {
      return "No se encontraron horarios para la película y sala seleccionadas";
    }
  }

  // Método para obtener la información de una sala específica
  async getSala(idSala) {
    // Consultamos la sala
    const sala = await this.salas.find({ _id: new ObjectId(idSala) }).toArray();

    // Validamos que la sala exista
    if (sala.length > 0) {
      return sala[0];
    } else {
      return "No se encontró la sala seleccionada";
    }
  }

  // Método para obtener la información de una película específica
  async getPelicula(idPelicula) {
    // Consultamos la película
    const pelicula = await this.peliculas.find({ _id: new ObjectId(idPelicula) }).toArray();

    // Validamos que la película exista
    if (pelicula.length > 0) {
      return pelicula[0];
    } else {
      return "No se encontró la película seleccionada";
    }
  }

  // Método para crear una reserva para un usuario
  async createReserva(idUsuario, idPelicula, idSala, horario, asientos) {
    // Consultamos el usuario, la película y la sala
    const usuario = await this.usuarios.find({ _id: new ObjectId