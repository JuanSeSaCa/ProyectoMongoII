import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home.jsx';
import MoviesInfo from './components/moviesInfo.jsx';
import SeatSelector from './components/seatSelector.jsx';
import OrderSummary from './components/orderSummary.jsx';
//import Ticket from './components/ticket.jsx';
import './index.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MoviesInfo />} />
      <Route path="/movie/:id/rooms" element={<SeatSelector />} />
      <Route path="/order-summary" element={<OrderSummary />} />
    </Routes>
  </Router>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);