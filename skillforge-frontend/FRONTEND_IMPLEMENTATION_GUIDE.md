# Frontend Progress Tracking Implementation Guide

## Overview

The frontend has been enhanced with comprehensive progress tracking, video playback with automatic progress tracking, document downloading, module unlocking, and quiz functionality. All features integrate seamlessly with the backend API.

---

## New Files & Components Created

### 1. **Utility Functions** - `src/utils/progressApi.js`

Centralized API communication for all progress-related endpoints.

**Key Functions:**

- `updateModuleProgress(courseId, moduleId, progressData)` - Update progress
- `getCourseProgress(courseId)` - Fetch user's complete progress
- `checkModuleUnlock(courseId, moduleId)` - Check if module is unlocked
- `checkQuizUnlock(courseId)` - Check if quiz is unlocked
- `getQuiz(courseId)` - Fetch quiz questions
- `submitQuiz(courseId, answers)` - Submit quiz answers
- `trackDocumentDownload(courseId, moduleId, documentId)` - Track downloads
- `updateVideoProgress(courseId, moduleId, watchPercentage)` - Track video watch

**Usage Example:**

```javascript
import { getCourseProgress, updateModuleProgress } from "../utils/progressApi";

const progress = await getCourseProgress(courseId);
await updateModuleProgress(courseId, moduleId, { progress: 100 });
```

---

### 2. **VideoPlayer Component** - `src/components/VideoPlayer.jsx`

Custom video player with automatic progress tracking.

**Features:**

- HTML5 video playback
- Real-time progress tracking (every 10 seconds)
- Play/pause controls with custom UI
- Automatic tracking on pause/end
- Progress bar with click-to-seek
- Time display (current/duration)

**Props:**

- `courseId` (string) - Course ID for progress tracking
- `moduleId` (string) - Module ID for progress tracking
- `video` (object) - Video object with `{title, url, duration}`
- `onProgressUpdate` (function) - Callback when progress updates

**Usage Example:**

```jsx
<VideoPlayer
  courseId={courseId}
  moduleId={moduleId}
  video={{
    title: "Introduction",
    url: "https://example.com/video.mp4",
    duration: 3600,
  }}
  onProgressUpdate={(progress) => console.log(`Video: ${progress}%`)}
/>
```

---

### 3. **DocumentList Component** - `src/components/DocumentList.jsx`

Document management with download tracking.

**Features:**

- Display module documents
- One-click download with tracking
- Visual feedback (downloading, downloaded)
- Tracks document downloads in user progress
- Shows upload date for each document

**Props:**

- `courseId` (string) - Course ID
- `moduleId` (string) - Module ID
- `documents` (array) - Array of document objects with `{_id, title, url, downloadUrl}`

**Usage Example:**

```jsx
<DocumentList
  courseId={courseId}
  moduleId={moduleId}
  documents={module.documents}
/>
```

---

### 4. **ModuleUnlockCheck Component** - `src/components/ModuleUnlockCheck.jsx`

Wrapper component that enforces module access control.

**Features:**

- Checks if module is unlocked before showing content
- Shows unlock requirements if locked
- Displays progress toward unlock
- Gracefully handles API failures

**Props:**

- `courseId` (string) - Course ID
- `moduleId` (string) - Module ID
- `children` - Content to show when unlocked

**Usage Example:**

```jsx
<ModuleUnlockCheck courseId={courseId} moduleId={moduleId}>
  {/* Module content here - only shown if unlocked */}
</ModuleUnlockCheck>
```

---

### 5. **Quiz Component** - `src/components/Quiz.jsx`

Full quiz interface with question navigation and answer management.

**Features:**

- Quiz unlock checking (requires 50% course progress)
- Multi-question navigation
- Question status indicators (answered/unanswered)
- Answer validation before submission
- Automatic submission handling
- Shows results through `QuizResults` component

**Props:**

- `courseId` (string) - Course ID for quiz fetching

**Question Display:**

- Displays one question at a time
- Shows all options
- Allows navigation between questions
- Prevents submission if answers missing
- Visual indicators for answered questions

**Usage Example:**

```jsx
<Quiz courseId={courseId} />
```

---

### 6. **QuizResults Component** - `src/components/QuizResults.jsx`

Displays quiz results with detailed feedback.

**Features:**

- Shows overall score and pass/fail status
- Displays each question with user answer vs correct answer
- Shows explanations for each question
- Color-coded correct/incorrect answers
- Retry button for failed quizzes
- Score breakdown visualization

**Props:**

- `results` (object) - Results object from quiz submission
- `courseId` (string) - Course ID (for context)

**Results Object Structure:**

