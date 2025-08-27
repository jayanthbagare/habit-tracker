class HabitTracker {
    constructor() {
        this.habits = this.loadHabitsSecurely();
        this.currentScreen = 'track';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCurrentScreen();
        this.setupNotifications();
        this.scheduleNotificationChecks();
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        const setupListeners = () => {
            // Navigation
            const navTrack = document.getElementById('nav-track');
            const navHabits = document.getElementById('nav-habits');
            const navDashboard = document.getElementById('nav-dashboard');
            
            if (navTrack) navTrack.addEventListener('click', () => this.switchScreen('track'));
            if (navHabits) navHabits.addEventListener('click', () => this.switchScreen('habits'));
            if (navDashboard) navDashboard.addEventListener('click', () => this.switchScreen('dashboard'));

            // Modal
            const addHabitBtn = document.getElementById('add-habit-btn');
            const closeModal = document.getElementById('close-modal');
            const cancelHabit = document.getElementById('cancel-habit');
            const habitModal = document.getElementById('habit-modal');
            const habitForm = document.getElementById('habit-form');
            
            if (addHabitBtn) addHabitBtn.addEventListener('click', () => this.showModal());
            if (closeModal) closeModal.addEventListener('click', () => this.hideModal());
            if (cancelHabit) cancelHabit.addEventListener('click', () => this.hideModal());
            if (habitForm) habitForm.addEventListener('submit', (e) => this.addHabit(e));

            // Click outside modal to close
            if (habitModal) {
                habitModal.addEventListener('click', (e) => {
                    if (e.target.id === 'habit-modal') {
                        this.hideModal();
                    }
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupListeners);
        } else {
            setupListeners();
        }
    }

    switchScreen(screen) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`nav-${screen}`).classList.add('active');

        // Update screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`${screen}-screen`).classList.add('active');

        this.currentScreen = screen;
        this.renderCurrentScreen();
    }

    renderCurrentScreen() {
        switch (this.currentScreen) {
            case 'track':
                this.renderTrackScreen();
                break;
            case 'habits':
                this.renderHabitsScreen();
                break;
            case 'dashboard':
                this.renderDashboard();
                break;
        }
    }

    renderTrackScreen() {
        const habitsList = document.getElementById('habits-list');
        
        if (this.habits.length === 0) {
            habitsList.innerHTML = '<p class="empty-state">No habits yet. Add some habits to get started!</p>';
            return;
        }

        const today = new Date();
        const todayHabits = this.habits.filter(habit => this.isHabitDueToday(habit, today));

        if (todayHabits.length === 0) {
            habitsList.innerHTML = '<p class="empty-state">No habits due today. Great job!</p>';
            return;
        }

        habitsList.innerHTML = '';
        todayHabits.forEach(habit => {
            const habitElement = this.renderHabitItem(habit);
            habitsList.appendChild(habitElement);
        });
    }

    renderHabitItem(habit) {
        const progress = this.getHabitProgress(habit);
        const status = this.getHabitStatus(habit);
        const isCompletedToday = this.isHabitCompletedToday(habit);
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-item';
        
        habitElement.innerHTML = `
            <div class="habit-header">
                <div>
                    <div class="habit-name">${this.escapeHtml(habit.name)}</div>
                    <div class="habit-frequency">${habit.count}x ${this.escapeHtml(habit.frequency)}</div>
                </div>
                <div class="habit-status ${status.class}">${this.escapeHtml(status.text)}</div>
            </div>
            <div class="habit-progress">
                <div class="progress-info">
                    ${progress.completed}/${progress.required} this ${habit.frequency === 'daily' ? 'day' : this.getPeriodName(habit.frequency)}
                </div>
            </div>
        `;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = `habit-check-btn ${isCompletedToday ? 'completed' : ''}`;
        toggleButton.textContent = isCompletedToday ? '✓' : '○';
        toggleButton.addEventListener('click', () => this.toggleHabit(habit.id));
        
        habitElement.querySelector('.habit-progress').appendChild(toggleButton);
        return habitElement;
    }

    renderHabitsScreen() {
        const habitsList = document.getElementById('manage-habits-list');
        
        if (this.habits.length === 0) {
            habitsList.innerHTML = '<p class="empty-state">No habits defined yet.</p>';
            return;
        }

        habitsList.innerHTML = '';
        this.habits.forEach(habit => {
            const habitElement = document.createElement('div');
            habitElement.className = 'manage-habit-item';
            
            habitElement.innerHTML = `
                <div class="manage-habit-info">
                    <h4>${this.escapeHtml(habit.name)}</h4>
                    <div class="manage-habit-meta">${habit.count}x ${this.escapeHtml(habit.frequency)}</div>
                </div>
                <div class="manage-habit-actions">
                </div>
            `;
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => this.deleteHabit(habit.id));
            
            habitElement.querySelector('.manage-habit-actions').appendChild(deleteButton);
            habitsList.appendChild(habitElement);
        });
    }

    renderDashboard() {
        const onTrackCount = this.habits.filter(habit => this.getHabitStatus(habit).type === 'on-track').length;
        const behindCount = this.habits.filter(habit => this.getHabitStatus(habit).type === 'behind').length;
        const totalHabits = this.habits.length;

        const onTrackEl = document.getElementById('on-track-count');
        const behindEl = document.getElementById('behind-count');
        const totalEl = document.getElementById('total-habits');
        
        if (onTrackEl) onTrackEl.textContent = onTrackCount;
        if (behindEl) behindEl.textContent = behindCount;
        if (totalEl) totalEl.textContent = totalHabits;

        this.renderSlippages();
    }

    renderSlippages() {
        const slippagesContainer = document.getElementById('slippages-list');
        if (!slippagesContainer) return;
        
        const slippagesList = slippagesContainer.querySelector('.slippages-content');
        if (!slippagesList) return;
        
        const behindHabits = this.habits.filter(habit => this.getHabitStatus(habit).type === 'behind');

        if (behindHabits.length === 0) {
            slippagesList.innerHTML = '<p class="empty-state">No slippages to report!</p>';
            return;
        }

        slippagesList.innerHTML = behindHabits.map(habit => {
            const progress = this.getHabitProgress(habit);
            const deficit = progress.required - progress.completed;
            
            return `
                <div class="slippage-item">
                    <div class="slippage-name">${this.escapeHtml(habit.name)}</div>
                    <div class="slippage-details">
                        Behind by ${deficit} ${deficit === 1 ? 'completion' : 'completions'} this ${this.getPeriodName(habit.frequency)}
                    </div>
                </div>
            `;
        }).join('');
    }

    escapeHtml(text) {
        if (typeof text !== 'string') {
            return String(text);
        }
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }
        return input.trim().replace(/[<>"'&]/g, (match) => {
            const entityMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return entityMap[match];
        });
    }

    generateSecureId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return `${timestamp}_${random}`;
    }

    validateHabitData(habit) {
        if (!habit || typeof habit !== 'object') {
            return false;
        }
        
        const requiredFields = ['id', 'name', 'frequency', 'count', 'createdAt', 'completions'];
        for (const field of requiredFields) {
            if (!(field in habit)) {
                return false;
            }
        }
        
        if (typeof habit.name !== 'string' || habit.name.length > 100) {
            return false;
        }
        
        const validFrequencies = ['daily', 'weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly'];
        if (!validFrequencies.includes(habit.frequency)) {
            return false;
        }
        
        if (!Number.isInteger(habit.count) || habit.count < 1 || habit.count > 100) {
            return false;
        }
        
        if (!Array.isArray(habit.completions)) {
            return false;
        }
        
        return true;
    }

    showModal() {
        const modal = document.getElementById('habit-modal');
        const nameField = document.getElementById('habit-name');
        
        if (modal) modal.classList.add('show');
        if (nameField) {
            setTimeout(() => nameField.focus(), 100);
        }
    }

    hideModal() {
        const modal = document.getElementById('habit-modal');
        const form = document.getElementById('habit-form');
        
        if (modal) modal.classList.remove('show');
        if (form) form.reset();
    }

    addHabit(e) {
        e.preventDefault();
        
        try {
            const nameField = document.getElementById('habit-name');
            const frequencyField = document.getElementById('habit-frequency');
            const countField = document.getElementById('habit-count');
            const descriptionField = document.getElementById('habit-description');
            
            if (!nameField || !frequencyField || !countField || !descriptionField) {
                throw new Error('Form fields not found');
            }
            
            const name = this.sanitizeInput(nameField.value);
            const frequency = frequencyField.value;
            const count = parseInt(countField.value);
            const description = this.sanitizeInput(descriptionField.value);

            // Enhanced validation
            if (!name || name.length === 0) {
                alert('Please enter a habit name');
                nameField.focus();
                return;
            }
            
            if (name.length > 100) {
                alert('Habit name cannot exceed 100 characters');
                nameField.focus();
                return;
            }
            
            const validFrequencies = ['daily', 'weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly'];
            if (!frequency || !validFrequencies.includes(frequency)) {
                alert('Please select a valid frequency');
                frequencyField.focus();
                return;
            }
            
            if (!count || count < 1) {
                alert('Please enter a valid count (1 or more)');
                countField.focus();
                return;
            }
            
            if (count > 100) {
                alert('Count cannot exceed 100');
                countField.focus();
                return;
            }
            
            if (description.length > 500) {
                alert('Description cannot exceed 500 characters');
                descriptionField.focus();
                return;
            }

            const habit = {
                id: this.generateSecureId(),
                name,
                frequency,
                count,
                description,
                createdAt: new Date().toISOString(),
                completions: []
            };
            
            if (!this.validateHabitData(habit)) {
                alert('Invalid habit data. Please check your inputs.');
                return;
            }

            this.habits.push(habit);
            this.saveHabits();
            this.hideModal();
            this.renderCurrentScreen();
        } catch (error) {
            console.error('Error adding habit:', error);
            alert('An error occurred while adding the habit. Please try again.');
        }
    }

    deleteHabit(id) {
        if (confirm('Are you sure you want to delete this habit?')) {
            this.habits = this.habits.filter(habit => habit.id !== id);
            this.saveHabits();
            this.renderCurrentScreen();
        }
    }

    toggleHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        const today = new Date().toDateString();
        const existingIndex = habit.completions.findIndex(c => 
            new Date(c.date).toDateString() === today
        );

        if (existingIndex >= 0) {
            // Remove completion
            habit.completions.splice(existingIndex, 1);
        } else {
            // Add completion
            habit.completions.push({
                date: new Date().toISOString(),
                timestamp: Date.now()
            });
        }

        this.saveHabits();
        this.renderCurrentScreen();
    }

    getHabitProgress(habit) {
        const now = new Date();
        const periodStart = this.getPeriodStart(habit.frequency, now);
        
        const completionsInPeriod = habit.completions.filter(completion => {
            const completionDate = new Date(completion.date);
            return completionDate >= periodStart && completionDate <= now;
        }).length;

        return {
            completed: completionsInPeriod,
            required: habit.count
        };
    }

    getHabitStatus(habit) {
        const progress = this.getHabitProgress(habit);
        
        if (progress.completed >= progress.required) {
            return { type: 'on-track', text: 'On Track', class: 'status-on-track' };
        } else if (progress.completed > progress.required) {
            return { type: 'ahead', text: 'Ahead', class: 'status-ahead' };
        } else {
            return { type: 'behind', text: 'Behind', class: 'status-behind' };
        }
    }

    isHabitDueToday(habit, date) {
        // Daily habits are always due
        if (habit.frequency === 'daily') return true;
        
        // For other frequencies, check if we're in an active period
        const periodStart = this.getPeriodStart(habit.frequency, date);
        const progress = this.getHabitProgress(habit);
        
        // Show habit if we haven't completed the required amount this period
        return progress.completed < progress.required;
    }

    isHabitCompletedToday(habit) {
        const today = new Date().toDateString();
        return habit.completions.some(completion => 
            new Date(completion.date).toDateString() === today
        );
    }

    getPeriodStart(frequency, date) {
        const start = new Date(date);
        
        switch (frequency) {
            case 'daily':
                start.setHours(0, 0, 0, 0);
                break;
            case 'weekly':
                const dayOfWeek = start.getDay();
                start.setDate(start.getDate() - dayOfWeek);
                start.setHours(0, 0, 0, 0);
                break;
            case 'fortnightly':
                const weekOfYear = Math.floor((start - new Date(start.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
                const fortnightStart = weekOfYear - (weekOfYear % 2);
                start.setTime(new Date(start.getFullYear(), 0, 1).getTime() + fortnightStart * 7 * 24 * 60 * 60 * 1000);
                start.setHours(0, 0, 0, 0);
                break;
            case 'monthly':
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                break;
            case 'quarterly':
                const quarter = Math.floor(start.getMonth() / 3);
                start.setMonth(quarter * 3, 1);
                start.setHours(0, 0, 0, 0);
                break;
            case 'yearly':
                start.setMonth(0, 1);
                start.setHours(0, 0, 0, 0);
                break;
        }
        
        return start;
    }

    getPeriodName(frequency) {
        switch (frequency) {
            case 'daily': return 'day';
            case 'weekly': return 'week';
            case 'fortnightly': return 'fortnight';
            case 'monthly': return 'month';
            case 'quarterly': return 'quarter';
            case 'yearly': return 'year';
            default: return 'period';
        }
    }

    loadHabitsSecurely() {
        try {
            const storedHabits = localStorage.getItem('habits');
            if (!storedHabits) {
                return [];
            }
            
            const parsed = JSON.parse(storedHabits);
            if (!Array.isArray(parsed)) {
                console.warn('Invalid habits data format in localStorage');
                return [];
            }
            
            const validHabits = parsed.filter(habit => this.validateHabitData(habit));
            if (validHabits.length !== parsed.length) {
                console.warn('Some invalid habits were filtered out from localStorage');
            }
            
            return validHabits;
        } catch (error) {
            console.error('Error loading habits from localStorage:', error);
            return [];
        }
    }

    saveHabits() {
        try {
            const validatedHabits = this.habits.filter(habit => this.validateHabitData(habit));
            localStorage.setItem('habits', JSON.stringify(validatedHabits));
        } catch (error) {
            console.error('Error saving habits to localStorage:', error);
            alert('Failed to save habits. Your changes may be lost.');
        }
    }

    // Notification system
    setupNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            Notification.requestPermission();
        }
    }

    scheduleNotificationChecks() {
        // Check for notifications every hour
        setInterval(() => {
            this.checkForNotifications();
        }, 60 * 60 * 1000);

        // Initial check
        setTimeout(() => {
            this.checkForNotifications();
        }, 5000);
    }

    checkForNotifications() {
        if (Notification.permission !== 'granted') return;

        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 5 = Friday

        this.habits.forEach(habit => {
            const progress = this.getHabitProgress(habit);
            const status = this.getHabitStatus(habit);

            if (status.type === 'behind') {
                let shouldNotify = false;
                let message = '';

                switch (habit.frequency) {
                    case 'daily':
                        // Notify at 9 PM if habit not completed
                        if (hour === 21) {
                            shouldNotify = true;
                            message = `Don't forget to complete "${habit.name}" today!`;
                        }
                        break;
                    case 'weekly':
                        // Notify on Friday afternoon if behind
                        if (dayOfWeek === 5 && hour === 15) {
                            shouldNotify = true;
                            message = `You're behind on "${habit.name}" this week. ${progress.completed}/${progress.required} completed.`;
                        }
                        break;
                    case 'monthly':
                        // Notify on the 25th of each month
                        if (now.getDate() === 25 && hour === 10) {
                            shouldNotify = true;
                            message = `Monthly reminder: "${habit.name}" needs attention. ${progress.completed}/${progress.required} completed.`;
                        }
                        break;
                }

                if (shouldNotify && this.shouldSendNotification(habit.id, habit.frequency)) {
                    this.sendNotification(message, habit);
                    this.markNotificationSent(habit.id, habit.frequency);
                }
            }
        });
    }

    shouldSendNotification(habitId, frequency) {
        const key = `notification_${habitId}_${frequency}`;
        const lastSent = localStorage.getItem(key);
        
        if (!lastSent) return true;
        
        const lastSentDate = new Date(lastSent);
        const now = new Date();
        
        // Don't send more than once per day for any habit
        return now.toDateString() !== lastSentDate.toDateString();
    }

    markNotificationSent(habitId, frequency) {
        const key = `notification_${habitId}_${frequency}`;
        localStorage.setItem(key, new Date().toISOString());
    }

    sendNotification(message, habit) {
        if (Notification.permission === 'granted') {
            new Notification('Habit Tracker Reminder', {
                body: message,
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzJkMmQyZCIvPgo8cGF0aCBkPSJNOCAxNkwxMiAyMEwyNCAxMiIgc3Ryb2tlPSIjZjlmYWZiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K',
                tag: habit.id
            });
        }
    }
}

// Initialize the app
let habitTracker;

document.addEventListener('DOMContentLoaded', () => {
    habitTracker = new HabitTracker();
});

// Service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}