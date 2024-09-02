import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SeatSelector from './components/seatSelector'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SeatSelector />
  </StrictMode>,
)
