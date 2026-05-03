// Progress Tracking API utilities
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
});

// Login
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    return { success: true, user: data.user, token: data.token };
  } else {
    const error = await response.json();
    return { success: false, error: error.message };
  }
};

// Signup
export const signup = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    return { success: true, user: data.user, token: data.token };
  } else {
    const error = await response.json();
    return { success: false, error: error.message };
  }
};

// Check Auth (verify token)
export const checkAuth = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return { success: false, user: null };
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const userData = await response.json();
    return { success: true, user: userData };
  } else {
    localStorage.removeItem("authToken");
    return { success: false, user: null };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("authToken");
};
