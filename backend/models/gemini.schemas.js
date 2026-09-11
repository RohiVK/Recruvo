export const resumeSchema = {
  type: 'object',
  properties: {
    is_resume: {
      type: 'boolean',
    },
    candidate: {
      type: ['object', 'null'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        location: { type: 'string' },
        summary: { type: 'string' },

        skills: {
          type: 'array',
          items: { type: 'string' },
        },

        education: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              degree: { type: 'string' },
              institution: { type: 'string' },
              field: { type: 'string' },
              start_year: { type: 'string' },
              end_year: { type: 'string' },
            },
            required: [
              'degree',
              'institution',
              'field',
              'start_year',
              'end_year',
            ],
          },
        },

        experience: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              company: { type: 'string' },
              role: { type: 'string' },
              start_date: { type: 'string' },
              end_date: { type: 'string' },
              description: { type: 'string' },
            },
            required: [
              'company',
              'role',
              'start_date',
              'end_date',
              'description',
            ],
          },
        },

        projects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              technologies: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: [
              'name',
              'description',
              'technologies',
            ],
          },
        },

        certifications: {
          type: 'array',
          items: { type: 'string' },
        },

        achievements: {
          type: 'array',
          items: { type: 'string' },
        },

        links: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: [
        'name',
        'email',
        'phone',
        'location',
        'summary',
        'skills',
        'education',
        'experience',
        'projects',
        'certifications',
        'achievements',
        'links',
      ],
    },
  },
  required: ['is_resume', 'candidate'],
};



export const jobDescriptionSchema = {
  type: "object",
  properties: {
    is_job_description: {
      type: "boolean",
    },

    job: {
      type: ["object", "null"],
      properties: {
        title: {
          type: "string",
        },

        company: {
          type: "string",
        },

        location: {
          type: "string",
        },

        employment_type: {
          type: "string",
        },

        work_mode: {
          type: "string",
        },

        experience_required: {
          type: "string",
        },

        salary: {
          type: "string",
        },

        summary: {
          type: "string",
        },

        responsibilities: {
          type: "array",
          items: { type: "string" },
        },

        required_skills: {
          type: "array",
          items: { type: "string" },
        },

        preferred_skills: {
          type: "array",
          items: { type: "string" },
        },

        required_qualifications: {
          type: "array",
          items: { type: "string" },
        },

        preferred_qualifications: {
          type: "array",
          items: { type: "string" },
        },

        education: {
          type: "array",
          items: { type: "string" },
        },

        certifications: {
          type: "array",
          items: { type: "string" },
        },

        soft_skills: {
          type: "array",
          items: { type: "string" },
        },

        benefits: {
          type: "array",
          items: { type: "string" },
        },

        keywords: {
          type: "array",
          items: { type: "string" },
        },

        application_deadline: {
          type: "string",
        },

        application_url: {
          type: "string",
        },
      },

      required: [
        "title",
        "company",
        "location",
        "employment_type",
        "work_mode",
        "experience_required",
        "salary",
        "summary",
        "responsibilities",
        "required_skills",
        "preferred_skills",
        "required_qualifications",
        "preferred_qualifications",
        "education",
        "certifications",
        "soft_skills",
        "benefits",
        "keywords",
        "application_deadline",
        "application_url",
      ],
    },
  },

  required: ["is_job_description", "job"],
};



export const screeningSchema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      description: "Overall candidate match score from 1 to 10",
    },
    reason: {
      type: "string",
      description: "Concise summary reasoning for the overall score",
    },
    technicalScore: {
      type: "integer",
      description: "Technical skills match score from 1 to 10",
    },
    experienceScore: {
      type: "integer",
      description: "Work experience and seniority match score from 1 to 10",
    },
    educationScore: {
      type: "integer",
      description: "Education and academic background match score from 1 to 10",
    },
    projectScore: {
      type: "integer",
      description: "Relevant projects and portfolio match score from 1 to 10",
    },
    jdMatchScore: {
      type: "integer",
      description: "Direct JD alignment score from 1 to 10",
    },
    matchingSkills: {
      type: "array",
      items: { type: "string" },
      description: "List of candidate skills that directly match JD requirements",
    },
    missingSkills: {
      type: "array",
      items: { type: "string" },
      description: "List of required or preferred skills missing from candidate profile",
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "Key candidate strengths for this role",
    },
    weaknesses: {
      type: "array",
      items: { type: "string" },
      description: "Key candidate gaps or areas of caution",
    },
    summary: {
      type: "string",
      description: "Comprehensive AI executive summary of candidate suitability",
    },
    interviewQuestions: {
      type: "array",
      items: { type: "string" },
      description: "Tailored interview questions based on candidate profile and missing skills",
    },
  },
  required: [
    "score",
    "reason",
    "technicalScore",
    "experienceScore",
    "educationScore",
    "projectScore",
    "jdMatchScore",
    "matchingSkills",
    "missingSkills",
    "strengths",
    "weaknesses",
    "summary",
  ],
};