// db/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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

async function getAllDepartments() {
  return await query('SELECT * FROM department');
}

async function getAllRoles() {
  return await query('SELECT * FROM role');
}

async function getAllEmployees() {
  return await query('SELECT * FROM employee');
}

async function addDepartment(name) {
  return await query('INSERT INTO department (name) VALUES (?)', [name]);
}

async function addRole(title, salary, departmentId) {
  return await query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
}

async function addEmployee(firstName, lastName, roleId, managerId) {
  return await query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
    firstName,
    lastName,
    roleId,
    managerId,
  ]);
}

async function updateEmployeeRole(employeeId, newRoleId) {
  return await query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
}

module.exports = { query, getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };
