# Progress Tracking & Module Management Guide

## Overview

This implementation adds comprehensive progress tracking, module content management (documents & videos), module unlocking based on completion percentage, and quiz functionality to the LMS.

## Data Structure

### User Schema - Progress Field

The progress tracking is stored in each user's document as a Map of course progressions:

```javascript
progress: Map<courseId, {
  modules: Map<moduleId, {
    progress: 0-100,           // Module completion percentage
    videoProgress: 0-100,       // Video watch percentage
    completed: boolean,
    completedAt: Date,
    documentsDownloaded: [String]  // IDs of downloaded documents
  }>,
  overallProgress: 0-100,      // Overall course completion percentage
  quizCompleted: boolean,
  quizScore: number,           // Quiz score percentage
  quizAttempts: [{
    answers: Map<questionId, selectedOptionIndex>,
    score: number,
    completedAt: Date
  }],
  enrolledAt: Date
}>
```

### Course Schema - Enhanced Structure

#### Module Structure

```javascript
{
  title: String,
  description: String,
  content: String,
  duration: String,
  order: Number,
  documents: [{
    title: String,
    url: String,                // Document storage URL
    downloadUrl: String,        // Direct download URL
    uploadedAt: Date
  }],
  video: {
    title: String,
    url: String,                // Video streaming URL
    duration: Number,           // Duration in seconds
    uploadedAt: Date
  },
  unlockPercentage: Number      // Default: 50 (unlock next module at 50%)
}
```

#### Quiz Structure

```javascript
quiz: {
  title: String,
  description: String,
  questions: [{
    questionText: String,
    options: [String],          // Array of answer options
    correctAnswerIndex: Number, // Index of correct answer
    explanation: String
  }],
  passingScore: Number,         // Default: 50 (pass percentage)
  unlockPercentage: Number      // Default: 50 (unlock at 50% course completion)
}
```

## API Endpoints

### 1. Update Module Progress

**Endpoint:** `POST /api/courses/:courseId/modules/:moduleId/progress`

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "progress": 50, // Optional: Module completion % (0-100)
  "videoProgress": 75, // Optional: Video watch % (0-100)
  "documentId": "doc_id_123" // Optional: Track document download
}
```

**Response:**

```json
{
  "message": "Progress updated successfully",
  "moduleProgress": {
    "progress": 50,
    "videoProgress": 75,
    "completed": false,
    "documentsDownloaded": ["doc_id_123"]
  },
  "overallProgress": 45, // Updated course progress
  "completedModules": 0,
  "totalModules": 5
}
```

**Error Cases:**

- 400: Progress outside 0-100 range
- 404: User, course, or module not found
- 500: Server error

---

### 2. Get Course Progress

**Endpoint:** `GET /api/courses/:courseId/progress`

**Authentication:** Required (Bearer token)

**Query Parameters:** None

**Response:**

```json
{
  "courseId": "course_id_123",
  "overallProgress": 45,
  "quizCompleted": false,
  "quizScore": null,
  "modules": [
    {
      "moduleId": "module_id_1",
      "title": "Introduction",
      "progress": 100,
      "videoProgress": 100,
      "completed": true,
      "completedAt": "2024-01-15T10:30:00Z",
      "documentsDownloaded": ["doc1", "doc2"]
    },
    {
      "moduleId": "module_id_2",
      "title": "Advanced Concepts",
      "progress": 0,
      "videoProgress": 0,
      "completed": false,
      "completedAt": null,
      "documentsDownloaded": []
    }
  ],
  "enrolledAt": "2024-01-10T08:00:00Z"
}
```

---

### 3. Check Module Unlock Status

**Endpoint:** `GET /api/courses/:courseId/modules/:moduleId/is-unlocked`

**Authentication:** Required (Bearer token)

**Response:**

```json
{
  "isUnlocked": true,
  "currentProgress": 65, // Progress on previous module
  "requiredProgress": 50 // Unlock threshold (from previous module)
}
```

**Rules:**

- First module is always unlocked
- Subsequent modules unlock when previous module reaches the `unlockPercentage` (default: 50%)

---

### 4. Check Quiz Unlock Status

**Endpoint:** `GET /api/courses/:courseId/quiz/is-unlocked`

**Authentication:** Required (Bearer token)

**Response:**

```json
{
  "isUnlocked": false,
  "currentProgress": 35,
  "requiredProgress": 50,
  "alreadyCompleted": false
}
```

**Rules:**

- Quiz unlocks when overall course progress reaches `quiz.unlockPercentage` (default: 50%)

---

### 5. Get Quiz Details

**Endpoint:** `GET /api/courses/:courseId/quiz`

**Authentication:** Required (Bearer token)

**Response:**

```json
{
  "title": "Course Assessment",
  "description": "Final quiz to assess learning",
  "passingScore": 60,
  "totalQuestions": 5,
  "questions": [
    {
      "_id": "question_id_1",
      "questionText": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"]
      // Note: correctAnswerIndex is NOT sent to client
    }
    // ... more questions
  ]
}
```

**Error Cases:**

- 403: Quiz locked - course completion below threshold
- 404: Quiz not available or course not found

---

### 6. Submit Quiz Answers

**Endpoint:** `POST /api/courses/:courseId/quiz`

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "answers": {
    "question_id_1": 1, // Option index (0-based)
    "question_id_2": 0,
    "question_id_3": 3
    // ... one entry per question
  }
}
```

**Response:**

```json
{
  "message": "Quiz submitted successfully",
  "score": 80, // Score percentage
  "passed": true, // Pass/fail based on passingScore
  "totalQuestions": 5,
  "correctAnswers": 4,
  "passingScore": 60,
  "detailedResults": [
    {
      "questionId": "question_id_1",
      "questionText": "What is the capital of France?",
      "selectedOption": "Paris",
      "correctOption": "Paris",
      "isCorrect": true,
      "explanation": "Paris is the capital of France."
    }
    // ... one result per question
  ]
}
```

**Error Cases:**

- 400: Invalid answers format
- 403: Quiz locked or user not enrolled
- 404: Quiz or course not found

---

## Progress Calculation Logic

### Module Progress

- Ranges from 0-100%
- Incremented through:
  - `progress` field: Manual progress tracking
  - `videoProgress` field: Automatic video watch percentage
  - Completed when progress reaches 100%

### Overall Course Progress

- Calculated as average of all module progress values
- Formula: `(sum of all module progress) / total modules`
- Rounded to nearest integer

### Module Unlocking

- First module always unlocked
- Each subsequent module unlocks when **previous module** reaches `unlockPercentage`
- Default: 50%
- Customizable per module

### Quiz Unlocking

- Unlocks when **overall course progress** reaches `quiz.unlockPercentage`
- Default: 50%
- Can only be taken once (updates on re-submission)

---

## Example Workflow

### Scenario: User enrolls in a 3-module course

1. **User enrolls**
   - Progress initialized with empty modules map
   - Only Module 1 is unlocked

2. **User watches Module 1 video**
   - `POST /api/courses/C1/modules/M1/progress`
   - Body: `{ "videoProgress": 50 }`

3. **User completes Module 1**
   - `POST /api/courses/C1/modules/M1/progress`
   - Body: `{ "progress": 100 }`
   - Module marked as completed

4. **Check overall progress**
   - `GET /api/courses/C1/progress`
   - Overall: 33% (1/3 modules complete)

5. **User attempts Module 2**
   - `GET /api/courses/C1/modules/M2/is-unlocked`
   - Returns `isUnlocked: true` (prev module at 100% > 50%)

6. **User reaches 50% course progress**
   - Quiz becomes available
   - `GET /api/courses/C1/quiz/is-unlocked` returns `isUnlocked: true`

7. **User takes quiz**
   - `GET /api/courses/C1/quiz` to fetch questions
   - `POST /api/courses/C1/quiz` to submit answers
   - Results stored in user progress

---

## Frontend Integration Tips

### Tracking Progress

```javascript
// When user watches video
const updateVideoProgress = async (courseId, moduleId, percentage) => {
  const response = await fetch(
    `/api/courses/${courseId}/modules/${moduleId}/progress`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ videoProgress: percentage }),
    },
  );
};

// When user completes a lesson
const completeModule = async (courseId, moduleId) => {
  await fetch(`/api/courses/${courseId}/modules/${moduleId}/progress`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ progress: 100 }),
  });
};
```

### Module Navigation

```javascript
// Before showing next module button
const isNextModuleUnlocked = async (courseId, moduleId) => {
  const response = await fetch(
    `/api/courses/${courseId}/modules/${moduleId}/is-unlocked`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await response.json();
  return data.isUnlocked;
};
```

### Quiz Access

```javascript
// Check if quiz can be taken
const canTakeQuiz = async (courseId) => {
  const response = await fetch(`/api/courses/${courseId}/quiz/is-unlocked`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.isUnlocked && !data.alreadyCompleted;
};
```

---

## Security Considerations

1. **Progress is User-Specific**
   - All endpoints require authentication
   - Users can only access their own progress
   - Verified via userId from JWT token

2. **Correct Answers Hidden**
   - Quiz endpoints don't send `correctAnswerIndex` to client
   - Answers verified server-side
   - Prevents cheating through browser dev tools

3. **Quiz Unlocking Enforced**
   - Server validates course progress before quiz access
   - Prevents bypass of unlock requirements

4. **Data Validation**
   - Progress values must be 0-100
   - Answer indices validated against question options
   - Enrollment verified before progress updates

---

## Database Considerations

### Indexes to Add (Optional but Recommended)

```javascript
// In User model pre-hook or separate migration:
userSchema.index({ enrolledCourses: 1 });
userSchema.index({ email: 1 });

// In Course model:
courseSchema.index({ enrolledUsers: 1 });
courseSchema.index({ isPublished: 1 });
```

### Backup & Migration

- Progress data is stored as Maps in MongoDB
- Ensure proper backup strategy for user data
- Test data migrations thoroughly before deployment

---

## Future Enhancements

1. **Quiz Retakes**
   - Allow multiple quiz attempts with score tracking
   - Currently supported via `quizAttempts` array

2. **Progress Analytics**
   - Average completion time per module
   - Student performance metrics
   - Course effectiveness analysis

3. **Certificates**
   - Auto-generate certificates on course completion
   - Link to `overallProgress: 100%` and passing quiz score

4. **Adaptive Learning**
   - Adjust unlock percentages based on student performance
   - Personalized learning paths

5. **Notifications**
   - Alert students when modules unlock
   - Remind about incomplete courses
