const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("authToken");

const getHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
  "Content-Type": "application/json",
});

// ===== COURSE MANAGEMENT =====

// Get all courses (admin)
export const getAllCoursesAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch courses");
  }

  return await response.json();
};

// Create a course
export const createCourse = async (courseData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create course");
  }

  return await response.json();
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/courses/${courseId}`,
    {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(courseData),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update course");
  }

  return await response.json();
};

// Delete a course
export const deleteCourse = async (courseId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/courses/${courseId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete course");
  }

  return await response.json();
};

// ===== USER MANAGEMENT =====

// Get all users (admin)
export const getAllUsersAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch users");
  }

  return await response.json();
};

// Create a user
export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create user");
  }

  return await response.json();
};

// Update a user
export const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update user");
  }

  return await response.json();
};

// Delete a user
export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete user");
  }

  return await response.json();
};
