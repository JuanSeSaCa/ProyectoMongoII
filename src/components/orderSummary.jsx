import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style/orderSummary.css';

const OrderSummary = () => {
  const [id, setId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [movie, setMovie] = useState(null);
  const [cards, setCards] = useState(null);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  
  // Datos simulados de globalState
  const [globalState, setGlobalState] = useState({
    orderId: null,
    current_price: 10000,  // precio simulado
    selectedScreeningId: "abc123",  // ID de proyección simulado
    ticket_overview: { numero_asiento: "A1" },  // Asiento simulado
    selectedSeatType: "regular",  // Tipo de asiento simulado
    screeningRoom: "Sala 3",  // Sala de proyección simulada
    screeningDate: new Date().toISOString(),  // Fecha de proyección simulada
    screeningTime: "18:00"  // Hora de proyección simulada
  });

  // Formatter para el precio
  const priceFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  const fetchNewId = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5174/api/boletos/newid', { withCredentials: true });
      setId(response.data);
      setGlobalState(prevState => ({ ...prevState, orderId: response.data }));
    } catch (error) {
      console.error('Error fetching new ID:', error);
    }
  }, []);

  const fetchMovie = useCallback(async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5174/api/peliculas/${movieId}`);
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  }, []);

  const fetchCardByUser = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5174/api/tarjetasvip/getbyid', { withCredentials: true });
      setCards(response.data.card);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  }, []);

  useEffect(() => {
    if (!globalState.screeningDate) {
      window.history.back();
    }

    fetchNewId();
    fetchMovie(1); // Reemplaza '1' con el ID real de la película que necesites
    fetchCardByUser();
    startTimer();
  }, [fetchNewId, fetchMovie, fetchCardByUser, globalState.screeningDate]);

  const handleCardActivation = () => {
    if (!isActive) {
      setIsActive(true);
      setGlobalState(prevState => ({
        ...prevState,
        current_price: prevState.current_price - (prevState.current_price * (cards[0].descuento_porcentaje / 100))
      }));
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            window.history.back();
            Swal.fire({
              title: 'Alerta',
              text: 'El tiempo ha terminado',
              icon: 'warning',
              confirmButtonText: 'Intentar de nuevo',
              confirmButtonColor: '#FE0000',
              iconColor: '#FE0000',
              width: '95%',
              background: '#1f1f1f',
              color: 'white',
            });
            return 0;
          }
          setMinutes((prevMinutes) => prevMinutes - 1);
          return 59;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const handlePurchaseTicket = async () => {
    try {
      await axios.post('http://localhost:5174/api/boletos/comprar_boleto', {
        _id: id,
        proyeccion_id: globalState.selectedScreeningId,
        codigo_asiento: globalState.ticket_overview.numero_asiento,
        porcentaje_descuento_VIP: cards?.porcentaje_descuento_VIP || 0,
        total: globalState.current_price
      }, { withCredentials: true });

      alert('Ticket comprado con éxito');
    } catch (error) {
      console.error("Error buying ticket:", error.message);
    }
  };

  return (
    <div>
      <div className="header__back__1">
        <i onClick={() => window.history.back()} className='bx bx-chevron-left'></i>
        <h3 style={{ color: '#CECECE' }}>Resumen de Orden</h3>
        <i className="bi bi-three-dots-vertical"></i>
      </div>

      <div className="movie__projection">
        {movie && (
          <div className="movie__pic">
            <img style={{ width: '100%', height: '100%', borderRadius: '10px' }} src={movie.caratula} alt="" />
          </div>
        )}
        <div style={{ fontWeight: 'bold' }} className="summary">
          {movie && <p style={{ color: '#FE0000', fontSize: '18px' }}>{movie.titulo}</p>}
          {movie && <small>{movie.generos.join(', ')}</small>}
          <p style={{ fontSize: '18px', margin: '30px 0 0 0', color: '#FFFF' }}>
            SALA {globalState.screeningRoom}
          </p>
          <small>
            {new Date(new Date(globalState.screeningDate).setDate(new Date(globalState.screeningDate).getDate() + 1)).toDateString()}, {globalState.screeningTime}
          </small>
        </div>
      </div>

      <div className="order-summary">
        <div className="order-number">
          <span style={{ fontSize: '13px' }} className="label">NÚMERO DE ORDEN: {id}</span>
          <span style={{ fontSize: '13px', color: '#FFFF' }} className="value"></span>
        </div>

        <div className="price-item">
          <span style={{ color: '#CECECE' }} className="ticket__count">1 TICKET</span>
          <span className="seat__number">{globalState.ticket_overview.numero_asiento}</span>
        </div>

        <hr style={{ height: '8px' }} />

        <div className="price-item">
          <span className="item-name">{globalState.selectedSeatType === "regular" ? "REGULAR" : "VIP"} SEAT</span>
          <span className="item-price">{priceFormatter.format(globalState.current_price)}</span>
        </div>

        <hr />
      </div>

      <div className="payment__container">
        {cards ? (
          <div className="payment__method">
            <h3 className="payment__title">Método de Pago</h3>
            <div className={`payment__card ${isActive ? 'payment__card--active' : ''}`} onClick={handleCardActivation}>
              <img src="../assets/vipCard.png" alt="VIP Card" className="payment__logo" />
              <div className="card__info">
                <span className="payment__card__info">Tarjeta VIP</span>
                <span className="payment__card__number">{cards[0]?.numero_tarjeta || null}</span>
              </div>
              <div className="payment__card__indicator">
                {isActive && <div className="payment__card__indicator__inner"></div>}
              </div>
            </div>
          </div>
        ) : (
          <div className="dont__have">
            <h3 className="payment__title">¿No tienes una tarjeta VIP?</h3>
            <p className="payment__description">Para obtener una tarjeta VIP, comunícate con la taquilla de boletos para más información.</p>
          </div>
        )}
        <div className="payment__timer">
          <span className="payment__timer__text">Completa tu pago en</span>
          <span className="payment__timer__countdown">{minutes}:{seconds < 10 ? '0' : ''}{seconds}</span>
        </div>
        <button className="button_order" onClick={handlePurchaseTicket}>Comprar Ticket</button>
      </div>
    </div>
  );
};

export default OrderSummary;