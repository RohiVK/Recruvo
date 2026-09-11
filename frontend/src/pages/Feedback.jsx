import React, { useState } from "react";
import { Star, Bug, Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";

export default function Feedback() {
  const { submitFeedback } = useRecruvo();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedState, setSubmittedState] = useState(null); // null | "feedback" | "bug"
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (type = "feedback") => {
    if (rating === 0 && !message.trim()) {
      setErrorMessage("Please select a rating or enter your feedback message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitFeedback({
        rating,
        type,
        message,
      });
      setSubmittedState(type);
      setRating(0);
      setMessage("");
    } catch (err) {
      setErrorMessage(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Feedback</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Help us make Recruvo better. Your feedback means a lot!
        </p>
      </div>

      {/* Main Feedback Card (Matching Wireframe 1) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xs text-center">
        {submittedState ? (
          <div className="py-8 max-w-md mx-auto space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {submittedState === "bug" ? "Bug Report Received!" : "Thank You For Your Feedback!"}
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              We appreciate your time in helping us refine Recruvo's recruitment intelligence platform.
            </p>
            <button
              onClick={() => setSubmittedState(null)}
              className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              Send Another Response
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Top Star Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-gray-900">How would you rate your experience?</h2>
              <p className="text-xs text-gray-400 mt-1">Select your satisfaction rating below</p>
            </div>

            {/* 5-Star Interactive Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoveredRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    title={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? "fill-gray-900 text-gray-900"
                          : "text-gray-300 hover:text-gray-500"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Feedback Textarea with Counter */}
            <div className="text-left space-y-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Share your thoughts (optional)..."
                rows={4}
                className="w-full text-xs text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none leading-relaxed"
              />
              <div className="flex justify-end text-[11px] text-gray-400 font-mono">
                {message.length}/500
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons (Matching Wireframe 1) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSubmit("feedback")}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold shadow-xs transition-colors disabled:opacity-40"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit("bug")}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 text-xs font-bold shadow-2xs transition-colors disabled:opacity-40"
              >
                <Bug className="w-3.5 h-3.5 text-gray-600" />
                <span>Report a Bug</span>
              </button>
            </div>

            {/* Footer Quote (Matching Wireframe 1) */}
            <p className="text-[11px] text-gray-400 italic pt-6">
              Together, we can make hiring simpler and smarter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
