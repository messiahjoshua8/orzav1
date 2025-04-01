import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [mergeLinkAvailable, setMergeLinkAvailable] = useState(false)

  const logInfo = (message) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`)
  }

  const logError = (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error)
    // Also log the full error object for debugging
    if (error) {
      console.error('Full error details:', error)
    }
  }

  useEffect(() => {
    // Check if Merge Link is available
    const checkMergeLink = () => {
      if (window.MergeLink) {
        setMergeLinkAvailable(true)
        logInfo('Merge Link is available')
      } else {
        setMergeLinkAvailable(false)
      }
    }

    // Initial check
    checkMergeLink()

    // Set up an interval to check periodically
    const interval = setInterval(checkMergeLink, 1000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  const handleMergeLink = async () => {
    if (!mergeLinkAvailable) {
      const errorMsg = 'Merge Link is not available. Please refresh the page.'
      logError(errorMsg, new Error(errorMsg))
      setError(errorMsg)
      return
    }

    try {
      setLoading(true)
      setError(null)
      logInfo('Requesting link token from backend')

      // Get a link token from our backend
      const linkTokenResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-link-token`,
        {
          end_user_origin_id: "test-user-123",
          end_user_organization_name: "Test Organization", 
          end_user_email_address: "test@example.com",
          categories: ["hris", "ats", "accounting", "ticketing", "crm", "filestorage"]
        }
      )

      const linkToken = linkTokenResponse.data.link_token
      logInfo(`Received link token: ${linkToken.substring(0, 10)}...`)

      // Initialize Merge Link
      window.MergeLink.initialize({
        linkToken: linkToken,
        onSuccess: async (publicToken) => {
          logInfo(`Merge Link success - public token: ${publicToken.substring(0, 10)}...`)
          try {
            // Send the token to our backend
            logInfo('Sending token to backend for exchange')
            const response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/exchange-token`,
              {
                public_token: publicToken,
                user_id: "test-user-123",
                organization_id: "test-org-123",
              }
            )

            logInfo('Successfully received data from backend')
            setData(response.data)
            setLoading(false)
          } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to exchange token'
            logError('Backend API error:', err)
            setError(errorMessage)
            setLoading(false)
          }
        },
        onExit: () => {
          logInfo('Merge Link closed')
          setLoading(false)
        },
        onError: (error) => {
          logError('Merge Link error:', error)
          setError(error.message || 'Failed to connect to Merge')
          setLoading(false)
        },
      });
      
      // Open Merge Link
      logInfo('Opening Merge Link')
      window.MergeLink.openLink();
    } catch (err) {
      logError('Failed to initialize Merge Link:', err)
      setError(err.response?.data?.detail || 'Failed to initialize Merge Link')
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>Merge API Integration</h1>
      
      <button 
        onClick={handleMergeLink}
        disabled={loading || !mergeLinkAvailable}
        className="connect-button"
      >
        {loading ? 'Connecting...' : 'Connect to Merge'}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {data && (
        <div className="data-container">
          <h2>Connected Successfully!</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App 