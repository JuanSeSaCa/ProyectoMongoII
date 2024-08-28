import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SeatSelector from './seatSelector.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SeatSelector />
  </StrictMode>,
)
