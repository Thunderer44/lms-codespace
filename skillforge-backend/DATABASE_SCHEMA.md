# Database Schema Documentation

## User Schema - Progress Field Structure

```javascript
// User Document Example
{
  _id: ObjectId("user_id"),
  name: "John Student",
  email: "john@example.com",
  enrolledCourses: [
    ObjectId("course_id_1"),
    ObjectId("course_id_2")
  ],
  progress: {
    "course_id_1": {
      modules: {
        "module_id_1": {
          progress: 100,
          videoProgress: 100,
          completed: true,
          completedAt: ISODate("2024-01-15T10:30:00Z"),
          documentsDownloaded: ["doc_1", "doc_2"]
        },
        "module_id_2": {
          progress: 50,
          videoProgress: 75,
          completed: false,
          completedAt: null,
          documentsDownloaded: ["doc_1"]
        }
      },
      overallProgress: 75,
      quizCompleted: false,
      quizScore: null,
      quizAttempts: [],
      enrolledAt: ISODate("2024-01-10T08:00:00Z")
    },
    "course_id_2": {
      modules: {},
      overallProgress: 0,
      quizCompleted: false,
      quizScore: null,
      quizAttempts: [],
      enrolledAt: ISODate("2024-01-12T09:00:00Z")
    }
  },
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

## Course Schema - Module and Quiz Structure

```javascript
// Course Document Example
{
  _id: ObjectId("course_id"),
  title: "Full Stack Web Development",
  description: "Learn to build complete web applications",
  instructor: "John Doe",
  category: "Web Development",
  duration: "8 weeks",
  level: "Beginner",
  modules: [
    {
      _id: ObjectId("module_id_1"),
      title: "HTML Basics",
      description: "Learn the fundamentals of HTML",
      content: "...",
      duration: "2 hours",
      order: 1,
      documents: [
        {
          _id: ObjectId("doc_id_1"),
          title: "HTML Cheat Sheet",
          url: "/documents/html-cheatsheet.pdf",
          downloadUrl: "https://example.com/download/html-cheatsheet.pdf",
          uploadedAt: ISODate("2024-01-01T00:00:00Z")
        },
        {
          _id: ObjectId("doc_id_2"),
          title: "HTML Best Practices",
          url: "/documents/html-practices.pdf",
          downloadUrl: "https://example.com/download/html-practices.pdf",
          uploadedAt: ISODate("2024-01-01T00:00:00Z")
        }
      ],
      video: {
        _id: ObjectId("video_id_1"),
        title: "Introduction to HTML",
        url: "https://example.com/videos/html-intro.mp4",
        duration: 3600,
        uploadedAt: ISODate("2024-01-01T00:00:00Z")
      },
      unlockPercentage: 50
    },
    {
      _id: ObjectId("module_id_2"),
      title: "CSS Styling",
      // ... similar structure
    }
  ],
  quiz: {
    _id: ObjectId("quiz_id"),
    title: "Full Stack Web Development Assessment",
    description: "Test your knowledge",
    passingScore: 60,
    unlockPercentage: 50,
    questions: [
      {
        _id: ObjectId("question_id_1"),
        questionText: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language"
        ],
        correctAnswerIndex: 0,
        explanation: "HTML stands for HyperText Markup Language..."
      },
      // ... more questions
    ]
  },
  enrolledUsers: [ObjectId("user_id_1"), ObjectId("user_id_2")],
  reviews: [
    {
      _id: ObjectId("review_id"),
      userId: ObjectId("user_id_1"),
      userName: "John",
      rating: 5,
      comment: "Great course!",
      createdAt: ISODate("2024-01-15T10:30:00Z")
    }
  ],
  rating: 4.5,
  isPublished: true,
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

## Database Indexes

### Recommended Indexes for Performance

```javascript
// In User Model
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ enrolledCourses: 1 });

// In Course Model
courseSchema.index({ isPublished: 1 });
courseSchema.index({ enrolledUsers: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
```

### Explaining Indexes

1. **`users.email`** - Unique index for fast login lookups
2. **`users.enrolledCourses`** - For quick retrieval of user's courses
3. **`courses.isPublished`** - Filter published courses quickly
4. **`courses.enrolledUsers`** - Find all users in a course
5. **`courses.instructor`** - Filter courses by instructor
6. **`courses.category`** - Filter courses by category

## Data Relationships

