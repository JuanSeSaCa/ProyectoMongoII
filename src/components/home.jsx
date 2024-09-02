import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style/home.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const HeaderUser = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5174/api/clientes/66b27a3cd541a250404781dc');
        setUserName(res.data.nickname);
      } catch (error) {
        console.error('Error getting the details of the user', error);
      }
    };

    userDetails();
  }, []);

  return (
    <div className="user__header">
      <div className="user__info">
        <img className="user__avatar" src="../../public/handsome-confident-blond-bearded-businessman-with-hands-pockets-smiling-joyfully-give-professional-vibe-discussing-business-double-his-income-become-successful-white-background 1.svg" alt="User Avatar" />
        <div className="user__greeting">
          <p className="user__name">Hi, {userName}</p>
          <p className="user__message">Let's watch a movie together!</p>
        </div>
      </div>
      <div className="notification__icon">
        <i className="bi bi-bell"></i>
      </div>
    </div>
  );
};

const SearchInput = React.forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [movies, setMovies] = useState([]);
  const inputField = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const allMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5174/api/peliculas');
        setMovies(res.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    allMovies();
  }, []);

  useEffect(() => {
    const updateSuggestions = () => {
      if (searchQuery) {
        setSuggestions(movies.filter(movie =>
          movie.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.generos.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
        ).slice(0, 3));
      } else {
        setSuggestions([]);
      }
    };

    updateSuggestions();
  }, [searchQuery, movies]);

  React.useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputField.current) {
        inputField.current.focus();
      }
    }
  }));

  return (
    <div className="search__wrapper">
      <div className={`search__container ${suggestions.length > 0 && searchQuery.length > 0 ? 'active' : ''} ${isFocused ? 'focused' : ''}`}>
        <i className={`bi bi-search search__icon ${isFocused ? 'focused-icon' : ''}`}></i>
        <input
          ref={inputField}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="text"
          className="search__input"
          placeholder="Search movie, cinema, genre..."
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions__list">
          {suggestions.map((suggestion) => (
            <li key={suggestion._id} onClick={() => window.location.href = `/movie/${suggestion._id}`}>
              <div className="suggestion__content">
                <div className="suggestion__poster-wrapper">
                  <img src={suggestion.backdrop_path} alt="Movie poster" className="suggestion__poster" />
                </div>
                <div className="suggestion__info">
                  <h3 className="suggestion__title">{suggestion.titulo}</h3>
                  <div className="suggestion__genres">
                    {suggestion.generos.map((genre, index) => (
                      <span key={genre} className="suggestion__genre">{genre}</span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

const MoviesCarousel = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const moviesFetch = async () => {
      try {
        const res = await axios.get('http://localhost:5174/api/peliculas');
        setMovies(res.data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching movies', error);
      }
    };

    moviesFetch();
  }, []);

  const handleScrolling = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const slideWidth = slider.children[0].offsetWidth + 15; // Ancho del slide más el gap
      const newIndex = Math.round(slider.scrollLeft / slideWidth);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    slider.addEventListener('scroll', handleScrolling);
    return () => slider.removeEventListener('scroll', handleScrolling);
  }, []);

  const handleDotClick = (index) => {
    const slider = sliderRef.current;
    const slideWidth = slider.children[0].offsetWidth + 15; // Ancho del slide más el gap
    slider.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  return (
    <>
      <div className="now__playing">
        <p>Now playing</p>
        <p>See all</p>
      </div>

      <div className="movies__carousel">
        <div className="movie__slider" ref={sliderRef}>
          {movies.map((movie) => (
            <div key={movie._id} className="movie__slide" onClick={() => window.location.href = `/movie/${movie._id}`}>
              <img src={movie.backdrop_path} alt={movie.titulo} className="movie__poster" />
            </div>
          ))}
        </div>
      </div>

      {movies[currentIndex] && (
        <div className="current__movie__info">
          <h3>{movies[currentIndex].titulo}</h3>
          <p style={{ color: '#CECECE', marginBlock: '5px', fontSize: '13px' }}>{movies[currentIndex].generos.join(', ')}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
        {movies.map((_, index) => (
          <div
            key={index}
            className={currentIndex === index ? 'dot_active' : 'dot_inactive'}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </>
  );
};

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const moviesFetch = async () => {
      try {
        const res = await axios.get('http://localhost:5174/api/peliculas');
        setMovies(res.data);
      } catch (error) {
        console.error('Error fetching movies', error);
      }
    };

    moviesFetch();
  }, []);

  return (
    <>
      <div className="coming__soon">
        <p>Coming soon</p>
        <p>See all</p>
      </div>

      <div className="coming__soon__list">
        {movies.map((movie) => (
          <div key={movie._id} className="movie__box" onClick={() => window.location.href = `/movie/${movie._id}`}>
            <img src={movie.backdrop_path} alt="movie poster" className="movie_image" />
            <div className="description">
              <p style={{ marginTop: '10px' }}>{movie.titulo}</p>
              <p>{movie.generos.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const Menu = ({ focusSearchInput }) => {
  const [activeIcon, setActiveIcon] = useState('home');

  const showAllTickets = () => {
    window.location.href = '/historial_tickets';
    setActiveIcon('tickets');
  };

  return (
    <nav className="container__menu">
      <div onClick={() => setActiveIcon('home')} className={`menu__item ${activeIcon === 'home' ? 'active' : ''}`}>
        <i className="bi bi-house-door"></i>
        <span>Home</span>
      </div>
      <div onClick={() => setActiveIcon('search')} className={`menu__item ${activeIcon === 'search' ? 'active' : ''}`} onClick={focusSearchInput}>
        <i className="bi bi-search"></i>
        <span>Search</span>
      </div>
      <div onClick={showAllTickets} className={`menu__item ${activeIcon === 'tickets' ? 'active' : ''}`}>
        <i className="bi bi-ticket-perforated"></i>
        <span>My Tickets</span>
      </div>
      <div className={`menu__item ${activeIcon === 'user' ? 'active' : ''}`}>
        <i className="bi bi-person"></i>
        <span>Account</span>
      </div>
    </nav>
  );
};

const Home = () => {
  const searchRef = useRef();

  const focusSearchInput = () => {
    searchRef.current.focusInput();
  };

  return (
    <div className="container">
      <HeaderUser />
      <div className="main__content">
        <Menu focusSearchInput={focusSearchInput} />
        <SearchInput ref={searchRef} />
        <MoviesCarousel />
        <ComingSoon />
      </div>
    </div>
  );
};

export default Home;