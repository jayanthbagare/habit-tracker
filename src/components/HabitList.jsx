import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Check, Clock, Target, TrendingUp, TrendingDown, Undo2 } from 'lucide-react'
import { getHabits, logHabit, unlogHabit, getAllHabitsProgress } from '../lib/localStorage'
import { format, startOfDay, endOfDay } from 'date-fns'

export default function HabitList() {
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [progressData, setProgressData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loggingHabit, setLoggingHabit] = useState(null)
  const [unloggingHabit, setUnloggingHabit] = useState(null)

  useEffect(() => {
    loadHabitsAndProgress()
  }, [])

  const loadHabitsAndProgress = async () => {
    try {
      const [habitsData, progressData] = await Promise.all([
        getHabits(),
        getAllHabitsProgress()
      ])
      setHabits(habitsData)
      setProgressData(progressData)
    } catch (error) {
      console.error('Error loading habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogHabit = async (habitId) => {
    if (loggingHabit === habitId) return
    
    setLoggingHabit(habitId)
    try {
      await logHabit(habitId)
      await loadHabitsAndProgress() // Refresh data
    } catch (error) {
      console.error('Error logging habit:', error)
      alert('Failed to log habit. Please try again.')
    } finally {
      setLoggingHabit(null)
    }
  }

  const handleUnlogHabit = async (habitId) => {
    if (unloggingHabit === habitId) return
    
    setUnloggingHabit(habitId)
    try {
      const removedLog = await unlogHabit(habitId)
      if (removedLog) {
        await loadHabitsAndProgress() // Refresh data
      } else {
        alert('No recent completion found to undo.')
      }
    } catch (error) {
      console.error('Error unlogging habit:', error)
      alert('Failed to undo habit. Please try again.')
    } finally {
      setUnloggingHabit(null)
    }
  }

  const getTodayLogCount = (habitId, logs) => {
    const today = new Date()
    const startOfToday = startOfDay(today)
    const endOfToday = endOfDay(today)
    
    return logs.filter(log => {
      const logDate = new Date(log.completed_at)
      return logDate >= startOfToday && logDate <= endOfToday
    }).length
  }

  const getProgressForHabit = (habitId) => {
    return progressData.find(p => p.habit.id === habitId) || {}
  }

  const getFrequencyDisplay = (habit) => {
    const count = habit.frequency_count > 1 ? `${habit.frequency_count}x ` : ''
    return `${count}${habit.frequency_type}`
  }

  const getProgressColor = (progress) => {
    if (!progress.progressPercentage) return 'text-gray-400'
    if (progress.isOnTrack) return 'text-green-600'
    if (progress.progressPercentage >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressIcon = (progress) => {
    if (!progress.progressPercentage) return Clock
    if (progress.isOnTrack) return TrendingUp
    return TrendingDown
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading habits...</div>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Habits</h1>
            <p className="text-sm text-gray-600">{format(new Date(), 'EEEE, MMMM d')}</p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors tap-highlight-none"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-6">Start building better habits today</p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors tap-highlight-none"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          habits.map((habit) => {
            const progress = getProgressForHabit(habit.id)
            const ProgressIcon = getProgressIcon(progress)
            const isLogging = loggingHabit === habit.id
            const isUnlogging = unloggingHabit === habit.id
            const todayLogCount = getTodayLogCount(habit.id, progress.logs || [])
            
            return (
              <div
                key={habit.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-medium text-gray-900 leading-5 mb-1">
                        {habit.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{getFrequencyDisplay(habit)}</span>
                        {progress.completedCount !== undefined && (
                          <span>
                            {progress.completedCount}/{progress.requiredCount} done
                          </span>
                        )}
                        {todayLogCount > 0 && (
                          <span className="text-green-600 font-medium">✓ {todayLogCount}x today</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ProgressIcon 
                        size={16} 
                        className={getProgressColor(progress)}
                      />
                      
                      <button
                        onClick={() => handleLogHabit(habit.id)}
                        disabled={isLogging}
                        className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl transition-colors tap-highlight-none"
                      >
                        {isLogging ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check size={20} />
                        )}
                      </button>

                      {todayLogCount > 0 && (
                        <button
                          onClick={() => handleUnlogHabit(habit.id)}
                          disabled={isUnlogging}
                          className="flex items-center justify-center w-12 h-12 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-xl transition-colors tap-highlight-none"
                        >
                          {isUnlogging ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Undo2 size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {progress.progressPercentage !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progress this period</span>
                        <span className={getProgressColor(progress)}>
                          {Math.round(progress.progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress.isOnTrack
                              ? 'bg-green-500'
                              : progress.progressPercentage >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {progress.logs && progress.logs.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="text-xs text-gray-500 mb-2">Recent completions:</div>
                    <div className="flex flex-wrap gap-1">
                      {progress.logs.slice(0, 5).map((log, index) => (
                        <span
                          key={log.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {format(new Date(log.completed_at), 'MMM d')}
                        </span>
                      ))}
                      {progress.logs.length > 5 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{progress.logs.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}