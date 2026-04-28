# Skill Forge Frontend

A modern React-based Learning Management System frontend built with Vite, Tailwind CSS, and React Router.

## Features

- 🎨 **Beautiful UI** - Built with Tailwind CSS using a custom color palette
- 🔐 **Authentication** - Secure login and signup with JWT tokens
- 📚 **Course Discovery** - Browse and explore available courses
- 📊 **User Dashboard** - Track enrolled courses and progress
- 🎯 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Vite for instant development experience
- 🔄 **API Integration** - Ready-made integration with Skill Forge backend

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

1. **Navigate to frontend folder**

   ```bash
   cd skillforge/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx       # Homepage with auth-aware greeting
│   │   ├── LoginPage.jsx         # User login form
│   │   ├── SignupPage.jsx        # User registration form
│   │   └── Dashboard.jsx         # User dashboard (protected)
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication state management
│   ├── App.jsx                   # Main app component with routes
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Global styles
│   └── App.css                   # App-specific styles
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

## Pages Overview

### Landing Page (`/`)

- **Auth View**: Shows greeting for logged-in users with option to go to dashboard
- **Guest View**: Displays features, course preview, and FAQ
- **Navigation**: Dynamic navbar based on authentication status
- **CTA**: Contextual call-to-action buttons

### Login Page (`/login`)

- User login form
- Email and password validation
- Error handling
- Link to signup for new users

### Signup Page (`/signup`)

- User registration form
- Name, email, and password fields
- Password validation
- Account creation with auto-login

### Dashboard (`/dashboard`)

- Protected route (requires authentication)
- User greeting and profile info
- Quick stats (enrolled courses, progress, learning hours)
- List of enrolled courses
- Browse more courses button
- Logout functionality

## Authentication Flow

1. **User Registration**
   - User fills signup form
   - Password is hashed on backend
   - JWT token is returned and stored in localStorage
   - User is logged in automatically

2. **User Login**
   - User enters credentials
   - Backend validates and returns JWT token
   - Token is stored in localStorage
   - User is redirected to dashboard or landing page

3. **Protected Routes**
   - Dashboard route checks authentication status
   - Unauthenticated users are redirected to login
   - Token is sent with every API request in Authorization header

4. **Logout**
   - Token is removed from localStorage
   - User is redirected to landing page
   - AuthContext state is cleared

## API Integration

### Environment Setup

The frontend is configured to connect to the backend at `http://localhost:5000`. This can be customized in the `AuthContext.jsx` file.

### API Endpoints Used

| Endpoint                           | Method | Use                | Auth     |
| ---------------------------------- | ------ | ------------------ | -------- |
| `/api/auth/signup`                 | POST   | User registration  | No       |
| `/api/auth/login`                  | POST   | User login         | No       |
| `/api/auth/me`                     | GET    | Get current user   | Yes      |
| `/api/auth/logout`                 | POST   | Logout user        | Yes      |
| `/api/courses`                     | GET    | Get all courses    | Optional |
| `/api/courses/:id`                 | GET    | Get course details | Optional |
| `/api/courses/my-courses/enrolled` | GET    | Get user's courses | Yes      |
| `/api/courses/:id/enroll`          | POST   | Enroll in course   | Yes      |

## Using the AuthContext

The `AuthContext` provides authentication state and methods throughout the app.

### Hook Usage

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, signup, logout } = useAuth();

  return (
    <>{isAuthenticated ? <p>Welcome, {user.name}!</p> : <p>Please log in</p>}</>
  );
}
```

### Available Methods

- `login(email, password)` - Login user
- `signup(name, email, password)` - Register new user
- `logout()` - Logout user and clear token
- `user` - Current user object or null
- `isAuthenticated` - Boolean indicating if user is logged in
- `isLoading` - Boolean indicating if auth checks are in progress

## Customization

### Modifying Colors

Edit the Tailwind classes in components. Color palette is built into class names:

- `bg-[#FFF9F4]` for background
- `text-orange-600` for primary orange
- `text-slate-900` for primary text

### Adding New Pages

1. Create component in `src/components/`
2. Add route in `App.jsx`
3. Use React Router navigation:
   ```jsx
   import { useNavigate } from "react-router-dom";
   const navigate = useNavigate();
   navigate("/path");
   ```

### Modifying API URLs

Update the fetch URLs in `src/context/AuthContext.jsx`:

```javascript
const response = await fetch('http://your-api-url/api/endpoint', { ... });
```

## Troubleshooting

### Backend Connection Issues

- Ensure backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify backend `CORS_ORIGIN` includes frontend URL

### Authentication Not Working

- Ensure token is stored in localStorage
- Check that token is included in request headers
- Verify JWT secret matches between frontend and backend

### Styling Issues

- Run `npm install` to ensure Tailwind CSS is installed
- Restart dev server after installing dependencies
- Clear browser cache if styles don't update

## Development Workflow

1. **Start Backend**

   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application**
   - Open `http://localhost:5173` in browser

4. **Make Changes**
   - Edit components and save
   - Vite will hot-reload automatically

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder ready for deployment.

## Future Enhancements

- [ ] Course search and filtering
- [ ] User profile customization
- [ ] Course notifications
- [ ] Dark mode support
- [ ] Offline support with Service Workers
- [ ] Course video integration
- [ ] Progress visualization
- [ ] Certificate generation
- [ ] Mobile app with React Native

## License

MIT

## Support

For issues or questions, please check the backend README or open an issue in the repository.
