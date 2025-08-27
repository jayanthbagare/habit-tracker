// Service Worker for handling notifications and offline functionality
const CACHE_NAME = 'habit-tracker-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

// Fetch event for offline functionality
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// Check for habit reminders periodically
self.addEventListener('message', event => {
  if (event.data.type === 'CHECK_REMINDERS') {
    checkHabitReminders()
  }
})

function checkHabitReminders() {
  try {
    // Get reminders from storage (we'll use IndexedDB in production)
    const reminders = JSON.parse(localStorage.getItem('habitReminders') || '[]')
    const now = Date.now()
    
    reminders.forEach(reminder => {
      if (reminder.scheduledTime <= now && !reminder.sent) {
        showHabitNotification(reminder)
        reminder.sent = true
      }
    })
    
    // Update storage
    localStorage.setItem('habitReminders', JSON.stringify(reminders))
  } catch (error) {
    console.error('Error checking reminders:', error)
  }
}

function showHabitNotification(reminder) {
  const options = {
    body: reminder.message,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: `habit-${reminder.habitId}`,
    requireInteraction: true,
    actions: [
      {
        action: 'mark-done',
        title: 'Mark as Done'
      },
      {
        action: 'open-app',
        title: 'Open App'
      }
    ],
    data: {
      habitId: reminder.habitId,
      type: 'habit-reminder'
    }
  }

  self.registration.showNotification('Habit Reminder', options)
}

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'mark-done') {
    // Handle marking habit as done (would need API call)
    console.log('Mark habit as done:', event.notification.data.habitId)
  } else {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          for (let client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus()
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/')
          }
        })
    )
  }
})

// Set up periodic reminder checks
setInterval(checkHabitReminders, 60000) // Check every minute