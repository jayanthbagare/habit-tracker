# Habit Tracker App

A minimalistic, mobile-first habit tracking application built with vanilla HTML, CSS, and JavaScript. Designed to be easily deployed to static hosting platforms like GitHub Pages, Netlify, or AWS S3.

## 🚀 Quick Start

### Option 1: Direct Download & Run
1. **Download**: Clone or download this repository to your computer
   ```bash
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```
2. **Run**: Simply double-click `index.html` or open it in any web browser
3. **Use**: Start adding and tracking your habits immediately!

### Option 2: Run Tests
1. Open `tests.html` in your browser to run the comprehensive test suite
2. Verify all functionality is working correctly

## 📱 Features

### Technical Features
- ✅ **Cross-device compatibility** - Works on multiple phones and tablets
- ✅ **Minimalistic design** - Clean typography in shades of gray
- ✅ **Mobile-optimized** - Touch-friendly responsive design
- ✅ **Easy deployment** - Static files ready for any hosting platform
- ✅ **Offline support** - Service worker for offline functionality
- ✅ **PWA ready** - Can be installed as a Progressive Web App
- ✅ **No dependencies** - Pure HTML, CSS, and JavaScript
- ✅ **Secure** - No external data transmission, works entirely offline

### Functional Features
- ✅ **Multiple habit frequencies** - Daily, weekly, fortnightly, monthly, quarterly, yearly
- ✅ **Smart tracking** - Evaluates timeline and count criteria (e.g., "practice guitar 3 times a week")
- ✅ **Intelligent notifications** - Browser notifications when habits are off track:
  - Daily habits: 9 PM reminder
  - Weekly habits: Friday afternoon reminder  
  - Monthly habits: 25th of the month reminder
- ✅ **Quick tracking** - Simple one-handed interface for marking habits
- ✅ **Dashboard & reports** - View slippages and track progress
- ✅ **Data persistence** - Local storage keeps data across browser sessions
- ✅ **Input validation** - Prevents invalid data entry
- ✅ **Error handling** - Graceful handling of edge cases

## 🌐 Deployment Options

### GitHub Pages (Free)
**Perfect for personal use and sharing with others**

1. **Create Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/habit-tracker.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Select source branch: `main`
   - Select folder: `/ (root)`
   - Click Save

3. **Access Your App**:
   - Available at: `https://yourusername.github.io/habit-tracker`
   - Usually takes 5-10 minutes to become available

### Netlify (Free)
**Best for easy deployment and custom domains**

#### Method 1: Drag & Drop (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Create a free account
3. Drag the entire project folder to the deployment area
4. Your app will be live at a random URL (e.g., `https://amazing-curie-123456.netlify.app`)

#### Method 2: Git Integration (Recommended)
1. Push code to GitHub (see GitHub Pages steps 1 above)
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "New site from Git"
4. Connect your GitHub repository
5. Deploy settings:
   - Branch: `main`
   - Build command: (leave empty)
   - Publish directory: (leave empty or put `/`)
6. Click "Deploy site"

#### Custom Domain (Optional)
1. In Netlify dashboard, go to Domain Settings
2. Add your custom domain
3. Follow DNS configuration instructions

### AWS S3 + CloudFront (Scalable)
**Best for high-traffic deployment**

1. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://your-habit-tracker-bucket --region us-east-1
   ```

2. **Upload Files**:
   ```bash
   aws s3 sync . s3://your-habit-tracker-bucket --delete
   ```

3. **Enable Static Website Hosting**:
   ```bash
   aws s3 website s3://your-habit-tracker-bucket --index-document index.html --error-document index.html
   ```

4. **Set Public Read Policy**:
   Create `bucket-policy.json`:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-habit-tracker-bucket/*"
       }
     ]
   }
   ```
   Apply policy:
   ```bash
   aws s3api put-bucket-policy --bucket your-habit-tracker-bucket --policy file://bucket-policy.json
   ```

5. **Optional: CloudFront Distribution** (for HTTPS and faster loading):
   - Create CloudFront distribution
   - Set origin to your S3 bucket
   - Enable HTTPS redirect

