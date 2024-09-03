import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './style/seatSelector.css'; // * Importando el archivo CSS

const SeatSelector = () => {
  const navigate = useNavigate();
  // * Estados para gestionar la selección de asientos, fecha y hora
  const [selectedSeats, setSelectedSeats] = useState([]); // Estado para los asientos seleccionados
  const [currentDate, setCurrentDate] = useState(new Date()); // Estado para la fecha actual
  const [selectedDate, setSelectedDate] = useState(null); // Estado para la fecha seleccionada
  const [selectedTime, setSelectedTime] = useState(null); // Estado para la hora seleccionada

  // * Referencias para los carruseles para manejar la funcionalidad de arrastre
  const dateCarouselRef = useRef(null);
  const timeCarouselRef = useRef(null);

  // * Constantes para los precios
  const priceBase = 10000; // Precio base para películas en 2D
  const priceIncrement = 4000; // Incremento para películas en 3D

  // * Función para manejar la selección de asientos
  const handleSeatChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSeats(prev =>
      checked ? [...prev, value] : prev.filter(seat => seat !== value)
    );
  };

  // * Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el envío del formulario
    console.log(selectedSeats); // ! Muestra los asientos seleccionados (para propósitos de depuración)
  };

  // * Función para obtener los próximos 7 días para la selección de fechas
  const getNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i); // Calcula los próximos 7 días
      dates.push({
        day: date.toLocaleString('es-ES', { weekday: 'short' }), // Formato: día de la semana corto
        date: date.getDate(), // Extrae el número del día
        key: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, // Clave única
      });
    }
    return dates; // Devuelve un array de objetos de fecha
  };

  // * Horarios y precios disponibles para las películas
  const times = [
    { time: "14:00", price: priceBase, type: "2D" },
    { time: "16:30", price: priceBase + priceIncrement, type: "3D" },
    { time: "19:00", price: priceBase, type: "2D" },
    { time: "21:30", price: priceBase + priceIncrement, type: "3D" },
  ];

  // * Funciones para manejar el arrastre en los carruseles
  const handleDragStart = (e, carouselRef) => {
    carouselRef.current.isDown = true;
    carouselRef.current.startX = e.pageX || e.touches[0].pageX;
    carouselRef.current.scrollLeft = carouselRef.current.scrollLeft;
  };

  const handleDragEnd = (carouselRef) => {
    carouselRef.current.isDown = false; // Dejar de arrastrar
  };

  const handleDragMove = (e, carouselRef) => {
    if (!carouselRef.current.isDown) return; // Salir si no está arrastrando
    e.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - carouselRef.current.startX) * 2; // Calcular la distancia de desplazamiento
    carouselRef.current.scrollLeft = carouselRef.current.scrollLeft - walk;
  };

  // * Función para manejar la selección de fecha
  const handleDateSelect = (key) => {
    setSelectedDate(prev => prev === key ? null : key); // Alternar la fecha seleccionada
  };

  // * Función para manejar la selección de hora
  const handleTimeSelect = (time) => {
    setSelectedTime(prev => prev === time ? null : time); // Alternar la hora seleccionada
  };

  // * Función para calcular el precio total basado en los asientos y hora seleccionados
  const calculateTotalPrice = () => {
    if (!selectedTime) return 0; // Retorna 0 si no hay hora seleccionada
    const timeInfo = times.find(t => t.time === selectedTime);
    if (!timeInfo) return 0;

    const basePrice = timeInfo.price;
    const isPremiumSeat = selectedSeats.some(seat => seat.startsWith('C') || seat.startsWith('D') || seat.startsWith('E') || seat.startsWith('F'));
    const finalPrice = isPremiumSeat ? basePrice * 1.3 : basePrice; // Aplicar precio premium
    return finalPrice * selectedSeats.length; // Calcular total
  };

  
  const HeaderBack = ({ header, onBack }) => {
    return (
      <div className="header__back__2">
        <i onClick={onBack} className="bx bx-chevron-left"></i>
        <h3 style={{ color: '#FFFF' }}>{header}</h3>
        <i className="bi bi-three-dots-vertical"></i>
      </div>
    );
  };

  return (
    <section className="asientos">
    <form id="myform" onSubmit={handleSubmit}>
      <div className="seat-selection">
        <HeaderBack header="Elige tus asientos" onBack={() => navigate(-1)} /> {/* Cambiado a navigate(-1) */}
        <div className="screen-indicator">
          <img
            src="/public/vector.png"
            alt="Screen Indicator"
            style={{ width: '375px', height: 'auto', maxWidth: '100%' }}
          />
          <div className="screen-text">Pantalla</div>
        </div>
      </div>
      <article className="asientos__normal">
        <div data-fila="1">
          <small>A</small>
          <div className="asientos__lista">
            {["A1", "A2", "A3", "A4", "A5"].map(seat => (
              <div key={seat}>
                <input
                  type="checkbox"
                  name="seat"
                  value={seat}
                  id={seat}
                  onChange={handleSeatChange}
                />
                <label htmlFor={seat} data-place={seat.slice(1)}></label>
              </div>
            ))}
          </div>
        </div>
        <div data-fila="2">
          <small>B</small>
          <div className="asientos__lista">
            {["B1", "B2", "B3", "B4", "B5", "B6", "B7"].map(seat => (
              <div key={seat}>
                <input
                  type="checkbox"
                  name="seat"
                  value={seat}
                  id={seat}
                  onChange={handleSeatChange}
                />
                <label htmlFor={seat} data-place={seat.slice(1)}></label>
              </div>
            ))}
          </div>
        </div>
      </article>
      <article className="asientos__preferenciales">
        <div data-colum="3">
          <small>C</small>
          <div>
            {["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"].map((seat) => (
              <div key={seat}>
                <input
                  type="checkbox"
                  name="seat"
                  value={seat}
                  id={seat}
                  onChange={handleSeatChange}
                />
                <label htmlFor={seat} data-place={seat.slice(1)}></label>
              </div>
            ))}
          </div>
        </div>
        <div data-colum="4">
          <small>D</small>
          <div>
            {["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"].map(seat => (
              <div key={seat}>
                <input
                  type="checkbox"
                  name="seat"
                  value={seat}
                  id={seat}
                  onChange={handleSeatChange}
                />
                <label htmlFor={seat} data-place={seat.slice(1)}></label>
              </div>
            ))}
          </div>
        </div>
        <div data-colum="5">
          <small>E</small>
          <div>
            {["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].map(seat => (
              <div key={seat}>
                <input
                  type="checkbox"
                  name="seat"
                  value={seat}
                  id={seat}
                  onChange={handleSeatChange}
                />
                <label htmlFor={seat} data-place={seat.slice(1)}></label>
              </div>
            ))}
          </div>
        </div>
        <div data-colum="6">
          <small>F</small>
          <div>
            {["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"].map(seat => (
              <div key={seat}>
                <input
                  type="checkbox"
                  name="seat"
                  value={seat}
                  id={seat}
                  onChange={handleSeatChange}
                />
                <label htmlFor={seat} data-place={seat.slice(1)}></label>
              </div>
            ))}
          </div>
        </div>
      </article>
      <article className="asientos__menu">
        <div className="asientos__menu-item">
          <span className="circle available"></span> <label>Disponibles</label>
        </div>
        <div className="asientos__menu-item">
          <span className="circle reserved"></span> <label>Reservados</label>
        </div>
        <div className="asientos__menu-item">
          <span className="circle selected"></span> <label>Seleccionados</label>
        </div>
      </article>

      {/* Date Carousel */}
      <div
        className="carousel-container"
        ref={dateCarouselRef}
        onMouseDown={(e) => handleDragStart(e, dateCarouselRef)}
        onMouseLeave={() => handleDragEnd(dateCarouselRef)}
        onMouseUp={() => handleDragEnd(dateCarouselRef)}
        onMouseMove={(e) => handleDragMove(e, dateCarouselRef)}
        onTouchStart={(e) => handleDragStart(e, dateCarouselRef)}
        onTouchEnd={() => handleDragEnd(dateCarouselRef)}
        onTouchMove={(e) => handleDragMove(e, dateCarouselRef)}
      >
        <div className="date-carousel">
          {getNext7Days().map((dayInfo) => (
            <div
              key={dayInfo.key}
              className={`date-card ${selectedDate === dayInfo.key ? 'selected' : ''}`}
              onClick={() => handleDateSelect(dayInfo.key)}
            >
              <div className="day">{dayInfo.day}</div>
              <div className="date">{dayInfo.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time and Price Carousel */}
      <div
        className="carousel-container"
        ref={timeCarouselRef}
        onMouseDown={(e) => handleDragStart(e, timeCarouselRef)}
        onMouseLeave={() => handleDragEnd(timeCarouselRef)}
        onMouseUp={() => handleDragEnd(timeCarouselRef)}
        onMouseMove={(e) => handleDragMove(e, timeCarouselRef)}
        onTouchStart={(e) => handleDragStart(e, timeCarouselRef)}
        onTouchEnd={() => handleDragEnd(timeCarouselRef)}
        onTouchMove={(e) => handleDragMove(e, timeCarouselRef)}
      >
        <div className="time-carousel">
          {times.map((item) => (
            <div
              key={item.time}
              className={`time-price-card ${selectedTime === item.time ? 'selected' : ''}`}
              onClick={() => handleTimeSelect(item.time)}
            >
              <div className="time">{item.time}</div>
              <div className="price">
                {"$" + item.price + " COP"}
                <br />
                <span className="type">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Purchase Section */}
      <div className="ticket-purchase">
        <div className="price-info">
          <div className="label">Valor</div>
          <div className="total-price">$ {calculateTotalPrice()} COP</div>
        </div>
        <button type="submit" className="buy-ticket-button">Comprar Tickets</button>
      </div>

    </form>
  </section>
  );
};

export default SeatSelector;
