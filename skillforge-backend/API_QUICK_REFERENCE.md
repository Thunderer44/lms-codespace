# API Quick Reference Guide

## Base URL

```
http://localhost:5000/api/courses
```

## Headers

All endpoints (except public ones) require:

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

---

## Quick API Summary

| Method | Endpoint                                   | Auth | Purpose                                |
| ------ | ------------------------------------------ | ---- | -------------------------------------- |
| `POST` | `/:courseId/modules/:moduleId/progress`    | ✅   | Update module progress/video/documents |
| `GET`  | `/:courseId/progress`                      | ✅   | Get user's complete course progress    |
| `GET`  | `/:courseId/modules/:moduleId/is-unlocked` | ✅   | Check if module is unlocked            |
| `GET`  | `/:courseId/quiz/is-unlocked`              | ✅   | Check if quiz is unlocked              |
| `GET`  | `/:courseId/quiz`                          | ✅   | Get quiz questions (no answers)        |
| `POST` | `/:courseId/quiz`                          | ✅   | Submit quiz and get results            |

---

## Code Examples

### 1. Update Module Progress (Video Watch)

```javascript
async function updateVideoProgress(courseId, moduleId, watchPercentage) {
  const response = await fetch(
    `/api/courses/${courseId}/modules/${moduleId}/progress`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoProgress: watchPercentage }),
    },
  );

  if (!response.ok) throw new Error("Failed to update progress");
  return await response.json();
}

// Usage in React component
useEffect(() => {
  const handleVideoProgress = (event) => {
    const video = event.target;
    const percent = (video.currentTime / video.duration) * 100;
    updateVideoProgress(courseId, moduleId, percent);
  };

  const video = videoRef.current;
  video?.addEventListener("timeupdate", handleVideoProgress);

  return () => video?.removeEventListener("timeupdate", handleVideoProgress);
}, [courseId, moduleId]);
```

### 2. Mark Module Complete

```javascript
async function completeModule(courseId, moduleId) {
  const response = await fetch(
    `/api/courses/${courseId}/modules/${moduleId}/progress`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ progress: 100 }),
    },
  );

  if (!response.ok) throw new Error("Failed to complete module");
  const data = await response.json();

  console.log(`Overall course progress: ${data.overallProgress}%`);
  return data;
}

// Usage
<button onClick={() => completeModule(courseId, moduleId)}>
  Mark as Complete
</button>;
```

### 3. Get Course Progress Overview

```javascript
async function getCourseProgress(courseId) {
  const response = await fetch(`/api/courses/${courseId}/progress`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch progress");
  return await response.json();
}

// Usage in Component
const [progress, setProgress] = useState(null);

useEffect(() => {
  getCourseProgress(courseId).then(setProgress);
}, [courseId]);

// Display progress
{
  progress && (
    <div>
      <p>Course Progress: {progress.overallProgress}%</p>
      <ul>
        {progress.modules.map((m) => (
          <li key={m.moduleId}>
            {m.title}: {m.progress}%{m.completed && <span> ✓ Completed</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. Check if Next Module is Unlocked

```javascript
async function isModuleUnlocked(courseId, moduleId) {
  const response = await fetch(
    `/api/courses/${courseId}/modules/${moduleId}/is-unlocked`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to check unlock status");
  return await response.json();
}

// Usage
const { isUnlocked, currentProgress, requiredProgress } =
  await isModuleUnlocked(courseId, moduleId);

if (!isUnlocked) {
  alert(
    `Complete ${requiredProgress}% of the previous module to unlock this one. Current: ${currentProgress}%`,
  );
}
```

### 5. Take Quiz

```javascript
async function takeQuiz(courseId) {
  // Check if quiz is unlocked
  const unlockCheck = await fetch(`/api/courses/${courseId}/quiz/is-unlocked`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const unlock = await unlockCheck.json();

  if (!unlock.isUnlocked) {
    alert(
      `Quiz unlocks at ${unlock.requiredProgress}% course completion. Current: ${unlock.currentProgress}%`,
    );
    return;
  }

  // Get quiz questions
  const quizRes = await fetch(`/api/courses/${courseId}/quiz`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const quiz = await quizRes.json();

  // Display quiz and collect answers
  return quiz;
}

async function submitQuizAnswers(courseId, answers) {
  // answers format: { questionId: optionIndex, ... }
  const response = await fetch(`/api/courses/${courseId}/quiz`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) throw new Error("Failed to submit quiz");
  return await response.json();
}

// Usage
const [answers, setAnswers] = useState({});

const handleAnswerChange = (questionId, optionIndex) => {
  setAnswers((prev) => ({
    ...prev,
    [questionId]: optionIndex,
  }));
};

const handleSubmitQuiz = async () => {
  const result = await submitQuizAnswers(courseId, answers);

  console.log(`Score: ${result.score}%`);
  console.log(`Passed: ${result.passed}`);
  console.log("Detailed Results:", result.detailedResults);
};
```

### 6. Track Document Download

```javascript
async function trackDocumentDownload(courseId, moduleId, documentId) {
  const response = await fetch(
    `/api/courses/${courseId}/modules/${moduleId}/progress`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentId }),
    },
  );

  if (!response.ok) throw new Error("Failed to track download");
  return await response.json();
}

