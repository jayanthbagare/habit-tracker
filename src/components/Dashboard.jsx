import { useState, useEffect } from 'react'
import { TrendingDown, AlertTriangle, Target, Calendar, Clock, Frown, Meh, Smile } from 'lucide-react'
import { getAllHabitsProgress, getHabits } from '../lib/localStorage'
import { format, subDays, subWeeks, subMonths } from 'date-fns'

const shamingMessages = {
  high: [
    "Seriously? This is embarrassing.",
    "Your habits are in shambles.",
    "What happened to your commitment?",
    "This is not the person you wanted to be.",
    "Your future self is disappointed."
  ],
  medium: [
    "Could be better, could be worse.",
    "Mediocre effort deserves mediocre results.",
    "You're coasting through life.",
    "Half-hearted attempts, half-hearted results."
  ],
  low: [
    "Not terrible, but room for improvement.",
    "You're doing okay, but why settle for okay?",
    "Good habits are building, keep going.",
    "Progress is progress, even if slow."
  ]
}

export default function Dashboard() {
  const [progressData, setProgressData] = useState([])
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('current') // current, week, month

  useEffect(() => {
    loadData()
  }, [timeframe])

  const loadData = async () => {
    try {
      let referenceDate = new Date()
      
      if (timeframe === 'week') {
        referenceDate = subDays(new Date(), 7)
      } else if (timeframe === 'month') {
        referenceDate = subMonths(new Date(), 1)
      }

      const [progressData, habitsData] = await Promise.all([
        getAllHabitsProgress(referenceDate),
        getHabits()
      ])
      
      setProgressData(progressData)
      setHabits(habitsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOverallStats = () => {
    if (progressData.length === 0) return { onTrack: 0, behind: 0, failing: 0, totalHabits: 0 }
    
    const stats = progressData.reduce((acc, progress) => {
      acc.totalHabits++
      if (progress.isOnTrack) {
        acc.onTrack++
      } else if (progress.progressPercentage >= 50) {
        acc.behind++
      } else {
        acc.failing++
      }
      return acc
    }, { onTrack: 0, behind: 0, failing: 0, totalHabits: 0 })

    return stats
  }

  const getFailingHabits = () => {
    return progressData.filter(p => !p.isOnTrack).sort((a, b) => a.progressPercentage - b.progressPercentage)
  }

  const getOverallScore = () => {
    if (progressData.length === 0) return 0
    const totalScore = progressData.reduce((sum, progress) => sum + progress.progressPercentage, 0)
    return Math.round(totalScore / progressData.length)
  }

  const getShamingLevel = (score) => {
    if (score < 40) return 'high'
    if (score < 70) return 'medium'
    return 'low'
  }

  const getShamingMessage = (level) => {
    const messages = shamingMessages[level]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getEmoji = (level) => {
    switch (level) {
      case 'high': return <Frown size={24} className="text-red-600" />
      case 'medium': return <Meh size={24} className="text-yellow-600" />
      case 'low': return <Smile size={24} className="text-green-600" />
      default: return <Meh size={24} className="text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  const stats = getOverallStats()
  const failingHabits = getFailingHabits()
  const overallScore = getOverallScore()
  const shamingLevel = getShamingLevel(overallScore)
  const shamingMessage = getShamingMessage(shamingLevel)

  return (
    <div className="pb-24">
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Dashboard</h1>
          
          <div className="flex space-x-2 mb-4">
            {[
              { value: 'current', label: 'Current Period' },
              { value: 'week', label: 'Past Week' },
              { value: 'month', label: 'Past Month' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeframe(option.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium tap-highlight-none ${
                  timeframe === option.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {stats.totalHabits === 0 ? (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
            <p className="text-gray-600">Create some habits to see your progress</p>
          </div>
        ) : (
          <>
            {/* Overall Score Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="flex justify-center mb-3">
                {getEmoji(shamingLevel)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{overallScore}%</div>
              <div className="text-sm font-medium text-gray-600 mb-3">Overall Performance</div>
              <div className={`text-sm font-medium mb-4 ${
                shamingLevel === 'high' ? 'text-red-700' :
                shamingLevel === 'medium' ? 'text-yellow-700' :
                'text-green-700'
              }`}>
                {shamingMessage}
              </div>
              <div className={`w-full h-3 rounded-full ${
                shamingLevel === 'high' ? 'bg-red-200' :
                shamingLevel === 'medium' ? 'bg-yellow-200' :
                'bg-green-200'
              }`}>
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    shamingLevel === 'high' ? 'bg-red-500' :
                    shamingLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.onTrack}</div>
                <div className="text-xs text-gray-600">On Track</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.behind}</div>
                <div className="text-xs text-gray-600">Behind</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{stats.failing}</div>
                <div className="text-xs text-gray-600">Failing</div>
              </div>
            </div>

            {/* Shame List - Failing Habits */}
            {failingHabits.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-red-50 border-b border-red-100 p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={20} className="text-red-600" />
                    <h3 className="font-semibold text-red-900">Hall of Shame</h3>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    These habits are letting you down the most
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {failingHabits.map((progress, index) => (
                    <div key={progress.habit.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0 ? 'bg-red-600' :
                            index === 1 ? 'bg-red-500' :
                            index === 2 ? 'bg-red-400' :
                            'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-gray-900">{progress.habit.title}</h4>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          {Math.round(progress.progressPercentage)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span>
                          {progress.completedCount}/{progress.requiredCount} completed
                        </span>
                        <span>
                          {format(progress.periodStart, 'MMM d')} - {format(new Date(progress.periodEnd.getTime() - 1), 'MMM d')}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
                        />
                      </div>
                      
                      {index === 0 && progress.progressPercentage < 20 && (
                        <div className="mt-2 text-xs text-red-700 font-medium">
                          🏆 Worst performing habit - time to step up!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Habits Progress */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">All Habits</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {progressData.map((progress) => (
                  <div key={progress.habit.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{progress.habit.title}</h4>
                      <span className={`text-sm font-medium ${
                        progress.isOnTrack ? 'text-green-600' :
                        progress.progressPercentage >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(progress.progressPercentage)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>
                        {progress.completedCount}/{progress.requiredCount} • 
                        {progress.habit.frequency_count}x {progress.habit.frequency_type}
                      </span>
                      <span>
                        {format(progress.periodStart, 'MMM d')} - {format(new Date(progress.periodEnd.getTime() - 1), 'MMM d')}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress.isOnTrack ? 'bg-green-500' :
                          progress.progressPercentage >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}