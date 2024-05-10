const pool = require("./servicesPool");

module.exports = {
  findAllQuestions: async () => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query("SELECT * FROM questions LIMIT 8");
      return rows;
    } finally {
      client.release();
    }
  }
};
