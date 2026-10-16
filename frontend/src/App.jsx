import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen.jsx'
import { getCurrentAdmin, loginAdmin, logoutAdmin } from './lib/api.js'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  const [admin, setAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadCurrentAdmin = async () => {
      try {
        const data = await getCurrentAdmin()
        setAdmin(data.admin)
      } catch (_error) {
        setAdmin(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrentAdmin()
  }, [])

  const handleLogin = async (credentials) => {
    const data = await loginAdmin(credentials)
    setAdmin(data.admin)
    navigate('/dashboard', { replace: true })
  }

  const handleLogout = async () => {
    await logoutAdmin()
    setAdmin(null)
    navigate('/login', { replace: true })
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={admin ? <Navigate replace to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
      />
      <Route
        path="/dashboard"
        element={
          admin
            ? <DashboardPage admin={admin} onLogout={handleLogout} />
            : <Navigate replace to="/login" />
        }
      />
      <Route path="*" element={<Navigate replace to={admin ? '/dashboard' : '/login'} />} />
    </Routes>
  )
}

export default App
