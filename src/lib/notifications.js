// Notification system for habit reminders
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function scheduleHabitReminder(habit, progressData) {
  if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') {
    return false
  }

  const now = new Date()
  const progress = progressData.find(p => p.habit.id === habit.id)
  
  // Don't remind if already completed for the period
  if (progress?.isOnTrack) {
    return false
  }

  let reminderTime = new Date()
  let message = `Time to work on "${habit.title}"`

  switch (habit.frequency_type) {
    case 'daily':
      if (habit.reminder_time) {
        const [hours, minutes] = habit.reminder_time.split(':')
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        
        // If time has passed today, schedule for tomorrow
        if (reminderTime <= now) {
          reminderTime.setDate(reminderTime.getDate() + 1)
        }
      } else {
        // Default to 9 PM
        reminderTime.setHours(21, 0, 0, 0)
        if (reminderTime <= now) {
          reminderTime.setDate(reminderTime.getDate() + 1)
        }
      }
      message += ` - Don't let today slip by!`
      break

    case 'weekly':
    case 'fortnightly':
      // Schedule for Friday afternoon (2 PM) or specified day
      const targetDay = habit.reminder_day || 5 // Default to Friday
      const daysUntilTarget = (targetDay - now.getDay() + 7) % 7
      reminderTime.setDate(now.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget))
      reminderTime.setHours(14, 0, 0, 0)
      message += ` - Week's almost over!`
      break

    case 'monthly':
      // Remind on the 25th of each month at 2 PM
      reminderTime.setDate(25)
      reminderTime.setHours(14, 0, 0, 0)
      if (reminderTime <= now) {
        reminderTime.setMonth(reminderTime.getMonth() + 1)
      }
      message += ` - Month's almost done!`
      break

    case 'quarterly':
      // Remind 2 weeks before quarter end
      const quarterEndMonth = Math.ceil((now.getMonth() + 1) / 3) * 3
      reminderTime = new Date(now.getFullYear(), quarterEndMonth - 1, 15, 14, 0, 0)
      if (reminderTime <= now) {
        reminderTime = new Date(now.getFullYear(), quarterEndMonth + 2, 15, 14, 0, 0)
      }
      message += ` - Quarter's ending soon!`
      break

    case 'yearly':
      // Remind on December 1st
      reminderTime = new Date(now.getFullYear(), 11, 1, 14, 0, 0)
      if (reminderTime <= now) {
        reminderTime = new Date(now.getFullYear() + 1, 11, 1, 14, 0, 0)
      }
      message += ` - Year's almost over!`
      break
  }

  // Store reminder info for service worker
  const reminderData = {
    id: `habit-${habit.id}-${Date.now()}`,
    habitId: habit.id,
    title: habit.title,
    message,
    scheduledTime: reminderTime.getTime(),
    frequencyType: habit.frequency_type
  }

  // Store in localStorage for service worker to access
  const existingReminders = JSON.parse(localStorage.getItem('habitReminders') || '[]')
  const updatedReminders = existingReminders.filter(r => r.habitId !== habit.id) // Remove existing for this habit
  updatedReminders.push(reminderData)
  localStorage.setItem('habitReminders', JSON.stringify(updatedReminders))

  console.log(`Reminder scheduled for ${habit.title} at ${reminderTime.toLocaleString()}`)
  return true
}

export function scheduleAllHabitReminders(habits, progressData) {
  if (!requestNotificationPermission()) {
    return
  }

  habits.forEach(habit => {
    scheduleHabitReminder(habit, progressData)
  })
}

export function showNotification(title, message, options = {}) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: message,
      icon: '/icon-192x192.png', // We'll need to add this
      badge: '/icon-192x192.png',
      tag: options.tag || 'habit-reminder',
      requireInteraction: true,
      ...options
    })

    notification.onclick = function() {
      window.focus()
      this.close()
      
      // Navigate to the app
      if ('clients' in navigator.serviceWorker) {
        navigator.serviceWorker.controller?.postMessage({
          type: 'NOTIFICATION_CLICKED',
          habitId: options.habitId
        })
      }
    }

    return notification
  }
}