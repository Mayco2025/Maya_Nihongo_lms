# Maya Nihongo LMS

A modern Japanese language learning platform that bridges Japanese language education with Amharic cultural concepts, creating a unique and immersive learning experience.

## Features

- **Student Dashboard**: Access class schedules, course materials, and Q&A forums
- **Teacher Admin Panel**: Manage classes, materials, and answer student questions
- **Real-time Updates**: Live synchronization with Firebase Firestore
- **Responsive Design**: Beautiful UI that works on all devices
- **Bilingual Interface**: Japanese and English language support

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── icons/          # SVG icon components
│   ├── Header.tsx      # Application header
│   ├── LoginScreen.tsx # Authentication screen
│   └── Sidebar.tsx     # Navigation sidebar
├── pages/              # Page components
│   ├── StudentDashboardPage.tsx
│   ├── TeacherDashboardPage.tsx
│   ├── SchedulePage.tsx
│   ├── MaterialsPage.tsx
│   └── QandAPage.tsx
├── hooks/              # Custom React hooks
│   └── useFirebase.ts  # Firebase authentication hook
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── firebase.ts     # Firebase configuration
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd maya-nihongo-lms
```

2. Install dependencies:

```bash
npm install
```

3. Set up Firebase configuration:

   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase config to the environment variables

4. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the application for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## Features in Detail

### Student Features

- View upcoming and past class schedules
- Access course materials after class completion
- Ask questions in the Q&A forum
- Real-time updates for new content

### Teacher Features

- Admin dashboard with statistics
- Manage class schedules
- Upload and manage course materials
- Answer student questions
- Toggle between student and teacher views

### Authentication

- Anonymous authentication for demo purposes
- Custom token authentication support
- Secure user session management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the beauty of Japanese culture and the richness of Amharic traditions
- Built with modern web technologies for optimal learning experience
- Designed for accessibility and ease of use
