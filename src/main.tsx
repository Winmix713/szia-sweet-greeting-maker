
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HeroUIProvider } from '@heroui/react'

createRoot(document.getElementById("root")!).render(
  <HeroUIProvider>
    <App />
  </HeroUIProvider>
);
