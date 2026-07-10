import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { MapProvider } from './components/MyContexts/MyContexts.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MapProvider>
      <App />
    </MapProvider>
  </StrictMode>,
)
