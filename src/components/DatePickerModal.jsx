import { useState } from 'react'
import { X, Calendar, Check } from 'lucide-react'
import { format, subDays, isAfter, startOfDay } from 'date-fns'

export default function DatePickerModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  habitTitle,
  maxDaysBack = 30 
}) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const today = new Date()
  
  if (!isOpen) return null

  const generateDateOptions = () => {
    const options = []
    for (let i = 0; i < maxDaysBack; i++) {
      const date = subDays(today, i)
      options.push(date)
    }
    return options
  }

  const handleConfirm = () => {
    onConfirm(selectedDate)
    onClose()
  }

  const isDateSelectable = (date) => {
    return !isAfter(startOfDay(date), startOfDay(today))
  }

  const getDateLabel = (date) => {
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    return format(date, 'MMM d, yyyy')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mark as Done</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 tap-highlight-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Select date for:</p>
            <p className="font-medium text-gray-900">{habitTitle}</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar size={16} className="inline mr-2" />
              When did you complete this habit?
            </label>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {generateDateOptions().map((date, index) => {
                const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                const isSelectable = isDateSelectable(date)
                
                return (
                  <label
                    key={index}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors tap-highlight-none ${
                      isSelected 
                        ? 'border-gray-900 bg-gray-50' 
                        : isSelectable
                        ? 'border-gray-200 hover:bg-gray-50'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="date"
                        value={format(date, 'yyyy-MM-dd')}
                        checked={isSelected}
                        onChange={() => isSelectable && setSelectedDate(date)}
                        disabled={!isSelectable}
                        className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getDateLabel(date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(date, 'EEEE, MMM d')}
                        </div>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Today
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors tap-highlight-none"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors tap-highlight-none flex items-center justify-center"
          >
            <Check size={16} className="mr-2" />
            Mark Done
          </button>
        </div>
      </div>
    </div>
  )
}