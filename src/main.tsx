import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@imanity/tabi-gallery/style.css'
import { App } from './app/App'
import './styles/global.css'

const redirect = new URLSearchParams(window.location.search).get('redirect')

if (redirect) {
  window.history.replaceState(null, '', redirect)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