### Vercel (Free)
**Great for developers**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Firebase Hosting (Free)
**Good integration with other Google services**

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize and deploy:
   ```bash
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 🧪 Testing

### Running Tests
1. Open `tests.html` in your web browser
2. Tests will run automatically and show results
3. Check console for detailed output

### Test Coverage
- ✅ HabitTracker initialization
- ✅ Habit management (add/delete)
- ✅ Habit completion logic
- ✅ Period calculations
- ✅ Status determination
- ✅ Data persistence
- ✅ Notification system
- ✅ UI rendering
- ✅ Error handling
- ✅ Input validation

### Manual Testing Checklist
- [ ] Add different types of habits (daily, weekly, monthly, etc.)
- [ ] Mark habits as complete/incomplete
- [ ] Check dashboard shows correct statistics
- [ ] Test on mobile devices
- [ ] Verify offline functionality
- [ ] Test notification permissions
- [ ] Verify data persists after browser restart

## 📖 Usage Guide

### Adding Habits
1. **Navigate**: Go to the "Habits" tab
2. **Add**: Click the "Add Habit" button
3. **Fill Details**:
   - **Name**: Descriptive name (e.g., "Practice Guitar", "Read Books")
   - **Frequency**: Choose from daily, weekly, fortnightly, monthly, quarterly, yearly
   - **Count**: How many times per period (1-100)
   - **Description**: Optional notes about the habit
4. **Save**: Click "Add Habit" to save

### Tracking Habits
1. **Navigate**: Go to the "Track" tab to see today's habits
2. **Complete**: Tap the circle (○) to mark as complete (becomes ✓)
3. **Undo**: Tap the checkmark (✓) to undo completion
4. **Status**: View habit status (On Track, Behind, Ahead)
5. **Progress**: See completion progress for current period

### Managing Habits
1. **Navigate**: Go to the "Habits" tab
2. **View**: See all your defined habits
3. **Delete**: Click "Delete" to remove a habit (with confirmation)

### Viewing Dashboard
1. **Navigate**: Go to the "Dashboard" tab
2. **Statistics**: View overall progress statistics
3. **Slippages**: See habits that are behind schedule
4. **Action Items**: Identify what needs attention

## 💡 Habit Examples

### Daily Habits
- **Drink Water**: 8 glasses daily
- **Exercise**: 30 minutes daily
- **Read**: 20 minutes daily
- **Meditate**: 10 minutes daily

### Weekly Habits  
- **Gym Sessions**: 3x weekly
- **Social Calls**: 2x weekly
- **Meal Prep**: 1x weekly
- **Deep Cleaning**: 1x weekly

### Monthly Habits
- **Budget Review**: 1x monthly
- **Doctor Checkup**: 1x monthly
- **Family Visit**: 1x monthly
- **Car Maintenance**: 1x monthly

### Quarterly Habits
- **Investment Review**: 1x quarterly
- **Goal Assessment**: 1x quarterly
- **Wardrobe Update**: 1x quarterly

### Yearly Habits
- **Annual Physical**: 1x yearly
- **Tax Filing**: 1x yearly
- **Insurance Review**: 1x yearly

## 🔔 Smart Notifications

The app sends intelligent browser notifications when you're falling behind:

### Notification Schedule
- **Daily Habits**: 9:00 PM if not completed
- **Weekly Habits**: Friday 3:00 PM if behind
- **Monthly Habits**: 25th at 10:00 AM if behind

### Enabling Notifications
1. First visit: Browser will ask for notification permission
2. **Allow**: Click "Allow" to enable smart reminders
3. **Disable**: You can disable in browser settings anytime

### Notification Features
- **Smart Logic**: Only sends when you're actually behind
- **No Spam**: Maximum one notification per habit per day
- **Contextual**: Different timing for different habit types

## 💾 Data & Privacy

### Data Storage
- **Local Only**: All data stored in browser's localStorage
- **No Cloud**: Nothing transmitted to external servers
- **Privacy First**: Your habits stay completely private
- **Instant**: No internet required after first load

### Data Backup
Since data is local, consider these backup strategies:
1. **Export**: Copy localStorage data manually
2. **Multiple Devices**: Set up habits on each device separately
3. **Screenshots**: Take screenshots of important progress

### Data Limitations
- **Device-Specific**: Data doesn't sync across devices
- **Browser-Specific**: Data tied to specific browser
- **Clearing Data**: Browser cache clearing removes habits

## 🌐 Browser Support

### Fully Supported
- **Chrome/Edge**: Version 80+
- **Firefox**: Version 75+
- **Safari**: Version 13+
- **Mobile Browsers**: iOS Safari, Chrome Mobile

### Required Features
- localStorage API
- Service Workers
- CSS Grid and Flexbox
- ES6 JavaScript (classes, arrow functions, etc.)
- Notification API (optional)

### Graceful Degradation
- Works without Service Worker (no offline mode)
- Works without Notification API (no push notifications)
- Responsive design works on any screen size

## 🎨 Customization

### Color Scheme
Edit `styles.css` to customize colors:
```css
/* Main colors - edit these */
:root {
  --primary-color: #2d2d2d;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
}
```

### Typography
```css
/* Font customization */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
}
```

### Layout
- Modify CSS Grid layouts in `.stats-grid`
- Adjust spacing with padding/margin variables
- Change border radius for different visual style

## 📁 Project Structure

```
habit-tracker/
├── 📄 index.html          # Main HTML structure & UI components
├── 🎨 styles.css          # Complete styling & responsive design  
├── ⚙️  app.js              # Core JavaScript functionality
├── 🔄 sw.js               # Service worker (offline support)
├── 📱 manifest.json       # PWA manifest (app installation)
├── 🧪 tests.html          # Comprehensive test suite
└── 📖 README.md           # This documentation
```

## 🛠️ Development

### Local Development
1. **Clone**: `git clone <repository>`
2. **Open**: Open `index.html` in browser
3. **Edit**: Modify files and refresh browser
4. **Test**: Open `tests.html` to run tests

### Making Changes
- **HTML**: Edit structure in `index.html`
- **Styling**: Modify appearance in `styles.css`  
- **Logic**: Update functionality in `app.js`
- **Testing**: Add tests to `tests.html`

### Best Practices
- Test changes in `tests.html`
- Validate HTML and CSS
- Test on mobile devices
- Verify offline functionality

## 🤝 Contributing

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Areas for Improvement
- Additional habit frequencies
- Data export/import features
- Habit streaks and statistics
- Theme customization options
- Habit categories/tags

## 📄 License

**MIT License** - Free to use, modify, and distribute

## 🆘 Support

### Troubleshooting
- **App won't load**: Check browser console for errors
- **Data lost**: Check if browser data was cleared
- **Notifications not working**: Check browser permissions
- **Mobile issues**: Test in different mobile browsers

### Getting Help
- Check browser developer console for errors
- Verify all files are present and accessible
- Test in different browsers
- Review the comprehensive test suite

Your habit tracker is now ready for production use! 🎉