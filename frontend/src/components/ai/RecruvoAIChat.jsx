import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle, Trash2, Zap, CornerDownLeft } from "lucide-react";
import { useRecruvo } from "../../context/RecruvoContext";

// Clean formatter that turns markdown artifacts into clean, readable UI elements
function FormattedMessage({ content, isGenz = false }) {
  if (!content) return null;

  const lines = String(content).split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        let cleanLine = line.trim();

        // Remove heading hashes like ### or ##
        cleanLine = cleanLine.replace(/^#{1,6}\s*/, "");

        // Remove markdown horizontal rules
        if (cleanLine === "---" || cleanLine === "***" || cleanLine === "___") {
          return (
            <div
              key={idx}
              className={`my-2 border-b ${
                isGenz ? "border-white/10" : "border-slate-200/60"
              }`}
            />
          );
        }

        if (!cleanLine) {
          return <div key={idx} className="h-1" />;
        }

        // Check if line is a bullet item (starting with *, -, or •)
        const isBullet = /^[\*\-\•]\s+/.test(cleanLine);
        const isNumbered = /^\d+\.\s+/.test(cleanLine);

        let prefix = null;
        if (isBullet) {
          cleanLine = cleanLine.replace(/^[\*\-\•]\s+/, "");
        } else if (isNumbered) {
          const match = cleanLine.match(/^(\d+\.)\s+/);
          if (match) {
            prefix = match[1];
            cleanLine = cleanLine.replace(/^\d+\.\s+/, "");
          }
        }

        // Inline formatting helper
        const renderFormattedText = (text) => {
          if (!text) return "";
          const tokens = [];
          const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
          let match;
          let lastIndex = 0;

          while ((match = pattern.exec(text)) !== null) {
            if (match.index > lastIndex) {
              tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
            }
            const tokenStr = match[0];
            if (tokenStr.startsWith("**") && tokenStr.endsWith("**")) {
              tokens.push({ type: "bold", value: tokenStr.slice(2, -2) });
            } else if (
              (tokenStr.startsWith("*") && tokenStr.endsWith("*")) ||
              (tokenStr.startsWith("_") && tokenStr.endsWith("_"))
            ) {
              tokens.push({ type: "italic", value: tokenStr.slice(1, -1) });
            }
            lastIndex = pattern.lastIndex;
          }

          if (lastIndex < text.length) {
            tokens.push({ type: "text", value: text.slice(lastIndex) });
          }

          if (tokens.length === 0) {
            return text.replace(/\*/g, "");
          }

          return tokens.map((token, tIdx) => {
            const cleanVal = token.value.replace(/\*/g, "");
            if (token.type === "bold") {
              return (
                <strong
                  key={tIdx}
                  className={`font-semibold ${
                    isGenz ? "text-indigo-200 font-bold" : "text-slate-900"
                  }`}
                >
                  {cleanVal}
                </strong>
              );
            }
            if (token.type === "italic") {
              return (
                <span
                  key={tIdx}
                  className={`italic ${isGenz ? "text-slate-300" : "text-slate-700"}`}
                >
                  {cleanVal}
                </span>
              );
            }
            return cleanVal;
          });
        };

        if (isBullet) {
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 pl-1 ${
                isGenz ? "text-slate-200" : "text-slate-700"
              }`}
            >
              <span
                className={`font-black select-none leading-tight ${
                  isGenz ? "text-indigo-400" : "text-slate-400"
                }`}
              >
                •
              </span>
              <span className="flex-1">{renderFormattedText(cleanLine)}</span>
            </div>
          );
        }

        if (prefix) {
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 pl-1 ${
                isGenz ? "text-slate-200" : "text-slate-700"
              }`}
            >
              <span
                className={`font-bold select-none min-w-4 leading-tight ${
                  isGenz ? "text-indigo-400" : "text-slate-500"
                }`}
              >
                {prefix}
              </span>
              <span className="flex-1">{renderFormattedText(cleanLine)}</span>
            </div>
          );
        }

        const isHeader = cleanLine.endsWith(":") && cleanLine.length < 60;

        return (
          <div
            key={idx}
            className={
              isHeader
                ? `font-bold pt-1 ${isGenz ? "text-indigo-300" : "text-slate-900"}`
                : isGenz
                ? "text-slate-200"
                : "text-slate-700"
            }
          >
            {renderFormattedText(cleanLine)}
          </div>
        );
      })}
    </div>
  );
}

