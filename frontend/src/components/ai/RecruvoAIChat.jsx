import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle, Trash2 } from "lucide-react";
import { useRecruvo } from "../../context/RecruvoContext";

// Clean formatter that turns markdown artifacts into clean, readable UI elements
function FormattedMessage({ content }) {
  if (!content) return null;

  // Split lines
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        let cleanLine = line.trim();

        // Remove heading hashes like ### or ##
        cleanLine = cleanLine.replace(/^#{1,6}\s*/, "");

        // Remove markdown horizontal rules
        if (cleanLine === "---" || cleanLine === "***" || cleanLine === "___") {
          return <div key={idx} className="border-b border-gray-200/60 my-2" />;
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
          // Tokenize bold **text** and italic *text* or _text_
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
                <strong key={tIdx} className="font-semibold text-gray-900">
                  {cleanVal}
                </strong>
              );
            }
            if (token.type === "italic") {
              return (
                <span key={tIdx} className="italic text-gray-700">
                  {cleanVal}
                </span>
              );
            }
            return cleanVal;
          });
        };

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 text-gray-700">
              <span className="text-gray-400 font-bold leading-tight select-none">•</span>
              <span className="flex-1">{renderFormattedText(cleanLine)}</span>
            </div>
          );
        }

        if (prefix) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 text-gray-700">
              <span className="text-gray-500 font-semibold leading-tight select-none min-w-4">
                {prefix}
              </span>
              <span className="flex-1">{renderFormattedText(cleanLine)}</span>
            </div>
          );
        }

        // Check if line looks like a header (e.g. "Active Job Context:" or "How I Can Help You Today:")
        const isHeader = cleanLine.endsWith(":") && cleanLine.length < 60;

        return (
          <div
            key={idx}
            className={isHeader ? "font-semibold text-gray-900 pt-1" : "text-gray-700"}
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
  const { sendChat, getChatHistory, clearChatHistory, activeJob } = useRecruvo();
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const sessionKey = comparisonCandidateId
    ? `comp-${candidateId}-${comparisonCandidateId}`
    : `cand-${candidateId || "general"}`;

  const history = getChatHistory(sessionKey);

  // Default quick action suggestions
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
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-[11px] text-gray-500">Contextual Recruitment Intelligence</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => clearChatHistory(sessionKey)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200/60 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 min-h-[260px] max-h-[480px]">
        {history.length === 0 ? (
          <div className="text-center py-6 px-2">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2.5 text-gray-600">
              <Sparkles className="w-5 h-5 text-gray-800" />
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">
              {comparisonCandidateId
                ? `Comparing ${candidateName || "Candidate A"} & ${comparisonCandidateName || "Candidate B"}`
                : candidateId
                ? `Analyzing ${candidateName || "Candidate"}`
                : "Ask Recruvo AI"}
            </p>
            <p className="text-xs text-gray-500 max-w-[240px] mx-auto mb-4">
              Grounded exclusively in the active Job Description and candidate resumes.
            </p>

            {/* Initial suggestion pills */}
            <div className="flex flex-col gap-1.5 text-left">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  className="text-xs text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 transition-all hover:border-gray-300 flex items-center justify-between group"
                >
                  <span>{sug}</span>
                  <Sparkles className="w-3 h-3 text-gray-400 group-hover:text-gray-900 transition-colors shrink-0 ml-2" />
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
                <div className="w-6 h-6 rounded-md bg-gray-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gray-900 text-white rounded-br-none"
                    : msg.isError
                    ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200/60"
                }`}
              >
                <FormattedMessage content={msg.content} />
              </div>

              {msg.role === "user" && (
                <div className="w-6 h-6 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isSending && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-md bg-gray-900 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-gray-100 border border-gray-200/60 rounded-xl rounded-bl-none px-3.5 py-2.5 text-xs text-gray-600 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-gray-500" />
              <span>Recruvo AI is thinking...</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleSend()}
              className="underline font-medium hover:text-red-900 text-[11px]"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Bar when in active chat */}
      {history.length > 0 && (
        <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {suggestions.slice(0, 3).map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              disabled={isSending}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 disabled:opacity-50 transition-colors shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Footer */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="relative flex items-center">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={compact ? 1 : 2}
            disabled={isSending}
            className="w-full text-xs text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || isSending}
            className="absolute right-2 bottom-2 p-1.5 rounded-md bg-gray-900 text-white hover:bg-black disabled:opacity-40 disabled:hover:bg-gray-900 transition-colors"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center">
          Recruvo AI answers strictly using uploaded candidate & JD records.
        </p>
      </div>
    </div>
  );
}
