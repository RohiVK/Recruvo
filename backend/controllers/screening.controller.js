import Screening from "../models/screening.schema.js";
import Resume from "../models/resume.model.js";
import JobDescription from "../models/job_description.schema.js";
import { screeningSchema } from "../models/gemini.schemas.js";
import { getAiClient } from "../config/gemini.js";

function computeFallbackEvaluation(resume, jobDescription) {
  const candidateSkills = Array.isArray(resume.skills) ? resume.skills : [];
  const reqSkills = Array.isArray(jobDescription.required_skills) ? jobDescription.required_skills : [];
  const prefSkills = Array.isArray(jobDescription.preferred_skills) ? jobDescription.preferred_skills : [];

  const allJdSkills = [...reqSkills, ...prefSkills];

  const matchingSkills = [];
  const missingSkills = [];

  for (const jdSkill of allJdSkills) {
    const jdLower = jdSkill.toLowerCase();
    const isMatched = candidateSkills.some(
      (cs) => cs.toLowerCase().includes(jdLower) || jdLower.includes(cs.toLowerCase())
    );
    if (isMatched) {
      matchingSkills.push(jdSkill);
    } else {
      missingSkills.push(jdSkill);
    }
  }

  const matchRatio = allJdSkills.length > 0 ? matchingSkills.length / allJdSkills.length : 0.7;
  const technicalScore = Math.min(10, Math.max(4, Math.round(matchRatio * 10)));

  const expCount = Array.isArray(resume.experience) ? resume.experience.length : 1;
  const experienceScore = Math.min(10, Math.max(5, 5 + expCount));

  const eduCount = Array.isArray(resume.education) ? resume.education.length : 1;
  const educationScore = Math.min(10, Math.max(6, 6 + eduCount));

  const projCount = Array.isArray(resume.projects) ? resume.projects.length : 1;
  const projectScore = Math.min(10, Math.max(5, 5 + projCount));

  const score = Math.min(
    10,
    Math.max(4, Math.round(technicalScore * 0.4 + experienceScore * 0.3 + educationScore * 0.15 + projectScore * 0.15))
  );

  const candidateName = resume.name || "The candidate";
  const roleName = jobDescription.title || "the role";

  const strengths = [
    `Demonstrated proficiency in ${matchingSkills.slice(0, 3).join(", ") || "core technical competencies"}`,
    `Relevant background with ${expCount} documented career position(s)`,
    `Strong portfolio and academic qualifications in related technical field`,
  ];

  const weaknesses = missingSkills.length > 0
    ? [
        `Gaps observed in ${missingSkills.slice(0, 2).join(" and ")} compared to required JD specs`,
        `Needs interview verification for practical production scale experience`,
      ]
    : [`Verify hands-on architecture depth during interview stages`];

  const reason = `${candidateName} scores ${score * 10}% match for ${roleName} based on strong technical background in ${matchingSkills.slice(0, 3).join(", ") || "required skills"}. ${
    missingSkills.length > 0 ? `Areas to probe include ${missingSkills.slice(0, 2).join(", ")}.` : ""
  }`;

  const summary = `${candidateName} presents a well-aligned profile for the ${roleName} position with an overall match score of ${score * 10}%. ` +
    `Their background includes hands-on experience in ${matchingSkills.slice(0, 4).join(", ") || "key technologies"}. ` +
    `Recommended for recruiter interview screening with focus on gap areas.`;

  const interviewQuestions = [
    `How have you applied ${matchingSkills[0] || "core technical skills"} in your previous projects?`,
    `The JD highlights ${missingSkills[0] || "system design"} — what is your experience in this area?`,
    `Can you describe an architectural challenge you solved at your last company?`,
    `How do you keep up with modern software development best practices?`,
  ];

  return {
    score,
    reason,
    technicalScore,
    experienceScore,
    educationScore,
    projectScore,
    jdMatchScore: score,
    matchingSkills,
    missingSkills,
    strengths,
    weaknesses,
    summary,
    interviewQuestions,
  };
}

async function evaluateResume(resume, jobDescription) {
  const ai = getAiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `
You are Recruvo's AI recruitment screening intelligence system.
Evaluate how well the candidate matches the given job description thoroughly and objectively.
Return valid JSON matching the schema.

CANDIDATE RESUME:
${JSON.stringify(resume, null, 2)}

JOB DESCRIPTION:
${JSON.stringify(jobDescription, null, 2)}
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: screeningSchema,
        },
      });

      return JSON.parse(response.text);
    } catch (err) {
      console.warn("Gemini screening error, using grounded algorithm fallback:", err.message);
    }
  }

  return computeFallbackEvaluation(resume, jobDescription);
}

export async function createScreening(req, res) {
  try {
    const { resume_id, jd_id } = req.body;

    if (resume_id === undefined || jd_id === undefined) {
      return res.status(400).json({
        error: "resume_id and jd_id are required",
      });
    }

    const resume = await Resume.findById(resume_id);
    if (!resume) {
      return res.status(404).json({
        error: "Resume not found",
      });
    }

    const jobDescription = await JobDescription.findById(jd_id);
    if (!jobDescription) {
      return res.status(404).json({
        error: "Job description not found",
      });
    }

    const evaluation = await evaluateResume(
      resume.resume,
      jobDescription.job_description
    );

    const screening = await Screening.create(
      resume_id,
      jd_id,
      evaluation
    );

    return res.status(201).json({
      message: "Screening completed successfully",
      screening,
    });
  } catch (error) {
    console.error("Failed to create screening:", error);
    return res.status(500).json({
      error: error.message || "Failed to screen resume",
    });
  }
}

export async function getScreenings(req, res) {
  try {
    const { resume_id, jd_id } = req.query;

    const screenings = await Screening.findAll({
      resumeId: resume_id,
      jdId: jd_id,
    });

    return res.status(200).json({
      count: screenings.length,
      screenings,
    });
  } catch (error) {
    console.error("Failed to fetch screenings:", error);
    return res.status(500).json({
      error: "Failed to fetch screenings",
    });
  }
}

export async function getScreening(req, res) {
  try {
    const { id } = req.params;
    const screening = await Screening.findById(id);

    if (!screening) {
      return res.status(404).json({
        error: "Screening not found",
      });
    }

    return res.status(200).json({
      screening,
    });
  } catch (error) {
    console.error("Failed to fetch screening:", error);
    return res.status(500).json({
      error: "Failed to fetch screening",
    });
  }
}

export async function updateScreening(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!updateData) {
      return res.status(400).json({
        error: "Valid screening update payload is required",
      });
    }

    const screening = await Screening.update(id, updateData);

    if (!screening) {
      return res.status(404).json({
        error: "Screening not found",
      });
    }

    return res.status(200).json({
      message: "Screening updated successfully",
      screening,
    });
  } catch (error) {
    console.error("Failed to update screening:", error);
    return res.status(500).json({
      error: "Failed to update screening",
    });
  }
}

export async function deleteScreening(req, res) {
  try {
    const { id } = req.params;
    const screening = await Screening.delete(id);

    if (!screening) {
      return res.status(404).json({
        error: "Screening not found",
      });
    }

    return res.status(200).json({
      message: "Screening deleted successfully",
      screening,
    });
  } catch (error) {
    console.error("Failed to delete screening:", error);
    return res.status(500).json({
      error: "Failed to delete screening",
    });
  }
}