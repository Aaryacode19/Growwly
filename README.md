# Growwly - Daily Progress Tracker

A modern, minimalist daily progress tracking application built with React, TypeScript, and Supabase.

## Features

- **Daily Progress Tracking**: Log your daily achievements with text, images, and links
- **Multiple Entries Per Day**: Add multiple progress entries for the same day
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Image Upload**: Upload and display images with your progress entries
- **Statistics Dashboard**: Track your progress with streak counters and activity stats
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: Built-in user authentication with Supabase
- **Access Request System**: Controlled access with admin approval workflow

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd growwly-daily-progress-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your Supabase credentials in the `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

## Database Schema

The application uses the following main tables:

- `profiles`: User profile information
- `daily_progress`: Daily progress entries
- `access_requests`: Access request management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.