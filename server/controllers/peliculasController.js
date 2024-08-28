const Peliculas = require('../model/peliculasModel'); // Importa el modelo de películas

/**
 * * Lista todas las películas.
 */
const getPeliculas = async (req, res) => {
    const peliculasModel = new Peliculas(); // Crea una instancia del modelo Peliculas
    try {
        const peliculas = await peliculasModel.findPeliculas(); // ? Obtiene todas las películas de la base de datos
        res.status(200).json(peliculas); // * Devuelve las películas en formato JSON con un estado 200 (OK)
    } catch (error) {
        //! Manejo de errores: Devuelve un estado 500 (Error del servidor) si hay un problema en la consulta
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * * Lista todas las películas disponibles en cartelera.
 */
const getFilmsAvailable = async (req, res) => {
    const peliculasModel = new Peliculas();
    try {
        const filmsAvailable = await peliculasModel.getAllFilmsAvailable(); // ? Obtiene todas las películas disponibles en cartelera
        res.status(200).json(filmsAvailable); // * Devuelve las películas disponibles en formato JSON con un estado 200 (OK)
    } catch (error) {
        //! Manejo de errores: Devuelve un estado 500 (Error del servidor) si hay un problema en la consulta
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * * Lista todos los detalles de una película en específico.
 * ? Utiliza el ID de la película proporcionado en los parámetros de la solicitud.
 */
const getFilmDetails = async (req, res) => {
    const peliculasModel = new Peliculas();
    const { id } = req.params; // ? Extrae el ID de la película de los parámetros de la solicitud
    try {
        const filmDetail = await peliculasModel.getAllDetailsFilms(id); // ? Obtiene los detalles de la película con el ID especificado
        res.status(200).json(filmDetail); // * Devuelve los detalles de la película en formato JSON con un estado 200 (OK)
    } catch (error) {
        //! Manejo de errores: Devuelve un estado 404 (No encontrado) si no se encuentra la película
        res.status(404).json({ status: 'Not Found', mensaje: error.message });
    }
};

/**
 * * Crea una nueva película.
 */
const createPelicula = async (req, res) => {
    const peliculasModel = new Peliculas();
    try {
        const peliculaData = req.body; // ? Obtiene los datos de la nueva película desde el cuerpo de la solicitud

        // TODO: Validar los datos de la película antes de insertarlos en la base de datos
        const result = await peliculasModel.createPelicula(peliculaData); // * Inserta la película en la base de datos

        res.status(201).json({ message: 'Película creada con éxito', result }); // * Devuelve un mensaje de éxito con un estado 201 (Creado)
    } catch (error) {
        //! Manejo de errores: Devuelve un estado 500 (Error del servidor) si hay un problema al crear la película
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * * Actualiza una película existente.
 */
const updatePelicula = async (req, res) => {
    const peliculasModel = new Peliculas();
    try {
        const { id, ...updateData } = req.body; // ? Extrae el ID y los datos de actualización del cuerpo de la solicitud

        if (!id) {
            //! Manejo de errores: Devuelve un estado 400 (Solicitud incorrecta) si no se proporciona el ID de la película
            return res.status(400).json({ message: 'El ID de la película es requerido' });
        }

        const result = await peliculasModel.updatePelicula(id, updateData); // ? Actualiza la película en la base de datos con el ID especificado

        if (result.modifiedCount === 0) {
            //! Manejo de errores: Devuelve un estado 404 (No encontrado) si no se encuentra la película o no se realizaron cambios
            return res.status(404).json({ message: 'Película no encontrada o no se realizaron cambios' });
        }

        res.status(200).json({ message: 'Película actualizada con éxito' }); // * Devuelve un mensaje de éxito con un estado 200 (OK)
    } catch (error) {
        //! Manejo de errores: Devuelve un estado 500 (Error del servidor) si hay un problema al actualizar la película
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

/**
 * * Elimina una película existente.
 */
const deletePelicula = async (req, res) => {
    const peliculasModel = new Peliculas();
    try {
        const { id } = req.body; // ? Extrae el ID de la película del cuerpo de la solicitud

        if (!id) {
            //! Manejo de errores: Devuelve un estado 400 (Solicitud incorrecta) si no se proporciona el ID de la película
            return res.status(400).json({ message: 'El ID de la película es requerido' });
        }

        const result = await peliculasModel.deletePelicula(id); // ? Elimina la película de la base de datos con el ID especificado

        if (result.deletedCount === 0) {
            //! Manejo de errores: Devuelve un estado 404 (No encontrado) si no se encuentra la película
            return res.status(404).json({ message: 'Película no encontrada' });
        }

        res.status(200).json({ message: 'Película eliminada con éxito' }); // * Devuelve un mensaje de éxito con un estado 200 (OK)
    } catch (error) {
        //! Manejo de errores: Devuelve un estado 500 (Error del servidor) si hay un problema al eliminar la película
        res.status(500).json({ status: 'Error', mensaje: error.message });
    }
};

// Exporta las funciones para que puedan ser utilizadas en otras partes de la aplicación
module.exports = {
    getPeliculas,
    getFilmsAvailable,
    getFilmDetails,
    createPelicula,
    updatePelicula,
    deletePelicula,  
};