```javascript
{
  score: 80,
  passed: true,
  totalQuestions: 5,
  correctAnswers: 4,
  passingScore: 60,
  detailedResults: [
    {
      questionId: "...",
      questionText: "...",
      selectedOption: "...",
      correctOption: "...",
      isCorrect: true,
      explanation: "..."
    }
  ]
}
```

---

### 7. **QuizPage Component** - `src/components/QuizPage.jsx`

Page wrapper for quiz with header and navigation.

**Features:**

- Authentication check
- Header with logout
- Centered quiz layout
- Error handling

---

## Updated Components

### 1. **ModuleDetail.jsx** - Complete Rewrite

**New Features:**

- Integrates VideoPlayer, DocumentList, ModuleUnlockCheck
- Fetches progress from API
- Shows real-time video progress
- "Mark as Complete" button
- Sticky sidebar with module info
- Dynamic previous/next module navigation

**State Management:**

- `moduleProgress` - Current module progress from API
- `isCompleting` - Loading state for completion
- Automatic refresh on module completion

**Key Functions:**

```javascript
const handleCompleteModule = async () => {
  await updateModuleProgress(courseId, moduleId, { progress: 100 });
  // Refresh progress data
};
```

---

### 2. **CourseModules.jsx** - Enhanced Progress Display

**New Features:**

- Fetches actual progress from API via `getCourseProgress`
- Shows module progress from API data
- Green checkmarks for completed modules
- Displays "Review Module" for completed, "Open Module" for others
- Quiz section showing unlock status
- Click-to-take-quiz button with progress indicator

**Progress Calculation:**

```javascript
const getModuleProgress = (module) => {
  const moduleData = courseProgress.modules.find(
    (m) => m.moduleId === module._id,
  );
  return moduleData?.progress || 0;
};
```

---

### 3. **App.jsx** - New Route Added

**Added Route:**

```javascript
<Route path="/courses/:courseId/quiz" element={<QuizPage />} />
```

---

## API Integration Flow

### Module Learning Flow

```
1. User opens module
   ↓
2. ModuleUnlockCheck verifies access
   ↓
3. ModuleDetail fetches progress & module data
   ↓
4. VideoPlayer tracks video watch progress
   ↓
5. DocumentList tracks document downloads
   ↓
6. User clicks "Mark as Complete"
   ↓
7. updateModuleProgress() called with progress: 100
   ↓
8. Course progress recalculated on backend
   ↓
9. Next module becomes unlocked (if at 50%)
   ↓
10. Overall progress updated for quiz unlock check
```

### Quiz Flow

```
1. User views course modules
   ↓
2. CourseModules shows quiz section with unlock status
   ↓
3. User at 50% course completion clicks "Take Quiz"
   ↓
4. QuizPage opens, Quiz component loads
   ↓
5. checkQuizUnlock() verifies access
   ↓
6. getQuiz() fetches questions (no answers sent)
   ↓
7. User answers all questions
   ↓
8. User submits quiz
   ↓
9. submitQuiz() sends answers to backend
   ↓
10. Backend validates and scores quiz
   ↓
11. QuizResults displays with detailed feedback
```

---

## Component Data Flow Diagram

```
CourseModules
├── Fetches: course list + getCourseProgress()
├── Shows: module list with actual progress
└── Quiz Button
    └── Navigates to: /courses/:courseId/quiz

        ↓

QuizPage (wrapper)
└── Quiz (component)
    ├── Checks: checkQuizUnlock()
    ├── Fetches: getQuiz()
    ├── Shows: questions one at a time
    └── Submits: submitQuiz()
        └── Shows: QuizResults

        ↓

ModuleDetail
├── Wrapped: ModuleUnlockCheck
├── Checks: module unlock status
├── Fetches: getCourseProgress()
├── Shows:
│   ├── VideoPlayer (with onProgressUpdate)
│   ├── DocumentList (with download tracking)
│   └── Module content
└── Button: "Mark as Complete"
    └── Calls: updateModuleProgress({progress: 100})
```

---

## Key Interaction Patterns

### 1. Progress Update Pattern

```javascript
// When user completes an action
try {
  setIsLoading(true);
  await updateModuleProgress(courseId, moduleId, {
    progress: 50,
    videoProgress: 75,
    documentId: "doc_123",
  });
  // Refresh data
  const updated = await getCourseProgress(courseId);
  setProgress(updated);
} catch (error) {
  console.error("Failed:", error);
  // Show error to user
}
```

### 2. Conditional Rendering Pattern

```javascript
// Show content only if unlocked
<ModuleUnlockCheck courseId={courseId} moduleId={moduleId}>
  {/* This only renders if module is unlocked */}
  <ModuleContent />
</ModuleUnlockCheck>
```

### 3. Quiz Navigation Pattern