export default function RecruvoAIChat({
  candidateId,
  comparisonCandidateId,
  candidateName,
  comparisonCandidateName,
  initialSuggestions,
  title = "Recruvo AI",
  compact = false,
}) {
  const { sendChat, getChatHistory, clearChatHistory, activeJob, theme } = useRecruvo();
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const isGenz = theme === "genz";

  const sessionKey = comparisonCandidateId
    ? `comp-${candidateId}-${comparisonCandidateId}`
    : `cand-${candidateId || "general"}`;

  const history = getChatHistory(sessionKey);

  // Quick action suggestions
  const defaultSuggestions = comparisonCandidateId
    ? [
        "Which candidate is stronger technically?",
        "Who has more relevant experience?",
        "What are the biggest differences between them?",
        "Which candidate has fewer skill gaps?",
        "Summarize the tradeoffs.",
      ]
    : candidateId
    ? [
        "Summarize this candidate",
        "Suggest interview questions",
        `Why is ${candidateName || "this candidate"} a good match?`,
        "What skills are missing?",
        "What are the biggest concerns?",
      ]
    : [
        "How do these candidates align with the JD?",
        "What are the most common skill gaps?",
        "Suggest top interview questions for this role",
      ];

  const suggestions = initialSuggestions || defaultSuggestions;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isSending]);

  const handleSend = async (messageToSend = inputMessage) => {
    const text = (messageToSend || "").trim();
    if (!text || isSending) return;

    setInputMessage("");
    setErrorMessage(null);
    setIsSending(true);

    try {
      await sendChat({
        message: text,
        context: {
          jobId: activeJob?.id,
          candidateId,
          comparisonCandidateId,
        },
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to communicate with AI");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border transition-all duration-300 overflow-hidden ${
        isGenz
          ? "bg-[#111320] border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)]"
          : "bg-white border-slate-200 shadow-xs"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3.5 border-b flex items-center justify-between ${
          isGenz
            ? "bg-[#161828]/90 border-white/[0.08]"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold transition-all ${
              isGenz
                ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                : "bg-slate-900 text-white"
            }`}
          >
            {isGenz ? <Sparkles className="w-4 h-4 text-white animate-pulse" /> : <Bot className="w-4 h-4" />}
          </div>
          <div>
            <h3
              className={`text-xs font-bold leading-tight ${
                isGenz ? "text-slate-100" : "text-slate-900"
              }`}
            >
              {title}
            </h3>
            <p className={`text-[10px] ${isGenz ? "text-indigo-300/80 font-mono" : "text-slate-500"}`}>
              Grounded Decision Intelligence
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => clearChatHistory(sessionKey)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isGenz
                ? "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            }`}
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 min-h-[260px] max-h-[500px]">
        {history.length === 0 ? (
          <div className="text-center py-6 px-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2.5 ${
                isGenz
                  ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_-3px_rgba(99,102,241,0.3)]"
                  : "bg-slate-100 text-slate-800 border border-slate-200"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <p
              className={`text-xs font-bold mb-1 ${
                isGenz ? "text-slate-100" : "text-slate-800"
              }`}
            >
              {comparisonCandidateId
                ? `Comparing ${candidateName || "Candidate A"} & ${comparisonCandidateName || "Candidate B"}`
                : candidateId
                ? `Evaluating ${candidateName || "Candidate"}`
                : "Recruvo Decision AI"}
            </p>
            <p
              className={`text-[11px] max-w-[240px] mx-auto mb-4 ${
                isGenz ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Grounded exclusively in the active Job Description and candidate resumes.
            </p>

            {/* Initial suggestion pills */}
            <div className="flex flex-col gap-1.5 text-left">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  className={`text-xs text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between group ${
                    isGenz
                      ? "bg-white/[0.03] hover:bg-indigo-600/20 border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <span className="truncate mr-2">{sug}</span>
                  <Sparkles
                    className={`w-3 h-3 shrink-0 transition-colors ${
                      isGenz
                        ? "text-indigo-400 group-hover:text-amber-300"
                        : "text-slate-400 group-hover:text-slate-900"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          history.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isGenz
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xs"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? isGenz
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                      : "bg-slate-900 text-white rounded-br-none"
                    : msg.isError
                    ? "bg-rose-50 border border-rose-200 text-rose-700 rounded-bl-none"
                    : isGenz
                    ? "bg-[#181B2C] text-slate-200 rounded-bl-none border border-white/[0.08]"
                    : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60"
                }`}
              >
                <FormattedMessage content={msg.content} isGenz={isGenz} />
              </div>

              {msg.role === "user" && (
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isGenz
                      ? "bg-white/10 text-slate-300 border border-white/10"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isSending && (
          <div className="flex gap-2.5 justify-start">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isGenz
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div
              className={`rounded-2xl rounded-bl-none px-3.5 py-2.5 text-xs flex items-center gap-2 border ${
                isGenz
                  ? "bg-[#181B2C] border-white/10 text-indigo-300"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing grounded documents...</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
              isGenz
                ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleSend()}
              className="underline font-bold text-[11px] hover:opacity-80"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Bar when active */}
      {history.length > 0 && (
        <div
          className={`px-3 py-1.5 border-t flex gap-1.5 overflow-x-auto no-scrollbar ${
            isGenz
              ? "bg-[#141626] border-white/[0.08]"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          {suggestions.slice(0, 3).map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              disabled={isSending}
              className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors shrink-0 disabled:opacity-50 ${
                isGenz
                  ? "bg-white/[0.04] hover:bg-indigo-600/30 border-white/10 text-slate-300 hover:text-white"
                  : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Box Footer */}
      <div
        className={`p-3 border-t ${
          isGenz ? "bg-[#0E1018] border-white/[0.08]" : "bg-white border-slate-200"
        }`}
      >
        <div className="relative flex items-center">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Recruvo AI (e.g. Strengths, gap analysis, interview prep)..."
            rows={compact ? 1 : 2}
            disabled={isSending}
            className={`w-full text-xs rounded-xl pl-3 pr-10 py-2.5 focus:outline-none transition-all resize-none border ${
              isGenz
                ? "bg-[#141724] border-white/10 text-slate-100 placeholder-slate-500 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            }`}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || isSending}
            className={`absolute right-2 bottom-2.5 p-1.5 rounded-lg transition-all disabled:opacity-30 ${
              isGenz
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                : "bg-slate-900 text-white hover:bg-black"
            }`}
            title="Send (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] opacity-50 mt-1 px-1">
          <span>Enter to send • Shift+Enter for newline</span>
          <span>100% Grounded</span>
        </div>
      </div>
    </div>
  );
}
