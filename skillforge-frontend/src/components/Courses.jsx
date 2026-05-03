import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllCourses } from "../utils/coursesApi";

export default function ExploreCourses() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAllCourses();

        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Unable to load courses right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;

    return courses.filter((course) => {
      const title = course.title || "";
      const description = course.description || "";
      return (
        title.toLowerCase().includes(q) || description.toLowerCase().includes(q)
      );
    });
  }, [courses, search]);

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-slate-800">
      <header className="sticky top-0 z-50 border-b border-orange-100/70 bg-[#FFF9F4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 shadow-sm"
            >
              <span className="text-lg font-bold">SF</span>
            </button>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900">
                Skill Forge
              </p>
              <p className="text-xs text-slate-500">Explore Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                  Welcome, {user?.name || "Learner"}!
                </span>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Courses
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Explore available courses
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Browse the learning paths available on Skill Forge, read a short
              description, and open the course that fits your goals.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300"
              />
            </div>
            <button
              onClick={() => setSearch("")}
              className="rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
            >
              Clear
            </button>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">
              No courses found
            </p>
            <p className="mt-2 text-slate-600">
              Try a different search term or check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100/60"
              >
                <div className="mb-4 h-2 w-16 rounded-full bg-orange-300" />

                <h2 className="text-xl font-semibold text-slate-900">
                  {course.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {course.description || "No description available."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                    {course.modules?.length || 0} Modules
                  </span>
                  {course.category && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {course.category}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {course.level || "Beginner Friendly"}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/courses/${course._id}`, {
                        state: { course },
                      })
                    }
                    className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
