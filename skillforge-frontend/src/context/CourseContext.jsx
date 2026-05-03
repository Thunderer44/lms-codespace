import React, { createContext, useContext, useState, useCallback } from "react";
import { getEnrolledCourses, getCourseById } from "../utils/coursesApi";
import { getCourseProgress } from "../utils/progressApi";

const CourseContext = createContext();

export const CourseProvider = ({ children, courseId }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const courses = await getEnrolledCourses();
      setEnrolledCourses(courses);
      return courses;
    } catch (err) {
      setError(err.message || "Failed to fetch courses");
      console.error("Failed to fetch enrolled courses:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch specific course
  const fetchCourse = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError("");
      const course = await getCourseById(id);
      setCurrentCourse(course);
      return course;
    } catch (err) {
      setError(err.message || "Failed to fetch course");
      console.error("Failed to fetch course:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch course progress
  const fetchCourseProgress = useCallback(async (id) => {
    try {
      const progress = await getCourseProgress(id);
      setCourseProgress(progress);
      return progress;
    } catch (err) {
      console.error("Failed to fetch course progress:", err);
      return null;
    }
  }, []);

  // Refresh progress (called after module completion, quiz submission, etc)
  const refreshProgress = useCallback(
    async (id) => {
      if (id) {
        await fetchCourseProgress(id);
      }
    },
    [fetchCourseProgress],
  );

  const value = {
    enrolledCourses,
    currentCourse,
    courseProgress,
    isLoading,
    error,
    fetchEnrolledCourses,
    fetchCourse,
    fetchCourseProgress,
    refreshProgress,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
};
