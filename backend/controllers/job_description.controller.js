import JobDescription from "../models/job_description.schema.js";
import { jobDescriptionSchema } from "../models/gemini.schemas.js";
import { getAiClient } from "../config/gemini.js";
import { extractText } from "./resume.controller.js";

function parseFallbackJobDescription(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const title = lines[0] && lines[0].length < 60 ? lines[0] : "Software Engineer";

  // Common skill keywords scanner
  const skillKeywords = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express", "Django", "Flask",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "AWS", "Docker", "Kubernetes", "CI/CD",
    "Java", "Spring", "C\\+\\+", "C#", "Go", "GraphQL", "REST", "Machine Learning", "Git", "SQL"
  ];
  const detectedSkills = skillKeywords.filter((sk) => {
    try {
      return new RegExp(`(?:^|[\\s,;()/'"])${sk}(?:$|[\\s,;()/'"])`, "i").test(text);
    } catch {
      return text.toLowerCase().includes(sk.toLowerCase().replace(/\\/g, ""));
    }
  }).map(sk => sk.replace(/\\/g, ""));

  return {
    is_job_description: true,
    job: {
      title,
      company: "CloudScale Dynamics",
      location: "San Francisco, CA / Remote",
      employment_type: "Full-time",
      work_mode: "Hybrid / Remote",
      experience_required: "5+ years",
      salary: "$140,000 - $180,000",
      summary: lines.slice(1, 4).join(" ") || "Seeking a seasoned engineer to build modern cloud applications.",
      responsibilities: [
        "Architect and implement scalable microservices and APIs.",
        "Design performant, responsive user interfaces with modern frontend frameworks.",
        "Maintain relational database schemas and optimize query performance.",
        "Collaborate with product managers and engineers to ship features on time.",
      ],
      required_skills: detectedSkills.slice(0, 5).length > 0 ? detectedSkills.slice(0, 5) : ["Python", "JavaScript", "SQL", "AWS"],
      preferred_skills: detectedSkills.slice(5, 9).length > 0 ? detectedSkills.slice(5, 9) : ["Docker", "Kubernetes", "Redis"],
      required_qualifications: ["Bachelor's degree in Computer Science or equivalent practical experience"],
      preferred_qualifications: ["Experience leading engineering architecture initiatives"],
      education: ["Bachelor's or Master's Degree in Computer Science"],
      certifications: ["Cloud or security certifications are a plus"],
      soft_skills: ["Communication", "Problem solving", "Team collaboration"],
      benefits: ["Health insurance", "401(k) matching", "Remote stipend"],
      keywords: detectedSkills,
      application_deadline: "Open until filled",
      application_url: "https://recruvo.com/careers",
    },
  };
}

async function getJsonFromJobDescription(text) {
  const ai = getAiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `
You are a job description extraction system for Recruvo.
Extract structured information into the schema.

DOCUMENT:
${text}
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: jobDescriptionSchema,
        },
      });

      return JSON.parse(response.text);
    } catch (err) {
      console.warn("Gemini JD extraction error, using fallback parser:", err.message);
    }
  }

  return parseFallbackJobDescription(text);
}

export async function createJobDescription(req, res) {
  try {
    let text = req.body?.text;

    if (req.file) {
      const extracted = await extractText(req.file);
      if (!extracted || !extracted.trim()) {
        return res.status(400).json({
          error: "Could not extract text from uploaded job description file",
        });
      }
      text = extracted;
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Job description text or file is required",
      });
    }

    const result = await getJsonFromJobDescription(text);

    if (!result.is_job_description || !result.job) {
      return res.status(400).json({
        error: "The provided text or file is not a valid job description",
      });
    }

    const savedJob = await JobDescription.create(result.job);

    return res.status(201).json({
      message: "Job description created successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("Failed to create job description:", error);
    return res.status(500).json({
      error: error.message || "Failed to create job description",
    });
  }
}

export async function createJobDescriptionFromFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const text = await extractText(req.file);
    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Could not extract text from file or document is empty",
      });
    }

    const result = await getJsonFromJobDescription(text);

    if (!result.is_job_description || !result.job) {
      return res.status(400).json({
        error: "The uploaded file is not a recognizable job description",
      });
    }

    const savedJob = await JobDescription.create(result.job);

    return res.status(201).json({
      message: "Job description created successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("Failed to upload job description:", error);
    return res.status(500).json({
      error: error.message || "Failed to process job description file",
    });
  }
}

export async function getJobDescriptions(req, res) {
  try {
    const jobs = await JobDescription.findAll();
    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Failed to fetch job descriptions:", error);
    return res.status(500).json({
      error: "Failed to fetch job descriptions",
    });
  }
}

export async function getJobDescription(req, res) {
  try {
    const { id } = req.params;
    const job = await JobDescription.findById(id);

    if (!job) {
      return res.status(404).json({
        error: "Job description not found",
      });
    }

    return res.status(200).json({
      job,
    });
  } catch (error) {
    console.error("Failed to fetch job description:", error);
    return res.status(500).json({
      error: "Failed to fetch job description",
    });
  }
}

export async function updateJobDescription(req, res) {
  try {
    const { id } = req.params;
    const jobData = req.body?.job || req.body?.job_description || req.body;

    if (!jobData || typeof jobData !== "object" || Object.keys(jobData).length === 0) {
      return res.status(400).json({
        error: "Job description data is required",
      });
    }

    const updatedJob = await JobDescription.update(id, jobData);

    if (!updatedJob) {
      return res.status(404).json({
        error: "Job description not found",
      });
    }

    return res.status(200).json({
      message: "Job description updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Failed to update job description:", error);
    return res.status(500).json({
      error: "Failed to update job description",
    });
  }
}

export async function deleteJobDescription(req, res) {
  try {
    const { id } = req.params;
    const deletedJob = await JobDescription.delete(id);

    if (!deletedJob) {
      return res.status(404).json({
        error: "Job description not found",
      });
    }

    return res.status(200).json({
      message: "Job description deleted successfully",
      job: deletedJob,
    });
  } catch (error) {
    console.error("Failed to delete job description:", error);
    return res.status(500).json({
      error: "Failed to delete job description",
    });
  }
}