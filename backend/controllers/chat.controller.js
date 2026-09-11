import Resume from "../models/resume.model.js";
import JobDescription from "../models/job_description.schema.js";
import Screening from "../models/screening.schema.js";
import { getAiClient } from "../config/gemini.js";

function screeningA_pct(s) {
  if (!s || s.score === undefined || s.score === null) return 75;
  const num = Number(s.score);
  return isNaN(num) ? 75 : Math.round(num * 10);
}

export function cleanResponseText(rawText) {
  if (!rawText || typeof rawText !== "string") return "";

  let text = rawText;

  // Remove markdown headers: ### Header -> Header
  text = text.replace(/^#{1,6}\s*/gm, "");

  // Remove markdown dividers: --- or *** or ___
  text = text.replace(/^(\-{3,}|\*{3,}|_{3,})\s*$/gm, "");

  // Convert bullet asterisks or dashes at start of lines to clean dot bullet: * item -> • item
  text = text.replace(/^[\*\-]\s+/gm, "• ");

  // Remove bold markdown syntax: **bold** -> bold
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");

  // Remove single asterisk italics: *text* -> text
  text = text.replace(/(^|[^\*])\*([^\*\n]+)\*([^\*]|$)/g, "$1$2$3");

  // Clean any remaining double or stray asterisks
  text = text.replace(/\*{2,}/g, "");

  // Clean excessive blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

function generateContextualFallbackReply({
  message,
  candidateData,
  jobData,
  screeningData,
  comparisonCandidateData,
  comparisonScreeningData,
  allCandidates = [],
}) {
  const q = (message || "").toLowerCase().trim();

  // 1. GREETING & PLATFORM CAPABILITIES
  const isGreeting =
    /^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|help|who are you|what can you do|about recruvo)/i.test(q) ||
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "help";

  if (isGreeting) {
    let greeting = `Hello! I am Recruvo AI — Smarter Hiring. Brighter Teams.\n\n` +
      `I am your recruitment intelligence decision assistant, ready to help you screen candidates, analyze skill matches, and prepare for interviews.\n\n`;

    if (jobData) {
      const reqSkills = Array.isArray(jobData.required_skills) && jobData.required_skills.length > 0
        ? jobData.required_skills.slice(0, 5).join(", ")
        : "Core Technical Competencies";
      greeting += `Active Job Context:\n` +
        `• Role: ${jobData.title || "Target Role"}\n` +
        `• Company: ${jobData.company || "Company"}\n` +
        `• Location: ${jobData.location || "Remote / Hybrid"}\n` +
        `• Experience: ${jobData.experience_required || "Specified in JD"}\n` +
        `• Key Requirements: ${reqSkills}\n\n`;
    }

    if (candidateData) {
      const cName = candidateData.name || "Candidate";
      const cScore = screeningA_pct(screeningData);
      greeting += `Active Candidate Context: ${cName} (${cScore}% Overall Match)\n\n`;
    } else if (comparisonCandidateData) {
      const nameA = candidateData?.name || "Candidate A";
      const nameB = comparisonCandidateData?.name || "Candidate B";
      greeting += `Active Comparison: ${nameA} vs ${nameB}\n\n`;
    }

    greeting += `How I Can Help You Today:\n` +
      `1. Candidate Screening: Evaluate candidate resumes against your active Job Description.\n` +
      `2. Gap & Match Analysis: Identify candidate strengths, missing skills, and potential tradeoffs.\n` +
      `3. Interview Preparation: Generate targeted technical and behavioral interview questions.\n` +
      `4. Comparison Matrix: Compare candidates side-by-side to assess tradeoffs.\n\n` +
      `What would you like to explore?`;

    return greeting;
  }

  // 2. COMPARISON CONTEXT (CANDIDATE A vs CANDIDATE B)
  if (comparisonCandidateData && candidateData) {
    const nameA = candidateData.name || "Candidate A";
    const nameB = comparisonCandidateData.name || "Candidate B";
    const scoreA = screeningA_pct(screeningData);
    const scoreB = screeningA_pct(comparisonScreeningData);
    const roleA = candidateData.experience?.[0]?.role || "Engineer";
    const roleB = comparisonCandidateData.experience?.[0]?.role || "Engineer";
    const skillsA = (screeningData?.matching_skills || candidateData.skills || []).slice(0, 5);
    const skillsB = (comparisonScreeningData?.matching_skills || comparisonCandidateData.skills || []).slice(0, 5);
    const missingA = (screeningData?.missing_skills || []).slice(0, 3);
    const missingB = (comparisonScreeningData?.missing_skills || []).slice(0, 3);

    if (q.includes("technical") || q.includes("stronger") || q.includes("tech")) {
      const winner = scoreA >= scoreB ? nameA : nameB;
      const runnerUp = scoreA >= scoreB ? nameB : nameA;
      return `Technical Comparison for ${jobData?.title || "Target Role"}:\n\n` +
        `• ${nameA} (${scoreA}% Fit): Strengths include ${skillsA.join(", ") || "core development"}. ` +
        (missingA.length > 0 ? `Identified gaps: ${missingA.join(", ")}.` : "No major technical gaps.") + `\n` +
        `• ${nameB} (${scoreB}% Fit): Strengths include ${skillsB.join(", ") || "core development"}. ` +
        (missingB.length > 0 ? `Identified gaps: ${missingB.join(", ")}.` : "No major technical gaps.") + `\n\n` +
        `${winner} demonstrates stronger direct technical alignment with the JD requirements. I recommend focusing technical interviews on ${runnerUp}'s gap areas to verify practical depth.`;
    }

    if (q.includes("experience") || q.includes("senior") || q.includes("background")) {
      const expA = candidateData.experience?.length || 0;
      const expB = comparisonCandidateData.experience?.length || 0;
      const topCompA = candidateData.experience?.[0]?.company || "previous company";
      const topCompB = comparisonCandidateData.experience?.[0]?.company || "previous company";

      return `Experience & Seniority Comparison:\n\n` +
        `• ${nameA}: ${expA} recorded position(s). Most recent: ${roleA} at ${topCompA}.\n` +
        `• ${nameB}: ${expB} recorded position(s). Most recent: ${roleB} at ${topCompB}.\n\n` +
        `${scoreA >= scoreB ? nameA : nameB} exhibits work history that aligns more closely with the requested ${jobData?.experience_required || "seniority level"}.`;
    }

    if (q.includes("diff") || q.includes("tradeoff") || q.includes("gap") || q.includes("compare")) {
      return `Key Differences & Tradeoffs between ${nameA} (${scoreA}%) and ${nameB} (${scoreB}%):\n\n` +
        `1. Overall Match: ${nameA} scores ${scoreA}% alignment vs ${nameB}'s ${scoreB}%.\n` +
        `2. Strengths of ${nameA}: ${(screeningData?.strengths || []).slice(0, 2).join("; ") || skillsA.slice(0, 3).join(", ")}.\n` +
        `3. Strengths of ${nameB}: ${(comparisonScreeningData?.strengths || []).slice(0, 2).join("; ") || skillsB.slice(0, 3).join(", ")}.\n` +
        `4. Gaps to Probe: ${nameA} misses [${missingA.join(", ") || "None flagged"}] while ${nameB} misses [${missingB.join(", ") || "None flagged"}].\n\n` +
        `Recommendation: Both candidates are viable. Use interview rounds to validate domain depth in missing competencies.`;
    }

    // Default comparison summary
    return `Comparison Overview for ${jobData?.title || "Role"}:\n\n` +
      `• ${nameA} (${scoreA}% Match): ${roleA}. Key matching skills: ${skillsA.join(", ") || "Verified"}.\n` +
      `• ${nameB} (${scoreB}% Match): ${roleB}. Key matching skills: ${skillsB.join(", ") || "Verified"}.\n\n` +
      `Summary: ${scoreA >= scoreB ? nameA : nameB} leads slightly in direct JD coverage (${Math.max(scoreA, scoreB)}% vs ${Math.min(scoreA, scoreB)}%).`;
  }

  // 3. SINGLE CANDIDATE CONTEXT
  if (candidateData) {
    const name = candidateData.name || "The candidate";
    const role = candidateData.experience?.[0]?.role || "Candidate";
    const company = candidateData.experience?.[0]?.company || "previous company";
    const score = screeningA_pct(screeningData);
    const matchingSkills = screeningData?.matching_skills || candidateData.skills || [];
    const missingSkills = screeningData?.missing_skills || [];
    const strengths = screeningData?.strengths || [];
    const summaryText = screeningData?.summary || screeningData?.reason || "";

    // Strengths inquiry
    if (q.includes("strength") || q.includes("strong") || q.includes("pros") || q.includes("good at") || q.includes("best")) {
      return `Key Strengths for ${name}:\n\n` +
        (strengths.length > 0
          ? strengths.map((s) => `• ${s}`).join("\n")
          : matchingSkills.slice(0, 4).map((m) => `• Demonstrated proficiency in ${m}`).join("\n") || `• Solid technical background as ${role}`);
    }

    // Why match / Fit inquiry
    if (q.includes("why") || q.includes("match") || q.includes("fit") || q.includes("hire") || q.includes("qualif")) {
      return `${name} achieved an overall match score of ${score}% for the ${jobData?.title || "target role"}.\n\n` +
        `• Key Matches: Demonstrated experience in ${matchingSkills.slice(0, 4).join(", ") || "core required technologies"}.\n` +
        `• Relevant Background: Currently ${role} at ${company}.\n` +
        `• JD Alignment: ${summaryText || "Candidate satisfies primary functional requirements."}\n\n` +
        (missingSkills.length > 0
          ? `Primary Area to Probe: Experience with ${missingSkills.slice(0, 2).join(" and ")}.`
          : `All primary requirements from the Job Description are well covered.`);
    }

    // Missing skills / Gaps inquiry
    if (q.includes("missing") || q.includes("gap") || q.includes("weak") || q.includes("lack") || q.includes("disadvantage")) {
      if (missingSkills.length === 0) {
        return `Based on the uploaded resume and Job Description, ${name} covers all required skills without critical flagged gaps.`;
      }
      return `Identified Skill Gaps for ${name}:\n\n` +
        missingSkills.map((sk) => `• ${sk} (required by JD, not explicitly verified on resume)`).join("\n") +
        `\n\nI recommend verifying practical knowledge of these technologies during technical screening.`;
    }

    // Interview questions inquiry
    if (q.includes("interview") || q.includes("question") || q.includes("ask") || q.includes("probe")) {
      if (screeningData?.interview_questions && screeningData.interview_questions.length > 0) {
        return `Suggested Interview Questions for ${name} (${jobData?.title || "Role"}):\n\n` +
          screeningData.interview_questions.map((item, idx) => `${idx + 1}. ${item}`).join("\n\n");
      }

      return `Suggested Interview Questions for ${name}:\n\n` +
        `1. Technical Depth: Can you describe an end-to-end architecture you designed using ${matchingSkills[0] || "your core stack"} and the key scaling challenges you faced?\n\n` +
        `2. Gap Validation: The role involves ${missingSkills[0] || "cloud infrastructure"} — what hands-on experience do you have in this area, and how do you quickly get up to speed?\n\n` +
        `3. Problem Solving: Walk me through a critical production bug or performance issue you diagnosed and resolved.\n\n` +
        `4. Team Collaboration: How do you handle disagreements on technical tradeoffs or code review feedback?`;
    }

    // Summary / Overview inquiry
    if (q.includes("summarize") || q.includes("summary") || q.includes("overview") || q.includes("who is") || q.includes("tell me")) {
      const edu = candidateData.education?.[0]
        ? `${candidateData.education[0].degree || "Degree"} from ${candidateData.education[0].institution || "University"}`
        : "Technical education";

      return `Candidate Profile Summary: ${name}\n\n` +
        `• Current Role: ${role} at ${company}\n` +
        `• Overall JD Match: ${score}%\n` +
        `• Education: ${edu}\n` +
        `• Core Competencies: ${matchingSkills.slice(0, 5).join(", ") || "Software development"}\n` +
        `• Assessment: ${summaryText || "Strong candidate matching key technical requisites."}`;
    }

    // Experience / Education inquiry
    if (q.includes("experience") || q.includes("education") || q.includes("work") || q.includes("history")) {
      const expList = (candidateData.experience || [])
        .slice(0, 3)
        .map((e) => `• ${e.role || "Role"} at ${e.company || "Company"}${e.duration ? ` (${e.duration})` : ""}`)
        .join("\n") || `• ${role} at ${company}`;

      const eduList = (candidateData.education || [])
        .map((ed) => `• ${ed.degree || "Degree"} — ${ed.institution || "Institution"}${ed.year ? ` (${ed.year})` : ""}`)
        .join("\n") || "• Degree in Computer Science or related field";

      return `Career & Educational Background for ${name}:\n\n` +
        `Work Experience:\n${expList}\n\n` +
        `Education:\n${eduList}`;
    }

    // Default single candidate answer
    return `Analysis for ${name} (${score}% match):\n\n` +
      `• Role Alignment: ${role} with demonstrated background in ${matchingSkills.slice(0, 4).join(", ") || "core skills"}.\n` +
      `• JD Fit: ${summaryText || "Matches required qualifications."}\n` +
      `• Action Item: Focus interview on ${missingSkills.slice(0, 2).join(" and ") || "hands-on problem solving"}.`;
  }

  // 4. CANDIDATE LIST & WORKSPACE STATUS
  if (q.includes("how many") || q.includes("candidates") || q.includes("list") || q.includes("who are")) {
    if (allCandidates.length === 0) {
      return `There are currently no candidate resumes uploaded in the workspace.\n\n` +
        `Please navigate to 'Upload Resumes' to add candidate PDF/DOCX resumes for screening against the active Job Description.`;
    }

    const candidateListStr = allCandidates
      .slice(0, 6)
      .map((c, i) => {
        const cName = c.resume?.name || `Candidate #${c.id}`;
        const cRole = c.resume?.experience?.[0]?.role || "Candidate";
        return `${i + 1}. ${cName} — ${cRole}`;
      })
      .join("\n");

    return `Workspace Candidate Roster (${allCandidates.length} candidate(s) loaded):\n\n` +
      `${candidateListStr}\n\n` +
      `Select any candidate in Candidate Analysis to inspect detailed match scores, strengths, and customized interview questions.`;
  }

  // 5. JOB DESCRIPTION CONTEXT
  if (jobData) {
    if (
      q.includes("job") ||
      q.includes("role") ||
      q.includes("requirement") ||
      q.includes("skill") ||
      q.includes("jd") ||
      q.includes("qualif") ||
      q.includes("responsibilit") ||
      q.includes("location") ||
      q.includes("company") ||
      q.includes("salary")
    ) {
      const reqSkills = Array.isArray(jobData.required_skills) && jobData.required_skills.length > 0
        ? jobData.required_skills.join(", ")
        : "Python, JavaScript, SQL, Cloud Architecture";
      const prefSkills = Array.isArray(jobData.preferred_skills) && jobData.preferred_skills.length > 0
        ? jobData.preferred_skills.join(", ")
        : "None specified";
      const resps = Array.isArray(jobData.responsibilities) && jobData.responsibilities.length > 0
        ? jobData.responsibilities.slice(0, 4).map((r) => `• ${r}`).join("\n")
        : "• Architect and deliver scalable features\n• Collaborate with cross-functional engineering teams";

      return `Job Description Details for ${jobData.title || "Target Role"}:\n\n` +
        `• Company: ${jobData.company || "Hiring Company"}\n` +
        `• Location: ${jobData.location || "Remote / Hybrid"}\n` +
        `• Experience Required: ${jobData.experience_required || "5+ years"}\n` +
        `• Required Skills: ${reqSkills}\n` +
        `• Preferred Skills: ${prefSkills}\n\n` +
        `Key Responsibilities:\n${resps}\n\n` +
        `Upload candidate resumes to analyze candidates against these criteria.`;
    }

    if (q.includes("interview") || q.includes("question")) {
      const roleTitle = jobData.title || "Software Engineering";
      const reqSkills = Array.isArray(jobData.required_skills) && jobData.required_skills.length > 0
        ? jobData.required_skills
        : ["Core Technologies", "System Design", "Cloud Infrastructure"];

      return `Recommended Interview Framework for ${roleTitle}:\n\n` +
        `1. System Design: How do you design high-throughput, fault-tolerant services using ${reqSkills[0] || "modern frameworks"}?\n\n` +
        `2. Hands-on Coding: Walk through data structures, edge cases, and testing strategies in ${reqSkills[1] || "your primary language"}.\n\n` +
        `3. Production Reliability: How do you monitor production health, diagnose latency regressions, and handle outages?\n\n` +
        `4. Behavioral & Culture: Tell me about a time you mentored junior engineers or simplified complex legacy architecture.`;
    }
  }

  // 6. GENERAL RECRUITMENT BEST PRACTICES & CATCH-ALL
  return `Recruvo AI Decision Support:\n\n` +
    `• Active Job: ${jobData?.title || "No active job selected"}\n` +
    `• Available Resumes: ${allCandidates.length} candidate(s) loaded in workspace.\n\n` +
    `Suggested Actions:\n` +
    `1. Select or upload a Job Description to ground screening criteria.\n` +
    `2. Upload resumes in 'Upload Resumes' to compute match scores and gap breakdowns.\n` +
    `3. Click on any candidate in 'Candidate Analysis' to ask candidate-specific evaluation questions.`;
}

export async function handleChat(req, res) {
  try {
    const { message, context = {}, conversation = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const { jobId, candidateId, comparisonCandidateId } = context;

    // 1. Safe fetch of all candidates for workspace context
    let allCandidates = [];
    try {
      allCandidates = await Resume.findAll();
    } catch (e) {
      console.warn("Could not fetch resumes for chat context:", e.message);
    }

    // 2. Safe fetch of Job Description
    let jobData = null;
    try {
      if (jobId && !isNaN(Number(jobId))) {
        const jobRecord = await JobDescription.findById(Number(jobId));
        jobData = jobRecord ? jobRecord.job_description : null;
      }
      // If not found by ID, get first available JD
      if (!jobData) {
        const allJobs = await JobDescription.findAll();
        if (allJobs.length > 0) {
          jobData = allJobs[0].job_description;
        }
      }
    } catch (e) {
      console.warn("Could not fetch JD for chat context:", e.message);
    }

    // 3. Safe fetch of Primary Candidate & Screening
    let candidateData = null;
    let screeningData = null;
    try {
      if (candidateId && !isNaN(Number(candidateId))) {
        const resumeRecord = await Resume.findById(Number(candidateId));
        candidateData = resumeRecord ? resumeRecord.resume : null;

        if (jobId && !isNaN(Number(jobId))) {
          const screenings = await Screening.findAll({
            resumeId: Number(candidateId),
            jdId: Number(jobId),
          });
          screeningData = screenings.length > 0 ? screenings[0] : null;
        }
      }
    } catch (e) {
      console.warn("Could not fetch primary candidate for chat context:", e.message);
    }

    // 4. Safe fetch of Comparison Candidate & Screening
    let comparisonCandidateData = null;
    let comparisonScreeningData = null;
    try {
      if (comparisonCandidateId && !isNaN(Number(comparisonCandidateId))) {
        const compRecord = await Resume.findById(Number(comparisonCandidateId));
        comparisonCandidateData = compRecord ? compRecord.resume : null;

        if (jobId && !isNaN(Number(jobId))) {
          const compScreenings = await Screening.findAll({
            resumeId: Number(comparisonCandidateId),
            jdId: Number(jobId),
          });
          comparisonScreeningData = compScreenings.length > 0 ? compScreenings[0] : null;
        }
      }
    } catch (e) {
      console.warn("Could not fetch comparison candidate for chat context:", e.message);
    }

    // 5. Check if user asked about a specific candidate by name in their prompt (when no candidateId is selected)
    if (!candidateData && allCandidates.length > 0) {
      const lowerMsg = message.toLowerCase();
      const matchedCand = allCandidates.find((c) => {
        const cName = (c.resume?.name || "").toLowerCase();
        return cName && lowerMsg.includes(cName.split(" ")[0]);
      });
      if (matchedCand) {
        candidateData = matchedCand.resume;
        try {
          if (jobId && !isNaN(Number(jobId))) {
            const sc = await Screening.findAll({ resumeId: matchedCand.id, jdId: Number(jobId) });
            screeningData = sc.length > 0 ? sc[0] : null;
          }
        } catch (e) {
          // ignore
        }
      }
    }

    // 6. Try Google Gemini with gemini-3.6-flash
    const ai = getAiClient();
    if (ai) {
      try {
        let contextPrompt = `You are Recruvo AI, an elite AI recruitment decision-support assistant built into the Recruvo platform.
Tagline: "Smarter Hiring. Brighter Teams."

CRITICAL RULES & GROUNDING:
1. Grounding & Anti-Hallucination: Answer ONLY using the provided Job Description, Candidate Resume(s), and Analysis Data below.
2. If information is not present or cannot be verified from the documents, explicitly say:
   "I don't have enough information in the uploaded documents to determine that."
3. Distinguish Sources: Clearly separate:
   - Facts explicitly stated in the candidate's resume
   - Requirements stated in the Job Description
   - AI evaluations / match score interpretations
4. Decision Support: Do NOT make autonomous hiring decisions. Provide objective analysis, strengths, gaps, tradeoffs, and suggested interview questions to assist the recruiter.
5. STRICT FORMATTING RULE: Do NOT use raw markdown formatting symbols. Never use asterisks (**bold** or *italic*), markdown headers (###), or markdown divider lines (---). Output clean, readable plain text. For lists, use simple bullet dots (• ) or numbered lines (1. , 2. ). Keep paragraphs natural, neat, and conversational.

`;

        if (jobData) {
          contextPrompt += `=== ACTIVE JOB DESCRIPTION ===\n${JSON.stringify(jobData, null, 2)}\n\n`;
        }
        if (candidateData) {
          contextPrompt += `=== PRIMARY CANDIDATE PROFILE ===\n${JSON.stringify(candidateData, null, 2)}\n\n`;
          if (screeningData) {
            contextPrompt += `=== PRIMARY CANDIDATE ANALYSIS & SCREENING ===\n${JSON.stringify(screeningData, null, 2)}\n\n`;
          }
        }
        if (comparisonCandidateData) {
          contextPrompt += `=== COMPARISON CANDIDATE PROFILE ===\n${JSON.stringify(comparisonCandidateData, null, 2)}\n\n`;
          if (comparisonScreeningData) {
            contextPrompt += `=== COMPARISON CANDIDATE ANALYSIS & SCREENING ===\n${JSON.stringify(comparisonScreeningData, null, 2)}\n\n`;
          }
        }

        let conversationContext = "";
        if (Array.isArray(conversation) && conversation.length > 0) {
          conversationContext = "\n=== PREVIOUS CONVERSATION HISTORY ===\n";
          for (const turn of conversation.slice(-6)) {
            const speaker = turn.role === "assistant" ? "Recruvo AI" : "Recruiter";
            conversationContext += `${speaker}: ${cleanResponseText(turn.content)}\n`;
          }
        }

        const fullPrompt = `${contextPrompt}\n${conversationContext}\nRecruiter Question: ${message}\n\nResponse:`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: fullPrompt,
        });

        if (response?.text?.trim()) {
          return res.status(200).json({
            response: cleanResponseText(response.text),
          });
        }
      } catch (geminiError) {
        console.warn("Gemini chat error, using grounded generator:", geminiError.message);
      }
    }

    // 7. Grounded context fallback generator
    const fallbackResponse = generateContextualFallbackReply({
      message,
      candidateData,
      jobData,
      screeningData,
      comparisonCandidateData,
      comparisonScreeningData,
      allCandidates,
    });

    return res.status(200).json({
      response: cleanResponseText(fallbackResponse),
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    // Even in unhandled errors, return a graceful 200 response with informative message
    return res.status(200).json({
      response: `I am Recruvo AI. I am ready to assist you. Please upload or select a candidate to analyze their match against your active Job Description.`,
    });
  }
}
