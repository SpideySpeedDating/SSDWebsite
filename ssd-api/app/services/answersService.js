const pool = require("./servicesPool");

module.exports = {
  createAnswer: async (answer) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'INSERT INTO answers (answer, user_question_id) VALUES ($1, $2) RETURNING *',
        [answer.answer, answer.user_question_id]
      );
      return rows[0];
    } finally {
      client.release();
    }
  },

  findAnswer: async (query) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT * FROM answers WHERE answer_id = $1', [query.answer_id]);
      return rows[0];
    } finally {
      client.release();
    }
  },

  updateAnswer: async (query, updatedValue) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'UPDATE answers SET answer = $1, question_id = $2 WHERE answer_id = $3 RETURNING *',
        [updatedValue.answer, updatedValue.question_id, query.answer_id]
      );
      return rows[0];
    } finally {
      client.release();
    }
  },

  findAllAnswers: async () => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT * FROM answers');
      return rows;
    } finally {
      client.release();
    }
  },

  deleteAnswer: async (query) => {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM answers WHERE answer_id = $1', [query.answer_id]);
    } finally {
      client.release();
    }
  }
};
