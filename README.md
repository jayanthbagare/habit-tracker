# Habit Tracker

A minimalistic, shame-based habit tracker built with React and localStorage.

## Features

### Technical Features
- ✅ Local storage for data persistence
- ✅ Minimalistic gray-themed design
- ✅ Mobile-first responsive design
- ✅ PWA with offline support
- ✅ Easy deployment to GitHub Pages/Netlify/S3
- ✅ No authentication required - works instantly

### Functional Features
- ✅ Define habits with multiple frequencies (daily, weekly, fortnightly, monthly, quarterly, yearly)
- ✅ Smart habit logging with progress tracking
- ✅ Timeline evaluation and count criteria
- ✅ Notification system with intelligent reminders
- ✅ Single-hand optimized mobile interface
- ✅ Shaming dashboard for motivation
- ✅ Progress reports and slippage tracking

## Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd habit-tracker
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## Deployment Options

### GitHub Pages
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. The included GitHub Action will automatically deploy on push to main

### Netlify
1. Connect your repository to Netlify
2. Build settings are configured in `netlify.toml`
3. Add environment variables in Netlify dashboard

### AWS S3
1. Build the project: `npm run build`
2. Upload `dist` folder contents to S3 bucket
3. Enable static website hosting
4. Configure CloudFront for SPA routing

## Data Storage

All data is stored locally in your browser's localStorage:

### Habits
- `id`: Unique identifier
- `title`: Habit name
- `description`: Optional description
- `frequency_type`: daily, weekly, fortnightly, monthly, quarterly, yearly
- `frequency_count`: Target count per period
- `reminder_time`: Time for daily reminders
- `reminder_day`: Day for weekly/fortnightly reminders
- `is_active`: Soft delete flag

### Habit Logs
- `id`: Unique identifier
- `habit_id`: References habits
- `completed_at`: Timestamp of completion
- `notes`: Optional notes

## Notification Schedule

- **Daily habits**: 9:00 PM (or custom time)
- **Weekly/Fortnightly habits**: Friday 2:00 PM (or custom day)
- **Monthly habits**: 25th of month 2:00 PM
- **Quarterly habits**: 2 weeks before quarter end
- **Yearly habits**: December 1st 2:00 PM

## Shame Dashboard Logic

The dashboard calculates overall performance and provides motivational (shaming) messages:
- **High shame** (< 40%): Harsh motivation
- **Medium shame** (40-70%): Moderate motivation  
- **Low shame** (> 70%): Encouraging messages

## License

MIT License