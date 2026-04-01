# Gym Tracker (Gym Logger)

A Progressive Web App (PWA) designed for logging and tracking your gym workouts, built with modern web technologies to ensure a fast, responsive, and reliable experience.

## Features

- **Workout Logging**: Easily track your movements, sets, reps, and weights.
- **Progress Tracking**: Monitor your fitness journey over time.
- **PWA Support**: Installable on mobile devices with offline capabilities.
- **Authentication**: Secure login and synchronization across devices using Firebase Auth.
- **Dark/Light Theme**: A beautiful interface that adapts to your preferences.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database / Auth**: Firebase (Firestore & Firebase Authentication)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js version 18.x or later.
- A Firebase project configured with Firestore and Authentication.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rahmanmdmustafizur958-ai/gym_tracker.git
   cd gym_tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root of your project and populate it with your Firebase config credentials:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

This application is ready to be deployed on platforms like Vercel. Be sure to include your `.env.local` variables in your provider's Environment Variables settings before deployment.

---

*Designed and engineered by [rahmanmdmustafizur958-ai](https://github.com/rahmanmdmustafizur958-ai).*