// Usage in component
const handleDocumentDownload = (documentId, downloadUrl) => {
  trackDocumentDownload(courseId, moduleId, documentId);
  window.open(downloadUrl, "_blank");
};

// In JSX
<a
  href={doc.downloadUrl}
  onClick={() => handleDocumentDownload(doc._id, doc.downloadUrl)}
>
  Download {doc.title}
</a>;
```

---

## React Hooks for Progress Tracking

```javascript
// Custom hook for managing module progress
function useModuleProgress(courseId, moduleId) {
  const [progress, setProgress] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressRes = await fetch(`/api/courses/${courseId}/progress`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const progressData = await progressRes.json();

        const moduleProgress = progressData.modules.find(
          (m) => m.moduleId === moduleId,
        );
        setProgress(moduleProgress);

        const unlockedRes = await fetch(
          `/api/courses/${courseId}/modules/${moduleId}/is-unlocked`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const unlockedData = await unlockedRes.json();
        setIsUnlocked(unlockedData.isUnlocked);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, moduleId]);

  const updateProgress = async (progressValue, videoValue, docId) => {
    const body = {};
    if (progressValue !== undefined) body.progress = progressValue;
    if (videoValue !== undefined) body.videoProgress = videoValue;
    if (docId !== undefined) body.documentId = docId;

    const response = await fetch(
      `/api/courses/${courseId}/modules/${moduleId}/progress`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (response.ok) {
      const newProgress = await response.json();
      setProgress({
        ...progress,
        ...newProgress.moduleProgress,
      });
    }
  };

  return { progress, isUnlocked, loading, updateProgress };
}

// Usage in component
function ModuleView({ courseId, moduleId }) {
  const { progress, isUnlocked, loading, updateProgress } = useModuleProgress(
    courseId,
    moduleId,
  );

  if (!isUnlocked && !loading) {
    return <div>Module locked. Complete previous module first.</div>;
  }

  return (
    <div>
      <h2>Module Progress: {progress?.progress}%</h2>
      <button onClick={() => updateProgress(100)}>Complete Module</button>
    </div>
  );
}
```

---

## Error Handling

```javascript
async function handleApiError(response) {
  if (!response.ok) {
    const error = await response.json();

    if (response.status === 403) {
      // Feature locked
      throw new Error(`Feature locked: ${error.message}`);
    } else if (response.status === 404) {
      // Not found
      throw new Error(`Not found: ${error.message}`);
    } else if (response.status === 400) {
      // Bad request
      throw new Error(`Invalid request: ${error.message}`);
    } else {
      throw new Error(error.message || "An error occurred");
    }
  }

  return response.json();
}

// Usage
try {
  await updateModuleProgress(courseId, moduleId, { progress: 50 });
} catch (error) {
  console.error(error.message);
  // Show user-friendly error message
}
```

---

## Response Status Codes

| Code  | Meaning                                  |
| ----- | ---------------------------------------- |
| `200` | Success                                  |
| `400` | Bad request (validation error)           |
| `401` | Unauthorized (missing token)             |
| `403` | Forbidden (feature locked, not enrolled) |
| `404` | Not found (course/module/quiz not found) |
| `500` | Server error                             |

---

## Testing with cURL

```bash
# 1. Get auth token (from login endpoint)
TOKEN="your_jwt_token_here"

# 2. Update progress
curl -X POST http://localhost:5000/api/courses/COURSE_ID/modules/MODULE_ID/progress \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}'

# 3. Get course progress
curl http://localhost:5000/api/courses/COURSE_ID/progress \
  -H "Authorization: Bearer $TOKEN"

# 4. Check module unlock
curl http://localhost:5000/api/courses/COURSE_ID/modules/MODULE_ID/is-unlocked \
  -H "Authorization: Bearer $TOKEN"

# 5. Get quiz
curl http://localhost:5000/api/courses/COURSE_ID/quiz \
  -H "Authorization: Bearer $TOKEN"

# 6. Submit quiz
curl -X POST http://localhost:5000/api/courses/COURSE_ID/quiz \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "QUESTION_ID_1": 0,
      "QUESTION_ID_2": 2
    }
  }'
```
