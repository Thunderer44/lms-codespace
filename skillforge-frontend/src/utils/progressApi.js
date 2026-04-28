// Progress Tracking API utilities
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("authToken");

const getHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
  "Content-Type": "application/json",
});

// Update module progress
export const updateModuleProgress = async (
  courseId,
  moduleId,
  progressData,
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/modules/${moduleId}/progress`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(progressData),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update progress");
  }

  return await response.json();
};

// Get course progress
export const getCourseProgress = async (courseId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/progress`,
    {
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch progress");
  }

  return await response.json();
};

// Check if module is unlocked
export const checkModuleUnlock = async (courseId, moduleId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/modules/${moduleId}/is-unlocked`,
    {
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to check module unlock status");
  }

  return await response.json();
};

// Check if quiz is unlocked
export const checkQuizUnlock = async (courseId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/quiz/is-unlocked`,
    {
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to check quiz unlock status");
  }

  return await response.json();
};

// Get quiz questions
export const getQuiz = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/quiz`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch quiz");
  }

  return await response.json();
};

// Submit quiz answers
export const submitQuiz = async (courseId, answers) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/quiz`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit quiz");
  }

  return await response.json();
};

// Helper function to track document download
export const trackDocumentDownload = async (courseId, moduleId, documentId) => {
  try {
    await updateModuleProgress(courseId, moduleId, { documentId });
  } catch (error) {
    console.error("Failed to track document download:", error);
    // Don't throw - allow download to proceed even if tracking fails
  }
};

// Helper function to update video progress
export const updateVideoProgress = async (
  courseId,
  moduleId,
  watchPercentage,
) => {
  try {
    await updateModuleProgress(courseId, moduleId, {
      videoProgress: watchPercentage,
    });
  } catch (error) {
    console.error("Failed to update video progress:", error);
    // Don't throw - allow viewing to proceed even if tracking fails
  }
};
