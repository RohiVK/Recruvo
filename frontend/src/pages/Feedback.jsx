import React, { useState } from "react";
import { Star, CheckCircle2, AlertCircle } from "lucide-react";
import { useRecruvo } from "../context/RecruvoContext";

export default function Feedback() {
  const { submitFeedback } = useRecruvo();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 && !message.trim()) {
      setErrorMessage("Please select a rating or leave a comment.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const fullMessage = [
      message.trim(),
      email.trim() ? `Contact: ${email.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await submitFeedback({
        rating: rating || null,
        type: "feedback",
        message: fullMessage,
      });

      setIsSuccess(true);
      setMessage("");
      setEmail("");
      setRating(0);
    } catch (err) {
      setErrorMessage(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Feedback
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          We’d love to hear what you think of Recruvo.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">
              Thank you for your feedback!
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your notes have been sent to our team. We appreciate you taking the time to share your thoughts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-xs font-semibold text-slate-900 hover:underline pt-2 cursor-pointer"
          >
            Submit more feedback
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs"
        >
          {/* Star Rating in Gold */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Overall rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoveredRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        isFilled
                          ? "fill-[#F59E0B] text-[#D97706]"
                          : "fill-transparent text-slate-300 hover:text-amber-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Comments */}
          <div>
            <label
              htmlFor="feedback-message"
              className="block text-xs font-semibold text-[#263238] mb-1.5"
            >
              Comments
            </label>
            <textarea
              id="feedback-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience, report an issue, or suggest an improvement..."
              className="w-full text-xs rounded-xl p-3.5 border border-[#CFD8DC] text-[#263238] placeholder-[#90A4AE] focus:outline-none focus:border-[#4CAF4F] focus:ring-1 focus:ring-[#4CAF4F] leading-relaxed resize-none"
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label
              htmlFor="feedback-email"
              className="block text-xs font-semibold text-[#263238] mb-1.5"
            >
              Email <span className="font-normal text-[#717171]">(optional)</span>
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-[#CFD8DC] text-[#263238] placeholder-[#90A4AE] focus:outline-none focus:border-[#4CAF4F] focus:ring-1 focus:ring-[#4CAF4F]"
            />
            <p className="text-[11px] text-[#717171] mt-1">
              We’ll only use this if we need to follow up with you.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-md text-xs font-semibold text-white bg-[#4CAF4F] hover:bg-[#43A047] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? "Submitting..." : "Submit feedback"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
