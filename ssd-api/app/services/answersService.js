const pool = require("./DBPool");

module.exports = {
  createAnswer: async (query) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        "INSERT INTO answers (answer, user_question_id) VALUES ($1, $2) RETURNING *",
        [query.answer, query.user_question_id]
      );
      return rows[0];
    } finally {
      client.release();
    }
  },

  findAnswer: async (user_question) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query("SELECT * FROM answers WHERE user_question_id = $1", [user_question.user_question_id]);
      return rows[0] || undefined;
    } finally {
      client.release();
    }
  }
};
