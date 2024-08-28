import React, { useState, useRef, useEffect } from 'react';
import './seatSelector.css'; // * Importando el archivo CSS

const SeatSelector = () => {
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

  return (
    <section className="asientos">
      <form id="myform" onSubmit={handleSubmit}>
        {/* * Selección de asientos e indicador de pantalla */}
        <div className="seat-selection">
          <div className="nav">
            <span className="back-arrow">&lt;</span>
            <span className="title">Elegir Asiento</span>
            <span className="menu">...</span>
          </div>
          <div className="screen-indicator">
            <img
              src="./assets/image.png"
              alt="Indicador de Pantalla"
              style={{ width: '250px', height: 'auto', maxWidth: '100%', marginTop: '15px' }}
            />
            <div className="screen-text">Pantalla Aquí</div>
          </div>
        </div>

        {/* * Sección de asientos normales */}
        <article className="asientos__normal">
          {/* Asientos en la fila A */}
          <div fila="1">
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
          {/* Asientos en la fila B */}
          <div fila="2">
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

        {/* * Sección de asientos preferenciales */}
        <article className="asientos__preferenciales">
          {/* Asientos en las filas C a F */}
          {/* Fila C */}
          <div colum="3">
            <small>C</small>
            <div>
              {["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"].map(seat => (
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
          {/* Fila D */}
          <div colum="4">
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
          {/* Fila E */}
          <div colum="5">
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
          {/* Fila F */}
          <div colum="6">
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

        {/* * Leyenda de categorías de asientos */}
        <div className="categorias-asientos">
          <div>
            <span className="disponible"></span> Disponible
          </div>
          <div>
            <span className="seleccionado"></span> Seleccionado
          </div>
          <div>
            <span className="ocupado"></span> Ocupado
          </div>
        </div>

        {/* * Sección de selección de fecha y hora */}
        <article className="seleccion-fecha-hora">
          {/* Selector de fecha */}
          <div
            className="carrusel-fecha"
            ref={dateCarouselRef}
            onMouseDown={(e) => handleDragStart(e, dateCarouselRef)}
            onMouseMove={(e) => handleDragMove(e, dateCarouselRef)}
            onMouseUp={() => handleDragEnd(dateCarouselRef)}
            onMouseLeave={() => handleDragEnd(dateCarouselRef)}
            onTouchStart={(e) => handleDragStart(e, dateCarouselRef)}
            onTouchMove={(e) => handleDragMove(e, dateCarouselRef)}
            onTouchEnd={() => handleDragEnd(dateCarouselRef)}
          >
            {getNext7Days().map(date => (
              <div
                key={date.key}
                className={`item-fecha ${selectedDate === date.key ? 'activo' : ''}`}
                onClick={() => handleDateSelect(date.key)}
              >
                <span>{date.day}</span>
                <span>{date.date}</span>
              </div>
            ))}
          </div>

          {/* Selector de hora */}
          <div
            className="carrusel-hora"
            ref={timeCarouselRef}
            onMouseDown={(e) => handleDragStart(e, timeCarouselRef)}
            onMouseMove={(e) => handleDragMove(e, timeCarouselRef)}
            onMouseUp={() => handleDragEnd(timeCarouselRef)}
            onMouseLeave={() => handleDragEnd(timeCarouselRef)}
            onTouchStart={(e) => handleDragStart(e, timeCarouselRef)}
            onTouchMove={(e) => handleDragMove(e, timeCarouselRef)}
            onTouchEnd={() => handleDragEnd(timeCarouselRef)}
          >
            {times.map(time => (
              <div
                key={time.time}
                className={`item-hora ${selectedTime === time.time ? 'activo' : ''}`}
                onClick={() => handleTimeSelect(time.time)}
              >
                <span>{time.time}</span>
                <span>{time.type}</span>
                <span>${time.price.toLocaleString('es-ES')}</span>
              </div>
            ))}
          </div>
        </article>

        {/* * Botón para enviar el formulario */}
        <button type="submit">Reservar Asientos</button>
      </form>

      {/* * Muestra el precio total */}
      <div className="total">
        <h3>Total a Pagar: ${calculateTotalPrice().toLocaleString('es-ES')}</h3>
      </div>
    </section>
  );
};

export default SeatSelector;
