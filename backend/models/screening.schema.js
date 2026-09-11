import db from "../config/db.js";

function normalizeScreening(row) {
  if (!row) return null;
  return {
    ...row,
    matching_skills: typeof row.matching_skills === "string" ? JSON.parse(row.matching_skills) : (row.matching_skills || []),
    missing_skills: typeof row.missing_skills === "string" ? JSON.parse(row.missing_skills) : (row.missing_skills || []),
    strengths: typeof row.strengths === "string" ? JSON.parse(row.strengths) : (row.strengths || []),
    weaknesses: typeof row.weaknesses === "string" ? JSON.parse(row.weaknesses) : (row.weaknesses || []),
    interview_questions: typeof row.interview_questions === "string" ? JSON.parse(row.interview_questions) : (row.interview_questions || []),
    // Add camelCase aliases for frontend convenience
    technicalScore: row.technical_score ?? row.score,
    experienceScore: row.experience_score ?? row.score,
    educationScore: row.education_score ?? row.score,
    projectScore: row.project_score ?? row.score,
    jdMatchScore: row.jd_match_score ?? row.score,
    matchingSkills: typeof row.matching_skills === "string" ? JSON.parse(row.matching_skills) : (row.matching_skills || []),
    missingSkills: typeof row.missing_skills === "string" ? JSON.parse(row.missing_skills) : (row.missing_skills || []),
    interviewQuestions: typeof row.interview_questions === "string" ? JSON.parse(row.interview_questions) : (row.interview_questions || []),
  };
}

const Screening = {
  async findAll({ resumeId, jdId } = {}) {
    let query = `
      SELECT *
      FROM screenings
    `;

    const values = [];
    const conditions = [];

    if (resumeId) {
      values.push(resumeId);
      conditions.push(`resume_id = $${values.length}`);
    }

    if (jdId) {
      values.push(jdId);
      conditions.push(`jd_id = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY id DESC";

    const result = await db.query(query, values);

    return result.rows.map(normalizeScreening);
  },

  async findById(id) {
    const result = await db.query(
      "SELECT * FROM screenings WHERE id = $1",
      [id]
    );

    return normalizeScreening(result.rows[0]);
  },

  async create(resumeId, jdId, evaluationOrScore, reasonText) {
    let score = 5;
    let reason = "";
    let technicalScore = null;
    let experienceScore = null;
    let educationScore = null;
    let projectScore = null;
    let jdMatchScore = null;
    let matchingSkills = [];
    let missingSkills = [];
    let strengths = [];
    let weaknesses = [];
    let summary = "";
    let interviewQuestions = [];

    const toNum = (val, fallback) => {
      if (val === undefined || val === null) return fallback;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    };

    if (typeof evaluationOrScore === "object" && evaluationOrScore !== null) {
      score = toNum(evaluationOrScore.score, 7.5);
      reason = evaluationOrScore.reason || "";
      technicalScore = toNum(evaluationOrScore.technicalScore, score);
      experienceScore = toNum(evaluationOrScore.experienceScore, score);
      educationScore = toNum(evaluationOrScore.educationScore, score);
      projectScore = toNum(evaluationOrScore.projectScore, score);
      jdMatchScore = toNum(evaluationOrScore.jdMatchScore, score);
      matchingSkills = evaluationOrScore.matchingSkills || [];
      missingSkills = evaluationOrScore.missingSkills || [];
      strengths = evaluationOrScore.strengths || [];
      weaknesses = evaluationOrScore.weaknesses || [];
      summary = evaluationOrScore.summary || reason;
      interviewQuestions = evaluationOrScore.interviewQuestions || [];
    } else {
      score = toNum(evaluationOrScore, 7.5);
      reason = reasonText || "";
      technicalScore = score;
      experienceScore = score;
      educationScore = score;
      projectScore = score;
      jdMatchScore = score;
      summary = reason;
    }

    const result = await db.query(
      `INSERT INTO screenings (
        resume_id, jd_id, score, reason,
        technical_score, experience_score, education_score, project_score, jd_match_score,
        matching_skills, missing_skills, strengths, weaknesses, summary, interview_questions
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        resumeId,
        jdId,
        score,
        reason,
        technicalScore,
        experienceScore,
        educationScore,
        projectScore,
        jdMatchScore,
        JSON.stringify(matchingSkills),
        JSON.stringify(missingSkills),
        JSON.stringify(strengths),
        JSON.stringify(weaknesses),
        summary,
        JSON.stringify(interviewQuestions),
      ]
    );

    return normalizeScreening(result.rows[0]);
  },

  async update(id, updateData, reasonArg) {
    if (typeof updateData === "object" && updateData !== null) {
      const existing = await this.findById(id);
      if (!existing) return null;

      const score = updateData.score ?? existing.score;
      const reason = updateData.reason ?? existing.reason;
      const technicalScore = updateData.technicalScore ?? existing.technical_score;
      const experienceScore = updateData.experienceScore ?? existing.experience_score;
      const educationScore = updateData.educationScore ?? existing.education_score;
      const projectScore = updateData.projectScore ?? existing.project_score;
      const jdMatchScore = updateData.jdMatchScore ?? existing.jd_match_score;
      const matchingSkills = updateData.matchingSkills ?? existing.matching_skills;
      const missingSkills = updateData.missingSkills ?? existing.missing_skills;
      const strengths = updateData.strengths ?? existing.strengths;
      const weaknesses = updateData.weaknesses ?? existing.weaknesses;
      const summary = updateData.summary ?? existing.summary;
      const interviewQuestions = updateData.interviewQuestions ?? existing.interview_questions;

      const result = await db.query(
        `UPDATE screenings
         SET score = $1, reason = $2, technical_score = $3, experience_score = $4,
             education_score = $5, project_score = $6, jd_match_score = $7,
             matching_skills = $8, missing_skills = $9, strengths = $10, weaknesses = $11,
             summary = $12, interview_questions = $13
         WHERE id = $14
         RETURNING *`,
        [
          score,
          reason,
          technicalScore,
          experienceScore,
          educationScore,
          projectScore,
          jdMatchScore,
          JSON.stringify(matchingSkills),
          JSON.stringify(missingSkills),
          JSON.stringify(strengths),
          JSON.stringify(weaknesses),
          summary,
          JSON.stringify(interviewQuestions),
          id,
        ]
      );
      return normalizeScreening(result.rows[0]);
    }

    const result = await db.query(
      `UPDATE screenings
       SET score = $1, reason = $2
       WHERE id = $3
       RETURNING *`,
      [updateData, reasonArg, id]
    );

    return normalizeScreening(result.rows[0]);
  },

  async delete(id) {
    const result = await db.query(
      `DELETE FROM screenings
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return normalizeScreening(result.rows[0]);
  },
};

export default Screening;