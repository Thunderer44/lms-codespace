const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("authToken");

const getHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
  "Content-Type": "application/json",
});

// Get all available courses
export const getAllCourses = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/courses`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch courses");
  }

  return await response.json();
};

// Get single course by ID
export const getCourseById = async (courseId) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch course");
  }

  return await response.json();
};

// Get user's enrolled courses
export const getEnrolledCourses = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/my-courses/enrolled`,
    {
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch enrolled courses");
  }

  return await response.json();
};

// Enroll in a course
export const enrollCourse = async (courseId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/enroll`,
    {
      method: "POST",
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to enroll in course");
  }

  return await response.json();
};
