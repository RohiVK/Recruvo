import React, { useState } from "react";
import { Star, Bug, Send, CheckCircle2, AlertCircle, Sparkles, Heart } from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";
import BentoCard from "../components/ui/BentoCard";

export default function Feedback() {
  const { submitFeedback, theme } = useRecruvo();
  const isGenz = theme === "genz";

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
    <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Platform Feedback & Suggestions</h1>
        <p className={`text-xs md:text-sm mt-0.5 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
          Help us refine Recruvo's candidate screening intelligence.
        </p>
      </div>

      {/* Main Feedback Card */}
      <BentoCard className="p-8 md:p-12 text-center">
        {submittedState ? (
          <div className="py-8 max-w-md mx-auto space-y-4 animate-fadeIn">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${
                isGenz
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              }`}
            >
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold">
              {submittedState === "bug" ? "Bug Report Received!" : "Thank You For Your Feedback!"}
            </h2>
            <p className={`text-xs leading-relaxed ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
              We appreciate your partnership in refining Recruvo's recruitment decision intelligence.
            </p>
            <button
              onClick={() => setSubmittedState(null)}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                isGenz ? "bg-indigo-600 hover:bg-indigo-500 shadow-xs" : "bg-slate-900 hover:bg-black"
              }`}
            >
              Submit Another Note
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Top Icon */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border ${
                isGenz
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "bg-slate-100 border-slate-200 text-slate-900"
              }`}
            >
              <Sparkles className="w-6 h-6" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold">How would you rate your experience?</h2>
              <p className={`text-xs mt-1 ${isGenz ? "text-slate-400" : "text-slate-500"}`}>
                Select your satisfaction rating below
              </p>
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
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    title={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? isGenz
                            ? "fill-amber-300 text-amber-300 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                            : "fill-slate-900 text-slate-900"
                          : isGenz
                          ? "text-slate-600 hover:text-slate-400"
                          : "text-slate-300 hover:text-slate-500"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Feedback Textarea */}
            <div className="text-left space-y-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Share thoughts, feature requests, or notes on screening accuracy..."
                rows={4}
                className={`w-full text-xs rounded-xl p-3.5 focus:outline-none transition-all resize-none border ${
                  isGenz
                    ? "bg-[#141724] border-white/10 text-slate-100 placeholder-slate-500 focus:border-indigo-500/80"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-900"
                }`}
              />
              <div className="flex justify-end text-[11px] font-mono opacity-50">
                {message.length}/500
              </div>
            </div>

            {errorMessage && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-center gap-2 ${
                  isGenz
                    ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSubmit("feedback")}
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40 shadow-xs ${
                  isGenz
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)]"
                    : "bg-slate-900 hover:bg-black"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit("bug")}
                disabled={isSubmitting}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 ${
                  isGenz
                    ? "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/10"
                    : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                <span>Report a Bug</span>
              </button>
            </div>

            {/* Footer Quote */}
            <p className="text-[11px] opacity-50 italic pt-4 flex items-center justify-center gap-1">
              <span>Together, we make hiring smarter and teams brighter.</span>
              <Heart className="w-3 h-3 text-rose-500 inline fill-current" />
            </p>
          </div>
        )}
      </BentoCard>
    </div>
  );
}
