import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, RefreshCw, AlertCircle, Trash2, ArrowRight, MessageSquare } from "lucide-react";
import { useRecruvo } from "../../context/RecruvoContext";

// Clean formatter that turns markdown artifacts into clean, readable UI elements
function FormattedMessage({ content }) {
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
          return <div key={idx} className="my-2 border-b border-slate-200" />;
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
            tokens.push({ type: "formatted", value: match[0] });
            lastIndex = pattern.lastIndex;
          }

          if (lastIndex < text.length) {
            tokens.push({ type: "text", value: text.slice(lastIndex) });
          }

          return tokens.map((tok, tIdx) => {
            if (tok.type === "text") {
              return tok.value;
            }
            const inner = tok.value.replace(/^(\*\*|\*|_)|(\*\*|\*|_)$/g, "");
            return (
              <strong key={tIdx} className="font-semibold text-slate-900">
                {inner}
              </strong>
            );
          });
        };

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-slate-700" />
              <span>{renderFormattedText(cleanLine)}</span>
            </div>
          );
        }

        if (isNumbered) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="font-bold text-[11px] shrink-0 text-slate-700">{prefix}</span>
              <span>{renderFormattedText(cleanLine)}</span>
            </div>
          );
        }

        return <p key={idx}>{renderFormattedText(cleanLine)}</p>;
      })}
    </div>
  );
}

export default function RecruvoAIChat({
  candidateId = null,
  candidateName = null,
  comparisonCandidateId = null,
  comparisonCandidateName = null,
  title = "Candidate Inquiry Assistant",
  compact = false,
  initialSuggestions = [],
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isSending]);

  const defaultSuggestions = comparisonCandidateId
    ? [
        `Compare key strengths of ${candidateName || "A"} vs ${comparisonCandidateName || "B"}`,
        "Which candidate has more relevant technical experience?",
        "Recommend interview focus areas for both candidates",
      ]
    : candidateId
    ? [
        `Summarize ${candidateName || "candidate"}'s key strengths`,
        "What required skills is this candidate missing?",
        "Provide 3 interview questions targeted at this profile",
      ]
    : [
        "How well does our talent pool align with the active role?",
        "Which candidate is the strongest overall fit?",
        "Generate a screening summary for active requisition",
      ];

  const suggestions = initialSuggestions.length > 0 ? initialSuggestions : defaultSuggestions;

  const handleSend = async (messageToSend = inputMessage) => {
    const text = (messageToSend || "").trim();
    if (!text || isSending) return;

    setInputMessage("");
    setIsSending(true);
    setErrorMessage(null);

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
      console.error("Chat send error:", err);
      setErrorMessage("Could not retrieve response. Please try again.");
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
    <div className="flex flex-col h-full rounded-xl border overflow-hidden bg-white border-[#ECEFF1] shadow-xs">
      {/* Header */}
      <div className="px-4 py-3.5 border-b flex items-center justify-between bg-[#F5F7FA] border-[#ECEFF1]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold bg-[#4CAF4F] text-white shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight text-[#263238]">
              {title}
            </h3>
            <p className="text-[10px] text-[#717171]">
              Candidate Profile Analysis
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => clearChatHistory(sessionKey)}
            className="p-1.5 rounded-lg text-xs transition-colors text-[#717171] hover:text-[#C62828] hover:bg-[#FFEBEE] cursor-pointer"
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2.5 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              <MessageSquare className="w-5 h-5 text-[#4CAF4F]" />
            </div>
            <p className="text-xs font-bold mb-1 text-[#263238]">
              {comparisonCandidateId
                ? `Comparing ${candidateName || "Candidate A"} & ${comparisonCandidateName || "Candidate B"}`
                : candidateId
                ? `Evaluating ${candidateName || "Candidate"}`
                : "Candidate Inquiry"}
            </p>
            <p className="text-[11px] max-w-[240px] mx-auto mb-4 text-[#717171]">
              Inquire about technical fit, work history, or targeted interview areas.
            </p>

            {/* Initial suggestion pills */}
            <div className="flex flex-col gap-1.5 text-left">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(sug)}
                  className="text-xs text-left px-3 py-2 rounded-lg border transition-all flex items-center justify-between group bg-[#F5F7FA] hover:bg-[#E8F5E9] border-[#ECEFF1] hover:border-[#C8E6C9] text-[#4D5E80] hover:text-[#2E7D32] cursor-pointer"
                >
                  <span className="truncate mr-2">{sug}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#4CAF4F]" />
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
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 bg-[#263238] text-white">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#4CAF4F] text-white rounded-br-none"
                    : msg.isError
                    ? "bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] rounded-bl-none"
                    : "bg-[#F5F7FA] text-[#263238] rounded-bl-none border border-[#ECEFF1]"
                }`}
              >
                <FormattedMessage content={msg.content} />
              </div>

              {msg.role === "user" && (
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 bg-[#E8F5E9] text-[#2E7D32]">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isSending && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 bg-[#263238] text-white">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="rounded-xl rounded-bl-none px-3.5 py-2.5 text-xs flex items-center gap-2 border bg-[#F5F7FA] border-[#ECEFF1] text-[#717171]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#4CAF4F]" />
              <span>Analyzing profile data...</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 rounded-lg border text-xs flex items-center justify-between bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSend()}
              className="underline font-bold text-[11px] hover:opacity-80 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Bar when active */}
      {history.length > 0 && (
        <div className="px-3 py-1.5 border-t flex gap-1.5 overflow-x-auto no-scrollbar bg-[#F5F7FA] border-[#ECEFF1]">
          {suggestions.slice(0, 3).map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(sug)}
              disabled={isSending}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors shrink-0 disabled:opacity-50 bg-white hover:bg-[#E8F5E9] border-[#ECEFF1] hover:border-[#C8E6C9] text-[#4D5E80] hover:text-[#2E7D32] cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Box Footer */}
      <div className="p-3 border-t bg-white border-[#ECEFF1]">
        <div className="relative flex items-center">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about candidate strengths, missing skills, interview questions..."
            rows={compact ? 1 : 2}
            disabled={isSending}
            className="w-full text-xs rounded-lg pl-3 pr-10 py-2.5 focus:outline-none transition-all resize-none border bg-[#F5F7FA] border-[#CFD8DC] text-[#263238] placeholder-[#90A4AE] focus:ring-1 focus:ring-[#4CAF4F] focus:border-[#4CAF4F]"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || isSending}
            className="absolute right-2 bottom-2.5 p-1.5 rounded-md transition-all disabled:opacity-30 bg-[#4CAF4F] text-white hover:bg-[#43A047] cursor-pointer"
            title="Send (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#717171] mt-1 px-1">
          <span>Enter to send • Shift+Enter for newline</span>
          <span>Role Alignment</span>
        </div>
      </div>
    </div>
  );
}
