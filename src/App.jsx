import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { requestNotificationPermission } from './lib/notifications'
import HabitList from './components/HabitList'
import CreateHabit from './components/CreateHabit'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'

function App() {
  useEffect(() => {
    // Register service worker and request notification permission
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          requestNotificationPermission()
        })
        .catch(error => console.error('Service Worker registration failed:', error))
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 safe-area-inset">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
          <Routes>
            <Route path="/" element={<HabitList />} />
            <Route path="/create" element={<CreateHabit />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Navigation />
        </div>
      </div>
    </Router>
  )
}

export default App