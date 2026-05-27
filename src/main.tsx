import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { init } from '@plausible-analytics/tracker'
import './index.css'
import App from './App.tsx'

init({
  domain: 'kreli.ma',
  endpoint: 'https://analytics.arbaoui.me/api/event',
  autoCapturePageviews: true,
  outboundLinks: true,
  fileDownloads: true,
  formSubmissions: true,
})

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
