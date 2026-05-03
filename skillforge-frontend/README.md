# Skill Forge Frontend

A modern React-based Learning Management System frontend built with Vite, Tailwind CSS, and React Router.

## Features

- 🎨 **Beautiful UI** - Built with Tailwind CSS using a custom color palette
- 🔐 **Authentication** - Secure login and signup with JWT tokens
- 📚 **Course Discovery** - Browse and explore available courses
- 📊 **User Dashboard** - Track enrolled courses and progress
- 🧩 **Course Modules** - Structured module-based learning system
- 🎥 **Video Streaming** - Watch course videos inside modules
- 📄 **Document Downloads** - Access learning resources
- 📈 **Progress Tracking** - Track course and module completion
- ⏱️ **Video Progress Tracking** - Resume from where you left off
- 🧠 **Quiz System** - Module-based quizzes
- 🏆 **Quiz Results** - Score calculation and feedback
- 🛠️ **Admin Dashboard** - Manage platform data
- 👥 **User Management** - Add, edit, delete users and assign roles
- 🎯 **Responsive Design** - Works on all devices
- ⚡ **Fast Performance** - Built with Vite
- 🔄 **API Integration** - Modular API structure

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: React Context API

## Color Palette

| Role             | Hex       | Use                           |
| ---------------- | --------- | ----------------------------- |
| Background       | `#FFF9F4` | Main page background          |
| Surface          | `#FFFFFF` | Cards, forms, panels          |
| Primary orange   | `#F97316` | Main buttons, CTA, highlights |
| Secondary orange | `#FB923C` | Soft accents, gradients       |
| Light orange     | `#FFEDD5` | Subtle backgrounds            |
| Border orange    | `#FED7AA` | Inputs, card borders          |
| Text primary     | `#0F172A` | Headings, strong text         |
| Text secondary   | `#475569` | Body text, labels             |

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Setup Steps

1. Navigate to frontend folder

```bash
cd skillforge/frontend
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── CourseModules.jsx
│   │   ├── ModuleDetail.jsx
│   │   ├── Quiz.jsx
│   │   ├── QuizResults.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminCourses.jsx
│   │   ├── AdminCourseForm.jsx
│   │   └── AdminUsers.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CourseContext.jsx
│   ├── utils/
│   │   ├── authApi.js
│   │   ├── coursesApi.js
│   │   ├── adminApi.js
│   │   └── progressApi.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
```

## Pages Overview

### Landing Page (`/`)

- Auth-aware greeting
- Guest view with features and CTA
- Navigation based on authentication

### Login Page (`/login`)

- Email/password login
- Validation and error handling

### Signup Page (`/signup`)

- User registration
- Auto login after signup

### Dashboard (`/dashboard`)

- Protected route
- Shows enrolled courses
- Displays progress statistics
- Continue learning functionality

### Courses (`/courses`)

- Browse all courses
- Course listing UI

### Course Details (`/courses/:id`)

- Course information
- Enrollment option
- Module overview

### Course Modules (`/courses/:id/modules`)

- List of modules
- Structured learning flow

### Module Detail (`/courses/:id/modules/:moduleId`)

- Video player
- Document download
- Progress tracking
- Access to quiz

### Quiz (`/courses/:id/modules/:moduleId/quiz`)

- Question-based quiz
- Answer submission

### Quiz Results (`/courses/:id/modules/:moduleId/quiz/results`)

- Score display
- Feedback and results

### Admin Dashboard (`/admin`)

- Overview of platform
- Navigation to admin tools

### Admin Courses (`/admin/courses`)

- Add, edit, delete courses
- Manage modules

### Admin Users (`/admin/users`)

- Add, edit, delete users
- Assign roles

## Authentication Flow

1. User registers → token stored
2. User logs in → token stored
3. Protected routes check auth
4. API calls include token
5. Logout clears token

## API Integration

Backend URL:
http://localhost:5000

### Endpoints

| Endpoint                         | Method | Use            |
| -------------------------------- | ------ | -------------- |
| /api/auth/signup                 | POST   | Register       |
| /api/auth/login                  | POST   | Login          |
| /api/auth/me                     | GET    | Current user   |
| /api/auth/logout                 | POST   | Logout         |
| /api/courses                     | GET    | All courses    |
| /api/courses/:id                 | GET    | Course details |
| /api/courses/my-courses/enrolled | GET    | User courses   |
| /api/courses/:id/enroll          | POST   | Enroll         |
| /api/users                       | GET    | All users      |
| /api/users/:id                   | PUT    | Update user    |
| /api/users/:id                   | DELETE | Delete user    |

## API Structure

- authApi.js → authentication
- coursesApi.js → courses
- adminApi.js → admin
- progressApi.js → progress tracking

## Learning Flow

```
Enroll → Modules → Video → Quiz → Results → Progress Update
```

## Troubleshooting

### Backend Issues

- Ensure backend is running
- Check CORS configuration

### Auth Issues

- Verify token in localStorage
- Check headers

### Video Issues

- Use public URLs (Cloudinary etc.)

### Progress Issues

- Verify backend progress API

## Development Workflow

```bash
cd backend
npm start

cd frontend
npm run dev
```

## Build for Production

```bash
npm run build
```

## License

MIT

## Support

Check backend README or open an issue
