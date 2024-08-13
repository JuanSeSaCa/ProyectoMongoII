import { ObjectId } from "mongodb";
import { connect } from "../../helper/db/connect.js";

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

  }
  }