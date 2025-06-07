import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProjectsProvider } from '@/providers/project-provider.tsx'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProjectsProvider>
      <App />
    </ProjectsProvider>
  </StrictMode>,
);
