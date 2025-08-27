import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Plus, BarChart3 } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', icon: Home, label: 'Habits' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-3 min-w-0 tap-highlight-none ${
                  isActive
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon 
                  size={20} 
                  className={isActive ? 'stroke-2' : 'stroke-1.5'}
                />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}