```javascript
// Navigate to quiz
onClick={() => navigate(`/courses/${courseId}/quiz`)}

// Quiz automatically checks unlock status
// If locked: shows lock screen
// If unlocked: shows questions
// If completed: shows results
```

---

## Styling & UI

All components use **Tailwind CSS** with the existing color scheme:

- **Primary**: Orange (`bg-orange-500`, `text-orange-700`)
- **Secondary**: Amber (`bg-amber-500`)
- **Success**: Green (`bg-green-500`)
- **Alert**: Amber/Red for locked/error states
- **Background**: `#FFF9F4` (cream)

### Component Styling Examples

**VideoPlayer Controls:**

- Gradient overlay for controls
- Custom progress bar with hover effect
- Play/pause with SVG icons
- Time display in bottom-left

**Quiz Navigation:**

- Number buttons for each question (green if answered)
- Previous/Next buttons
- Submit button (disabled if unanswered)
- Color-coded answer options

**Progress Bars:**

- Gray background with colored fill
- Smooth transitions
- Percentage labels

---

## Error Handling

### API Error Handling

```javascript
try {
  const data = await getCourseProgress(courseId);
} catch (error) {
  console.error("API Error:", error);
  // Graceful degradation - show message but allow navigation
  setError("Failed to load progress");
}
```

### Video/Document Download Errors

```javascript
// Graceful fallback for tracking failures
try {
  await trackDocumentDownload(courseId, moduleId, docId);
} catch (error) {
  console.error("Tracking failed:", error);
  // Still proceed with download
  window.open(docUrl, "_blank");
}
```

---

## Performance Optimization

### 1. **Memoization**

```javascript
const modules = useMemo(() => course?.modules || [], [course]);
const progress = useMemo(() => {
  return courseProgress?.overallProgress || 0;
}, [courseProgress]);
```

### 2. **Debounced Progress Tracking**

- Video progress tracked every 10 seconds
- Not on every frame (performance)
- Tracks on pause/end regardless

### 3. **Lazy Fetching**

- Course progress only fetched when needed
- Module progress fetched on module open
- Quiz questions only fetched when accessing quiz

---

## Browser Compatibility

### Video Player

- Works on all modern browsers
- Uses standard HTML5 `<video>` element
- No external player dependencies
- `controlsList="nodownload"` prevents browser download (optional security)

### Features

- localStorage for auth token (standard browser feature)
- Fetch API (modern browsers)
- ES6+ JavaScript syntax

---

## Accessibility Features

### Video Player

- Keyboard controls (play/pause with spacebar)
- Custom controls still keyboard navigable
- Video title and duration for context

### Quiz

- Clear question numbering
- High contrast colors
- Form labels and clear instructions
- Error messages visible and descriptive

### Documents

- Clear download button labels
- Download status feedback
- Success/failure indicators

---

## Testing Recommendations

### Unit Tests

```javascript
// Test progress calculation
expect(getModuleProgress(module)).toBe(expectedProgress);

// Test unlock logic
expect(isModuleUnlocked).toBe(true || false);

// Test quiz scoring
expect(calculateScore(answers, correctAnswers)).toBe(expectedScore);
```

### Integration Tests

1. User enrolls in course
2. Opens first module (should be unlocked)
3. Watches video (progress tracked)
4. Downloads document (tracked)
5. Marks complete (progress set to 100%)
6. Attempts second module (should unlock if prev at 50%+)
7. Completes course to 50%
8. Takes quiz (should be unlocked)
9. Submits answers (results displayed)

### E2E Tests

- Full learning journey from enrollment to certificate
- Error scenarios (network failures, invalid data)
- Edge cases (rapid clicks, concurrent actions)

---

## Common Issues & Troubleshooting

### Issue: Video not playing

**Solution**: Check video URL is accessible, video format supported

### Issue: Progress not updating

**Solution**: Verify auth token, check network tab for failed requests, ensure API endpoints exist

### Issue: Quiz shows as locked when it should be unlocked

**Solution**: Check `courseProgress.overallProgress >= 50`, verify API returns correct progress

### Issue: Module unlock not working

**Solution**: Ensure `checkModuleUnlock` is called, verify previous module completion, check API response

---

## Deployment Checklist

- [ ] All API endpoints configured in `.env` (`VITE_API_URL`)
- [ ] Video URLs are accessible (CORS headers if external)
- [ ] Document download URLs are accessible
- [ ] Auth tokens stored securely (consider HttpOnly cookies)
- [ ] Error pages user-friendly
- [ ] Loading states work correctly
- [ ] Responsive design tested on mobile
- [ ] Video player tested on target browsers
- [ ] Quiz timeout handling (if needed)
- [ ] Performance monitoring enabled
