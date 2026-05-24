import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { useThemeStore } from './stores/useStore'
import App from './App.jsx'
import './index.css'

useThemeStore.getState().initTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px' },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
