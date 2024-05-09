const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SpideySpeedDating',
  password: 'admin',
  port: 5432, // default PostgreSQL port
});

module.exports = pool;
