import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Check, Clock, Target, TrendingUp, TrendingDown, Undo2, Calendar, Trash2, X } from 'lucide-react'
import { getHabits, logHabit, unlogHabit, getAllHabitsProgress, deleteHabit } from '../lib/localStorage'
import { format, startOfDay, endOfDay } from 'date-fns'
import Logo from './Logo'
import DatePickerModal from './DatePickerModal'

export default function HabitList() {
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [progressData, setProgressData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loggingHabit, setLoggingHabit] = useState(null)
  const [unloggingHabit, setUnloggingHabit] = useState(null)
  const [datePickerModal, setDatePickerModal] = useState({ isOpen: false, habit: null })
  const [deletingHabit, setDeletingHabit] = useState(null)
  const [expandedHabit, setExpandedHabit] = useState(null)
  const longPressTimer = useRef(null)

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

  const handleLogHabit = async (habitId, completedDate = new Date()) => {
    if (loggingHabit === habitId) return
    
    setLoggingHabit(habitId)
    try {
      await logHabit(habitId, '', completedDate)
      await loadHabitsAndProgress() // Refresh data
    } catch (error) {
      console.error('Error logging habit:', error)
      alert('Failed to log habit. Please try again.')
    } finally {
      setLoggingHabit(null)
    }
  }

  const handleLongPressStart = (habit) => {
    longPressTimer.current = setTimeout(() => {
      setExpandedHabit(habit.id)
    }, 800) // 800ms long press
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const handleDatePickerConfirm = (selectedDate) => {
    if (datePickerModal.habit) {
      handleLogHabit(datePickerModal.habit.id, selectedDate)
    }
    setDatePickerModal({ isOpen: false, habit: null })
  }

  const handleDeleteHabit = async (habitId) => {
    if (deletingHabit === habitId) return
    
    setDeletingHabit(habitId)
    try {
      await deleteHabit(habitId)
      await loadHabitsAndProgress() // Refresh data
      setExpandedHabit(null) // Close expanded view
    } catch (error) {
      console.error('Error deleting habit:', error)
      alert('Failed to delete habit. Please try again.')
    } finally {
      setDeletingHabit(null)
    }
  }

  const toggleHabitExpanded = (habitId) => {
    setExpandedHabit(expandedHabit === habitId ? null : habitId)
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
          <div className="flex items-center space-x-3">
            <Logo size={32} />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Habits</h1>
              <p className="text-sm text-gray-600">{format(new Date(), 'EEEE, MMMM d')}</p>
            </div>
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
            const isLogging = loggingHabit === habit.id
            const isUnlogging = unloggingHabit === habit.id
            const isDeleting = deletingHabit === habit.id
            const isExpanded = expandedHabit === habit.id
            const todayLogCount = getTodayLogCount(habit.id, progress.logs || [])
            
            // Simple button view (default)
            if (!isExpanded) {
              return (
                <button
                  key={habit.id}
                  onClick={() => handleLogHabit(habit.id)}
                  onTouchStart={() => handleLongPressStart(habit)}
                  onTouchEnd={handleLongPressEnd}
                  onMouseDown={() => handleLongPressStart(habit)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  disabled={isLogging}
                  className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 tap-highlight-none ${
                    todayLogCount > 0
                      ? 'bg-green-50 border-green-200 text-green-900'
                      : progress.isOnTrack
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                  } disabled:opacity-60`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{habit.title}</h3>
                      <div className="flex items-center space-x-3 text-sm opacity-75">
                        <span>{getFrequencyDisplay(habit)}</span>
                        {todayLogCount > 0 && (
                          <span className="font-medium">✓ {todayLogCount}x today</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {isLogging ? (
                        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : todayLogCount > 0 ? (
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <Check size={18} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center opacity-30">
                          <Check size={18} />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            }
            
            // Detailed view (expanded)
            return (
              <div
                key={habit.id}
                className="bg-white rounded-xl border-2 border-blue-200 overflow-hidden"
              >
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">{habit.title}</h3>
                    <button
                      onClick={() => setExpandedHabit(null)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg tap-highlight-none"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {habit.description && (
                    <p className="text-sm text-blue-700 mt-2">{habit.description}</p>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      <span>{getFrequencyDisplay(habit)}</span>
                      {progress.completedCount !== undefined && (
                        <span className="ml-3">
                          {progress.completedCount}/{progress.requiredCount} done this period
                        </span>
                      )}
                      {todayLogCount > 0 && (
                        <span className="ml-3 text-green-600 font-medium">
                          ✓ {todayLogCount}x today
                        </span>
                      )}
                    </div>
                  </div>

                  {progress.progressPercentage !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress this period</span>
                        <span className={`font-medium ${getProgressColor(progress)}`}>
                          {Math.round(progress.progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
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
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleLogHabit(habit.id)}
                        disabled={isLogging}
                        className="flex-1 py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors tap-highlight-none"
                      >
                        {isLogging ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Logging...
                          </div>
                        ) : (
                          'Mark as Done Today'
                        )}
                      </button>
                      
                      {todayLogCount > 0 && (
                        <button
                          onClick={() => handleUnlogHabit(habit.id)}
                          disabled={isUnlogging}
                          className="px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors tap-highlight-none"
                        >
                          {isUnlogging ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Undo2 size={16} />
                          )}
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setDatePickerModal({ isOpen: true, habit })}
                      className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors tap-highlight-none flex items-center justify-center"
                    >
                      <Calendar size={16} className="mr-2" />
                      Log for Past Date
                    </button>
                  </div>
                  
                  {progress.logs && progress.logs.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Recent completions ({progress.logs.length} total)
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {progress.logs.slice(0, 10).map((log) => (
                          <div key={log.id} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-gray-700">
                              {format(new Date(log.completed_at), 'EEE, MMM d, yyyy')}
                            </span>
                            <span className="text-gray-500">
                              {format(new Date(log.completed_at), 'h:mm a')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      disabled={isDeleting}
                      className="w-full flex items-center justify-center space-x-2 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors tap-highlight-none disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          <span>Delete Habit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <DatePickerModal
        isOpen={datePickerModal.isOpen}
        onClose={() => setDatePickerModal({ isOpen: false, habit: null })}
        onConfirm={handleDatePickerConfirm}
        habitTitle={datePickerModal.habit?.title || ''}
      />
    </div>
  )
}