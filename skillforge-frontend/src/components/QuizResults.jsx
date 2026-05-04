import React, { useEffect } from "react";
import { getCourseProgress } from "../utils/progressApi";

export default function QuizResults({ results, courseId }) {
  useEffect(() => {
    const getExistingResult = async () => {
      try {
        const existingResult = await getCourseProgress(courseId);
        if (existingResult && !results) {
          // Results already loaded
        }
      } catch (error) {
        console.error("Failed to fetch quiz results:", error);
      }
    };

    if (courseId) {
      getExistingResult();
    }
  }, [courseId, results]);

  if (!results) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">Loading quiz results...</p>
      </div>
    );
  }

  const resultIcon = results.passed ? "✓" : "✕";
  const isMultipleAttempts = results.attemptsUsed && results.attemptsUsed > 1;

  return (
    <div className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
      {/* Results header */}
      <div
        className={`bg-gradient-to-r ${
          results.passed
            ? "from-green-500 to-emerald-500"
            : "from-red-500 to-orange-500"
        } px-6 py-12 text-white text-center`}
      >
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 mb-6">
          <span className="text-4xl font-bold">{resultIcon}</span>
        </div>

        <h2 className="text-3xl font-bold mb-2">
          {results.passed ? "Quiz Passed! 🎉" : "Quiz Not Passed"}
        </h2>
        <p className="text-white/90 mb-6">
          {results.passed
            ? "Congratulations! You have successfully completed this course quiz."
            : "You can retake the quiz to improve your score."}
        </p>

        {isMultipleAttempts && (
          <p className="text-white/80 text-sm mb-6">
            Showing results from attempt {results.attemptsUsed} of{" "}
            {results.attemptsUsed + results.attemptsRemaining}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-3 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <p className="text-sm text-white/80 mb-1">Your Score</p>
            <p className="text-3xl font-bold">{Math.round(results.score)}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <p className="text-sm text-white/80 mb-1">Passing Score</p>
            <p className="text-3xl font-bold">{results.passingScore}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <p className="text-sm text-white/80 mb-1">Correct Answers</p>
            <p className="text-3xl font-bold">
              {results.correctAnswers}/{results.totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="p-8 bg-slate-50 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">Score Breakdown</span>
            <span className="font-semibold text-slate-900">
              {Math.round(results.score)}%
            </span>
          </div>
          <div className="h-3 bg-slate-300 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                results.passed ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.round(results.score)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 pt-1">
            <span>0%</span>
            <span>{results.passingScore}% (Passing)</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Detailed results */}
      <div className="p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Review Your Answers
        </h3>

        <div className="space-y-6">
          {results.detailedResults &&
            results.detailedResults.map((result, idx) => (
              <div
                key={result.questionId}
                className={`rounded-lg border-2 p-6 ${
                  result.isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                      result.isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {result.isCorrect ? "✓" : "✕"}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Question {idx + 1}: {result.questionText}
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-700 font-medium mb-1">
                          Your answer:
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            result.isCorrect ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {result.selectedOption || "Not answered"}
                        </p>
                      </div>

                      {!result.isCorrect && (
                        <div>
                          <p className="text-sm text-slate-700 font-medium mb-1">
                            Correct answer:
                          </p>
                          <p className="text-sm font-medium text-green-700">
                            {result.correctOption}
                          </p>
                        </div>
                      )}

                      {result.explanation && (
                        <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                          <p className="text-sm text-slate-700 font-medium mb-1">
                            Explanation:
                          </p>
                          <p className="text-sm text-slate-600">
                            {result.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-slate-200 px-8 py-6 flex gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-medium hover:border-slate-400 transition"
        >
          Back to Course
        </button>
        {/* {!results.passed && results.attemptsRemaining > 0 && (
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-6 py-3 rounded-full bg-orange-600 text-white font-medium hover:bg-orange-700 transition"
          >
            Retake Quiz ({results.attemptsRemaining} remaining)
          </button>
        )} */}
        {results.attemptsRemaining === 0 && (
          <button
            disabled
            className="flex-1 px-6 py-3 rounded-full bg-slate-300 text-slate-600 font-medium cursor-not-allowed"
          >
            No More Attempts Available
          </button>
        )}
      </div>
    </div>
  );
}
