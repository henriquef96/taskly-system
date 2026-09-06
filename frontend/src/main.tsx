import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from '@/config/queryClient'
import { AuthProvider } from '@/components/AuthProvider'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { ToastProvider } from '@/components/toast/ToastProvider'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider><App /></AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>,
)
