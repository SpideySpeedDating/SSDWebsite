const pool = require("./servicesPool");

module.exports = {
  createUserQuestion: async (userQuestion) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'INSERT INTO user_questions (user_id, question_id) VALUES ($1, $2) RETURNING *',
        [userQuestion.user_id, userQuestion.question_id]
      );
      return rows[0];
    } finally {
      client.release();
    }
  },

  findUserQuestion: async (query) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'SELECT * FROM user_questions WHERE user_id = $1 AND question_id = $2',
        [query.user_id, query.question_id]
      );
      return rows[0];
    } finally {
      client.release();
    }
  },

  findAllUserQuestions: async (user) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT * FROM user_questions WHERE user_id = $1', [user.user_id]);
      return rows;
    } finally {
      client.release();
    }
  },

  deleteUserQuestion: async (query) => {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM user_questions WHERE user_question_id = $1', [query.user_question_id]);
    } finally {
      client.release();
    }
  }
};
