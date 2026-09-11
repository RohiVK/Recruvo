import db from "../config/db.js";

export async function submitFeedback(req, res) {
  try {
    const { rating, type = "feedback", message } = req.body;

    if (!rating && !message) {
      return res.status(400).json({
        error: "Rating or message is required",
      });
    }

    const result = await db.query(
      `INSERT INTO feedback (rating, type, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [rating || null, type, message || ""]
    );

    return res.status(201).json({
      message: type === "bug" ? "Bug report received. Thank you!" : "Thank you for your feedback!",
      feedback: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to save feedback:", error);
    return res.status(500).json({
      error: "Failed to submit feedback",
    });
  }
}

export async function getFeedbacks(req, res) {
  try {
    const result = await db.query("SELECT * FROM feedback ORDER BY id DESC");
    return res.status(200).json({
      feedbacks: result.rows,
    });
  } catch (error) {
    console.error("Failed to get feedback:", error);
    return res.status(500).json({
      error: "Failed to fetch feedback",
    });
  }
}
