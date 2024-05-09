const pool = require("./servicesPool");

module.exports = {
  createUser: async (token ,user) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'INSERT INTO users (auth_id, email, username, gender, sexuality, age) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [token ,user.email, user.username, user.gender, user.sexuality, user.age]
      );
      return rows[0];
    } finally {
      client.release();
    }
  },

  findAllUsers: async () => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT * FROM users');
      return rows;
    } finally {
      client.release();
    }
  },

  findUserByAuthId: async (authId) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT * FROM users WHERE auth_id = $1', [authId]);
      return rows[0];
    } finally {
      client.release();
    }
  },

  updateUser: async (token, updatedValue) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'UPDATE users SET email = $1, username = $2, gender = $3, sexuality = $4, age = $5 WHERE auth_id = $6 RETURNING *',
        [updatedValue.email, updatedValue.username, updatedValue.gender, updatedValue.sexuality, updatedValue.age, token]
      );
      return rows[0];
    } finally {
      client.release();
    }
  }
  // { 
  //   email: 'example@example.com'
  //   username: ''
  //   gender: ''
  //   sexuality: ''
  //   age: ''
  // }
};
