# Example Course Seed Data

This file shows how to structure courses with the new progress tracking features.

## Sample Course with All Features

```javascript
const sampleCourse = {
  title: "Full Stack Web Development",
  description:
    "Learn to build complete web applications from frontend to backend",
  instructor: "John Doe",
  category: "Web Development",
  duration: "8 weeks",
  level: "Beginner",
  isPublished: true,
  modules: [
    {
      title: "HTML Basics",
      description: "Learn the fundamentals of HTML",
      content: `
        <h1>HTML Basics</h1>
        <p>HTML is the markup language of the web...</p>
        <ul>
          <li>Tags and Elements</li>
          <li>Attributes</li>
          <li>Semantic HTML</li>
        </ul>
      `,
      duration: "2 hours",
      order: 1,
      documents: [
        {
          title: "HTML Cheat Sheet",
          url: "/documents/html-cheatsheet.pdf",
          downloadUrl: "https://example.com/download/html-cheatsheet.pdf",
        },
        {
          title: "HTML Best Practices",
          url: "/documents/html-practices.pdf",
          downloadUrl: "https://example.com/download/html-practices.pdf",
        },
      ],
      video: {
        title: "Introduction to HTML",
        url: "https://example.com/videos/html-intro.mp4",
        duration: 3600, // 60 minutes in seconds
      },
      unlockPercentage: 50, // Next module (CSS Basics) unlocks at 50%
    },
    {
      title: "CSS Styling",
      description: "Master CSS for styling web pages",
      content: `
        <h1>CSS Styling</h1>
        <p>CSS is used to style HTML elements...</p>
        <ul>
          <li>Selectors</li>
          <li>Properties</li>
          <li>Flexbox and Grid</li>
        </ul>
      `,
      duration: "2.5 hours",
      order: 2,
      documents: [
        {
          title: "CSS Reference Guide",
          url: "/documents/css-reference.pdf",
          downloadUrl: "https://example.com/download/css-reference.pdf",
        },
      ],
      video: {
        title: "CSS Deep Dive",
        url: "https://example.com/videos/css-deepdive.mp4",
        duration: 5400, // 90 minutes
      },
      unlockPercentage: 50,
    },
    {
      title: "JavaScript Fundamentals",
      description: "Learn JavaScript programming basics",
      content: `
        <h1>JavaScript Fundamentals</h1>
        <p>JavaScript is the programming language of the web...</p>
        <ul>
          <li>Variables and Data Types</li>
          <li>Functions</li>
          <li>DOM Manipulation</li>
        </ul>
      `,
      duration: "3 hours",
      order: 3,
      documents: [
        {
          title: "JavaScript Guide",
          url: "/documents/js-guide.pdf",
          downloadUrl: "https://example.com/download/js-guide.pdf",
        },
        {
          title: "ES6 Features",
          url: "/documents/es6-features.pdf",
          downloadUrl: "https://example.com/download/es6-features.pdf",
        },
      ],
      video: {
        title: "JavaScript Fundamentals",
        url: "https://example.com/videos/js-fundamentals.mp4",
        duration: 7200, // 120 minutes
      },
      unlockPercentage: 50,
    },
    {
      title: "React.js",
      description: "Build interactive user interfaces with React",
      content: `
        <h1>React.js</h1>
        <p>React is a JavaScript library for building user interfaces...</p>
        <ul>
          <li>Components</li>
          <li>Props and State</li>
          <li>Hooks</li>
        </ul>
      `,
      duration: "3.5 hours",
      order: 4,
      documents: [
        {
          title: "React Documentation",
          url: "/documents/react-docs.pdf",
          downloadUrl: "https://example.com/download/react-docs.pdf",
        },
      ],
      video: {
        title: "React Complete Guide",
        url: "https://example.com/videos/react-guide.mp4",
        duration: 9000, // 150 minutes
      },
      unlockPercentage: 50,
    },
  ],
  quiz: {
    title: "Full Stack Web Development Assessment",
    description: "Test your knowledge of web development fundamentals",
    passingScore: 60, // Passing score is 60%
    unlockPercentage: 50, // Quiz unlocks at 50% course completion
    questions: [
      {
        questionText: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
        ],
        correctAnswerIndex: 0,
        explanation:
          "HTML stands for HyperText Markup Language. It's the standard markup language for creating web pages.",
      },
      {
        questionText: "Which CSS property is used to change the text color?",
        options: ["font-color", "text-color", "color", "text-style"],
        correctAnswerIndex: 2,
        explanation:
          "The 'color' property in CSS is used to set the text color of an element.",
      },
      {
        questionText:
          "What is the correct syntax for declaring a JavaScript variable?",
        options: [
          "var name = 'John';",
          "variable name = 'John';",
          "v name = 'John';",
          "declare name = 'John';",
        ],
        correctAnswerIndex: 0,
        explanation:
          "In JavaScript, you declare a variable using 'var', 'let', or 'const' keyword followed by the variable name.",
      },
      {
        questionText: "What is a React component?",
        options: [
          "A JavaScript function that returns JSX",
          "A CSS file",
          "A database table",
          "A server configuration",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A React component is a JavaScript function (or class) that returns JSX elements describing what should appear on the screen.",
      },
      {
        questionText: "Which hook is used to perform side effects in React?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswerIndex: 0,
        explanation:
          "The useEffect hook is used to perform side effects in functional React components, such as fetching data or subscribing to events.",
      },
    ],
  },
  enrolledUsers: [],
  reviews: [],
  rating: 0,
};
```

## Integration with Seeds File

Update your `seeds.js` to include this course:

```javascript
import mongoose from "mongoose";
import Course from "./models/Course.js";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Course.deleteMany({});
    await User.deleteMany({});

    // Create sample course (see above structure)
    const course = new Course(sampleCourse);
    await course.save();
    console.log("Sample course created:", course._id);

    // Create sample user
    const user = new User({
      name: "John Student",
      email: "student@example.com",
      password: "password123",
    });
    await user.save();
    console.log("Sample user created:", user._id);

    // Enroll user in course
    user.enrolledCourses.push(course._id);
    course.enrolledUsers.push(user._id);
    await user.save();
    await course.save();
    console.log("User enrolled in course");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
```

## Testing the Progress Tracking

### 1. Create a course with the seed data

```bash
npm run seed
```

### 2. Test progress update

```bash
# Update module progress to 50%
curl -X POST http://localhost:5000/api/courses/{courseId}/modules/{moduleId}/progress \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}'
```

### 3. Get course progress

```bash
curl http://localhost:5000/api/courses/{courseId}/progress \
  -H "Authorization: Bearer {token}"
```

### 4. Check if next module is unlocked

```bash
curl http://localhost:5000/api/courses/{courseId}/modules/{nextModuleId}/is-unlocked \
  -H "Authorization: Bearer {token}"
```

### 5. Complete first two modules (50% each) and check quiz

```bash
# After completing modules, check quiz unlock status
curl http://localhost:5000/api/courses/{courseId}/quiz/is-unlocked \
  -H "Authorization: Bearer {token}"
```

### 6. Get quiz questions

```bash
curl http://localhost:5000/api/courses/{courseId}/quiz \
  -H "Authorization: Bearer {token}"
```

### 7. Submit quiz answers

```bash
curl -X POST http://localhost:5000/api/courses/{courseId}/quiz \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "{question1Id}": 0,
      "{question2Id}": 2,
      "{question3Id}": 0,
      "{question4Id}": 0,
      "{question5Id}": 0
    }
  }'
```
