// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'your_host',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function query(sql, values) {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.query(sql, values);
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = { query };
