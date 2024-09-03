// * Importaciones principales de React y otros módulos
import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; // * Hooks de React Router para obtener parámetros de la URL y navegar
import axios from 'axios'; // * Biblioteca para hacer solicitudes HTTP
import './style/moviesInfo.css'; // * Estilos personalizados
import 'bootstrap-icons/font/bootstrap-icons.css'; // * Iconos de Bootstrap
import 'boxicons/css/boxicons.min.css'; // * Iconos de Boxicons

// * Componente HeaderBack que muestra el encabezado con un botón de retroceso
const HeaderBack = ({ header, onBack }) => {
  return (
    <div className="header__back">
      {/* ! Botón de retroceso */}
      <i onClick={onBack} className="bx bx-chevron-left"></i>
      <h3 style={{ color: '#FFFF' }}>{header}</h3>
      <i className="bi bi-three-dots-vertical"></i>
    </div>
  );
};

// * Componente principal MoviesInfo que muestra información de una película específica
const MoviesInfo = () => {
  const { id } = useParams(); // ? Obtiene el parámetro de ID de la película de la URL
  const navigate = useNavigate(); // ? Hook para navegar programáticamente
  const [movie, setMovie] = useState(null); // ! Estado para almacenar la información de la película
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false); // ! Estado para controlar si se está reproduciendo el tráiler
  const [isCinemaBoxSelected, setIsCinemaBoxSelected] = useState(false); // ! Estado para controlar la selección de un cine

  // * Efecto para obtener los datos de la película al cargar el componente o cuando cambia el ID
  useEffect(() => {
    if (!id) { // ? Verifica si el ID de la película está disponible
      console.error('Movie ID is not provided'); // ! Muestra un error si no hay ID
      return;
    }

    const fetchingMovies = async () => {
      try {
        const res = await axios.get(`http://localhost:5174/api/peliculas/${id}`); // ? Solicitud para obtener los datos de la película por ID
        console.log('Response data:', res.data); // * Muestra en consola los datos obtenidos
        setMovie(res.data); // * Almacena los datos de la película en el estado
      } catch (error) {
        console.error('Error fetching movie:', error.response ? error.response.data : error.message); // ! Muestra un error si la solicitud falla
      }
    };

    fetchingMovies();
  }, [id]); // * Se ejecuta cuando cambia el ID de la película

  // * Función para obtener el ID del video de YouTube desde una URL
  const getYouTubeVideoId = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v"); // ? Obtiene el parámetro 'v' de la URL
  };

  // * Función para manejar la reproducción del tráiler
  const handlePlayTrailer = () => {
    setIsTrailerPlaying(true); // ? Activa el estado para reproducir el tráiler
  };

  // * Función para manejar la selección de la caja de cine
  const handleCinemaBoxClick = () => {
    setIsCinemaBoxSelected(!isCinemaBoxSelected); // ? Alterna el estado de selección de la caja de cine
  };

  return (
    <div>
      {/* * Renderiza el componente de encabezado con la opción de retroceder */}
      <HeaderBack header="Detalles de la Película" onBack={() => navigate('/')} />

      <div className="movie__card">
        {movie ? ( // ? Comprueba si los datos de la película están cargados
          <>
            <div className="cover">
              {isTrailerPlaying ? ( // ? Muestra el tráiler si se está reproduciendo
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(movie.trailer)}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : ( // : De lo contrario, muestra la imagen del póster
                <img src={movie.poster_path} alt={`${movie.titulo} cover`} />
              )}
            </div>
            <div className="movie__overviewer">
              <div>
                <h3>{movie.titulo}</h3>
                {/* * Botón para reproducir el tráiler */}
                <button className="trailer__1" onClick={handlePlayTrailer}>
                  <i className="bi bi-play-fill"></i>
                  <p>Ver Trailer</p>
                </button>
                <small style={{ color: '#CECECE' }}>{movie.generos.join(', ')}</small>
              </div>
            </div>
            <p id="synopsis">{movie.sinopsis}</p> {/* * Muestra la sinopsis de la película */}
          </>
        ) : (
          <p>Loading...</p> // ! Muestra un mensaje de carga mientras se obtienen los datos
        )}
      </div>

      {/* * Sección de elenco de la película */}
      <div className="container_movies">
        <div style={{ color: '#FFFF' }} className="cine__cast">
          <h3 style={{ marginBlock: '15px' }}>Cast</h3>
          {movie && ( // ? Comprueba si los datos de la película están cargados
            <div className="cast__carousel">
              {movie.actores.map((actor) => ( // * Muestra la lista de actores
                <div key={actor.nombre} className="actor__info">
                  <img src={actor.imagen} alt={actor.nombre} className="actor__pic" />
                  <div className="text__box">
                    <p className="actor__name">{actor.nombre}</p>
                    <p className="character" style={{ color: '#CECECE' }}>{actor.character_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* * Sección para la información del cine */}
        <div className="cinema">
          <h3 style={{ marginBlock: '10px', color: '#FFFF' }}>Cinema</h3>

          <button
            className={`cinema__box ${isCinemaBoxSelected ? 'selected' : ''}`} // ? Añade una clase 'selected' si la caja de cine está seleccionada
            onClick={handleCinemaBoxClick}
          >
            <div className="cinema__overviwer">
              <p style={{ color: '#FFFF' }}>CampusLands</p>
              <small style={{ color: '#CECECE' }}>Bucaramanga</small>
            </div>
            <img className="cinema__photo" style={{ borderRadius: '10px' }} src="/public/cineCampusImg.png" alt="cinema" />
          </button>
        </div>

        
          <button
            className="book__ticket"
            onClick={() => navigate(`/movie/${id}/rooms`)}
            disabled={!isCinemaBoxSelected} // ! Deshabilitado hasta que se seleccione cinema__box
          >
            Reserva ahora
          </button>
        
      </div>
    </div>
  );
};

export default MoviesInfo; // * Exporta el componente MoviesInfo para su uso en otros módulos
