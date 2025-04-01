import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Function to load Merge Link script
const loadMergeLinkScript = () => {
  return new Promise((resolve, reject) => {
    if (window.MergeLink) {
      resolve(window.MergeLink)
      return
    }

    const script = document.createElement('script')
    // Using the CORRECT Merge Link script URL
    script.src = 'https://cdn.merge.dev/initialize.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      if (window.MergeLink) {
        resolve(window.MergeLink)
      } else {
        reject(new Error('Merge Link script loaded but MergeLink not found'))
      }
    }
    script.onerror = (error) => {
      console.error('Merge Link script load error:', error)
      reject(new Error('Failed to load Merge Link script'))
    }
    document.head.appendChild(script)
  })
}

// Load script before rendering app
loadMergeLinkScript()
  .then(() => {
    console.log('Merge Link script loaded successfully')
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  })
  .catch(error => {
    console.error('Failed to initialize Merge Link:', error)
    // Still render the app, but it won't be able to use Merge Link
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }) 