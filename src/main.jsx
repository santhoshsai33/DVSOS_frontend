import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import './styles/bootstrap-overrides.scss'
import './styles/variables.css'
import './styles/globals.css'
import './styles/scrollbar.css'
import './styles/typography.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
