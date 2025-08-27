import { startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear, subDays, subWeeks, subMonths, subQuarters, subYears, isWithinInterval, addDays, addWeeks, addMonths, addQuarters, addYears } from 'date-fns'

// Local storage keys
const HABITS_KEY = 'habit-tracker-habits'
const LOGS_KEY = 'habit-tracker-logs'

// Helper functions
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return []
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Habit CRUD operations
export async function createHabit(habit) {
  const habits = getFromStorage(HABITS_KEY)
  const newHabit = {
    ...habit,
    id: generateId(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  habits.push(newHabit)
  saveToStorage(HABITS_KEY, habits)
  return newHabit
}

export async function getHabits() {
  const habits = getFromStorage(HABITS_KEY)
  return habits.filter(habit => habit.is_active)
}

export async function updateHabit(id, updates) {
  const habits = getFromStorage(HABITS_KEY)
  const index = habits.findIndex(habit => habit.id === id)
  
  if (index === -1) {
    throw new Error('Habit not found')
  }
  
  habits[index] = {
    ...habits[index],
    ...updates,
    updated_at: new Date().toISOString()
  }
  
  saveToStorage(HABITS_KEY, habits)
  return habits[index]
}

export async function deleteHabit(id) {
  const habits = getFromStorage(HABITS_KEY)
  const index = habits.findIndex(habit => habit.id === id)
  
  if (index === -1) {
    throw new Error('Habit not found')
  }
  
  habits[index] = {
    ...habits[index],
    is_active: false,
    updated_at: new Date().toISOString()
  }
  
  saveToStorage(HABITS_KEY, habits)
}

// Habit log operations
export async function logHabit(habitId, notes = '') {
  const logs = getFromStorage(LOGS_KEY)
  const newLog = {
    id: generateId(),
    habit_id: habitId,
    notes,
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
  
  logs.push(newLog)
  saveToStorage(LOGS_KEY, logs)
  return newLog
}

export async function unlogHabit(habitId) {
  const logs = getFromStorage(LOGS_KEY)
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  
  // Find the most recent log for this habit today
  const todayLogs = logs
    .filter(log => 
      log.habit_id === habitId && 
      new Date(log.completed_at) >= startOfToday && 
      new Date(log.completed_at) < endOfToday
    )
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
  
  if (todayLogs.length > 0) {
    const mostRecentLog = todayLogs[0]
    const updatedLogs = logs.filter(log => log.id !== mostRecentLog.id)
    saveToStorage(LOGS_KEY, updatedLogs)
    return mostRecentLog
  }
  
  return null
}

export async function getHabitLogs(habitId, startDate, endDate) {
  const logs = getFromStorage(LOGS_KEY)
  let filteredLogs = logs.filter(log => log.habit_id === habitId)
  
  if (startDate) {
    filteredLogs = filteredLogs.filter(log => new Date(log.completed_at) >= startDate)
  }
  if (endDate) {
    filteredLogs = filteredLogs.filter(log => new Date(log.completed_at) <= endDate)
  }
  
  return filteredLogs.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
}

export async function getAllHabitLogs(startDate, endDate) {
  const logs = getFromStorage(LOGS_KEY)
  const habits = getFromStorage(HABITS_KEY)
  
  let filteredLogs = logs
  
  if (startDate) {
    filteredLogs = filteredLogs.filter(log => new Date(log.completed_at) >= startDate)
  }
  if (endDate) {
    filteredLogs = filteredLogs.filter(log => new Date(log.completed_at) <= endDate)
  }
  
  // Add habit info to logs
  const logsWithHabits = filteredLogs.map(log => {
    const habit = habits.find(h => h.id === log.habit_id)
    return {
      ...log,
      habits: habit ? {
        title: habit.title,
        frequency_type: habit.frequency_type,
        frequency_count: habit.frequency_count
      } : null
    }
  })
  
  return logsWithHabits.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
}

// Analytics and tracking functions
export function getPeriodStart(frequencyType, date = new Date()) {
  switch (frequencyType) {
    case 'daily':
      return startOfDay(date)
    case 'weekly':
      return startOfWeek(date, { weekStartsOn: 1 }) // Monday start
    case 'fortnightly':
      const weekStart = startOfWeek(date, { weekStartsOn: 1 })
      const weekNumber = Math.floor((date - startOfYear(date)) / (7 * 24 * 60 * 60 * 1000))
      return subWeeks(weekStart, weekNumber % 2)
    case 'monthly':
      return startOfMonth(date)
    case 'quarterly':
      return startOfQuarter(date)
    case 'yearly':
      return startOfYear(date)
    default:
      return startOfDay(date)
  }
}

export function getPeriodEnd(frequencyType, startDate) {
  switch (frequencyType) {
    case 'daily':
      return addDays(startDate, 1)
    case 'weekly':
      return addWeeks(startDate, 1)
    case 'fortnightly':
      return addWeeks(startDate, 2)
    case 'monthly':
      return addMonths(startDate, 1)
    case 'quarterly':
      return addQuarters(startDate, 1)
    case 'yearly':
      return addYears(startDate, 1)
    default:
      return addDays(startDate, 1)
  }
}

export async function getHabitProgress(habit, referenceDate = new Date()) {
  const periodStart = getPeriodStart(habit.frequency_type, referenceDate)
  const periodEnd = getPeriodEnd(habit.frequency_type, periodStart)
  
  const logs = await getHabitLogs(habit.id, periodStart, periodEnd)
  const completedCount = logs.length
  const requiredCount = habit.frequency_count
  
  const isOnTrack = completedCount >= requiredCount
  const progressPercentage = Math.min((completedCount / requiredCount) * 100, 100)
  
  return {
    habit,
    periodStart,
    periodEnd,
    completedCount,
    requiredCount,
    isOnTrack,
    progressPercentage,
    logs
  }
}

export async function getAllHabitsProgress(referenceDate = new Date()) {
  const habits = await getHabits()
  const progressData = await Promise.all(
    habits.map(habit => getHabitProgress(habit, referenceDate))
  )
  
  return progressData
}