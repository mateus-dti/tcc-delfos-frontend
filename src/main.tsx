import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeProvider'
import './index.css'

// Inicializa o tema antes do primeiro render para evitar flash
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme')
  const root = document.documentElement
  
  if (savedTheme) {
    root.classList.remove('light', 'dark')
    root.classList.add(savedTheme)
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.remove('light', 'dark')
    root.classList.add(prefersDark ? 'dark' : 'light')
  }
}

// Executa antes do React renderizar
initializeTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)