```
User (1) ──────────────── (M) Course
  |
  └─ enrolledCourses: [Course._id]
  └─ progress: {
       Course._id: {
         modules: {
           Module._id: {
             progress, videoProgress, ...
           }
         }
       }
     }

Course (1) ──────────────── (M) User
  |
  ├─ enrolledUsers: [User._id]
  ├─ modules: [
  │   {
  │     documents: [{ title, url, ... }],
  │     video: { title, url, duration, ... },
  │     unlockPercentage
  │   }
  │ ]
  └─ quiz: {
      questions: [{ text, options, correctAnswerIndex, ... }]
    }
```

## Data Migrations

### Adding Progress Tracking to Existing Users

If you have existing users without the new progress structure:

```javascript
// Migration script
import User from "./models/User.js";

async function migrateProgressTracking() {
  try {
    // Update all users with empty progress Map
    const result = await User.updateMany(
      { progress: { $exists: false } },
      { $set: { progress: new Map() } },
    );

    console.log(`Updated ${result.modifiedCount} users`);
  } catch (error) {
    console.error("Migration failed:", error);
  }
}
```

### Updating Existing Courses with Quiz

If you have existing courses without quiz data:

```javascript
// Add empty quiz structure to courses
import Course from "./models/Course.js";

async function addQuizzesToCourses() {
  try {
    const result = await Course.updateMany(
      { quiz: { $exists: false } },
      {
        $set: {
          quiz: {
            title: "Course Assessment",
            description: "Assessment for this course",
            questions: [],
            passingScore: 60,
            unlockPercentage: 50,
          },
        },
      },
    );

    console.log(`Updated ${result.modifiedCount} courses`);
  } catch (error) {
    console.error("Migration failed:", error);
  }
}
```

## Storage Considerations

### Estimated Data Size

For a typical course with progress tracking:

```
User Document:
- Basic info: ~500 bytes
- Per course progress: ~1 KB - 5 KB (depending on module count)
- Example: User with 5 enrolled courses: ~25-30 KB

Course Document:
- Basic info: ~500 bytes
- Per module: ~2-5 KB (with documents and video)
- Per question: ~300 bytes
- Example: Course with 5 modules and 10 quiz questions: ~30-40 KB
```

### Backup Strategy

1. **Regular Backups** - Backup MongoDB daily
2. **Progress Snapshots** - Consider archiving historical progress data
3. **Quiz Results** - Store quiz attempts separately for long-term analysis

```javascript
// Optional: Create a separate collection for quiz history
const quizHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  score: Number,
  answers: Map,
  completedAt: { type: Date, default: Date.now },
});
```

## Query Examples

### Get User's Course Progress

```javascript
// Find a user and get a specific course's progress
const user = await User.findById(userId);
const courseProgress = user.progress.get(courseId);

// Returns:
// {
//   modules: Map { ... },
//   overallProgress: 50,
//   quizCompleted: false,
//   quizScore: null,
//   ...
// }
```

### Get All Users in a Course

```javascript
const course = await Course.findById(courseId).populate(
  "enrolledUsers",
  "name email",
);

// Returns course with array of enrolled users
```

### Get Course Statistics

```javascript
// Average course completion
const stats = await User.aggregate([
  { $unwind: "$progress" },
  {
    $group: {
      _id: "$progress.key", // courseId
      avgProgress: { $avg: "$progress.value.overallProgress" },
      totalEnrolled: { $sum: 1 },
    },
  },
]);
```

### Find Users Who Completed a Quiz

```javascript
const usersWithQuiz = await User.find({
  "progress.*.quizCompleted": true,
});
```

## Troubleshooting

### Issue: Progress not updating

1. Check user is authenticated (valid JWT)
2. Verify course and module exist
3. Check progress value is 0-100
4. Ensure user is enrolled in course

### Issue: Quiz not accessible

1. Verify course progress >= quiz.unlockPercentage
2. Check quiz exists in course document
3. Ensure all question objects have correctAnswerIndex

### Issue: Map data type issues

MongoDB doesn't have a native Map type. The mongoose schema converts Map to Object in queries. When querying:

```javascript
// Good: Access through JavaScript
const courseProgress = user.progress.get(courseId);

// Using the database directly requires different syntax
// db.users.findOne({ _id: userId })
// Returns progress as nested object, not Map
```

## Performance Optimization Tips

1. **Use projection** when fetching progress:

```javascript
// Only get needed fields
User.findById(userId, "progress enrolledCourses");
```

2. **Index frequently queried fields**:

```javascript
userSchema.index({ enrolledCourses: 1 });
```

3. **Cache progress data** on frontend for 30 seconds before refreshing

4. **Use MongoDB sessions** for consistent reads in transactions

5. **Archive old quiz attempts** to reduce document size over time
