import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { createHabit } from '../lib/localStorage'

const frequencyOptions = [
  { value: 'daily', label: 'Daily', description: 'Every day' },
  { value: 'weekly', label: 'Weekly', description: 'Every week' },
  { value: 'fortnightly', label: 'Fortnightly', description: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Every month' },
  { value: 'quarterly', label: 'Quarterly', description: 'Every 3 months' },
  { value: 'yearly', label: 'Yearly', description: 'Every year' }
]

const reminderTimes = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00'
]

const weekDays = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' }
]

export default function CreateHabit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency_type: 'daily',
    frequency_count: 1,
    reminder_time: '21:00',
    reminder_day: 5 // Friday default for weekly reminders
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createHabit({
        ...formData,
        reminder_time: formData.frequency_type === 'daily' ? formData.reminder_time : null,
        reminder_day: ['weekly', 'fortnightly'].includes(formData.frequency_type) ? formData.reminder_day : null
      })
      navigate('/')
    } catch (error) {
      console.error('Error creating habit:', error)
      alert('Failed to create habit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getFrequencyLabel = (type) => {
    switch (type) {
      case 'daily': return 'times per day'
      case 'weekly': return 'times per week'
      case 'fortnightly': return 'times per 2 weeks'
      case 'monthly': return 'times per month'
      case 'quarterly': return 'times per quarter'
      case 'yearly': return 'times per year'
      default: return 'times'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-800 tap-highlight-none"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Create Habit</h1>
          <div className="w-8" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 pb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habit Name
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Practice guitar, Read book, Exercise"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Additional details about this habit..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Frequency
          </label>
          <div className="space-y-2">
            {frequencyOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 tap-highlight-none"
              >
                <input
                  type="radio"
                  name="frequency_type"
                  value={option.value}
                  checked={formData.frequency_type === option.value}
                  onChange={(e) => setFormData({ ...formData, frequency_type: e.target.value })}
                  className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Count
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="1"
              max="50"
              value={formData.frequency_count}
              onChange={(e) => setFormData({ ...formData, frequency_count: parseInt(e.target.value) })}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 text-center"
            />
            <span className="text-sm text-gray-600">
              {getFrequencyLabel(formData.frequency_type)}
            </span>
          </div>
        </div>

        {formData.frequency_type === 'daily' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Daily Reminder Time
            </label>
            <select
              value={formData.reminder_time}
              onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            >
              {reminderTimes.map((time) => (
                <option key={time} value={time}>
                  {time === '21:00' ? `${time} (Default - 9:00 PM)` : time}
                </option>
              ))}
            </select>
          </div>
        )}

        {['weekly', 'fortnightly'].includes(formData.frequency_type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Reminder Day
            </label>
            <select
              value={formData.reminder_day}
              onChange={(e) => setFormData({ ...formData, reminder_day: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            >
              {weekDays.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.value === 5 ? `${day.label} (Default)` : day.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors tap-highlight-none"
        >
          {loading ? 'Creating...' : 'Create Habit'}
        </button>
      </form>
    </div>
  )
}