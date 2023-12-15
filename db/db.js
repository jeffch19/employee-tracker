// db/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'employeetracker_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Executes a SQL query and returns the result.
 * @param {string} sql 
 * @param {Array} values 
 * @returns {Promise<Array>} 
 */
async function query(sql, values) {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Gets all departments from the database.
 * @returns {Promise<Array>} Array of departments.
 */
async function getAllDepartments() {
  return await query('SELECT * FROM department');
}

/**
 * Gets all roles from the database.
 * @returns {Promise<Array>} 
 */
async function getAllRoles() {
  return await query('SELECT * FROM role');
}

/**
 * Gets all employees from the database.
 * @returns {Promise<Array>}
 */
async function getAllEmployees() {
  return await query('SELECT * FROM employee');
}

/**
 * Adds a new department to the database.
 * @param {string} name 
 * @returns {Promise<void>} 
 */
async function addDepartment(name) {
  return await query('INSERT INTO department (name) VALUES (?)', [name]);
}

/**
 * Adds a new role to the database.
 * @param {string} title 
 * @param {number} salary 
 * @param {number} departmentId 
 * @returns {Promise<void>} 
 */
async function addRole(title, salary, departmentId) {
  return await query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
}

/**
 * Adds a new employee to the database.
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {number} roleId 
 * @param {number} managerId 
 * @returns {Promise<void>} 
 */
async function addEmployee(firstName, lastName, roleId, managerId) {
  return await query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
    firstName,
    lastName,
    roleId,
    managerId,
  ]);
}

/**
 * Updates the role of an employee in the database.
 * @param {number} employeeId 
 * @param {number} newRoleId 
 * @returns {Promise<void>} 
 */
async function updateEmployeeRole(employeeId, newRoleId) {
  return await query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
}

/**
 * Updates the manager of an employee in the database.
 * @param {number} employeeId 
 * @param {number} newManagerId 
 * @returns {Promise<void>} 
 */
async function updateEmployeeManager(employeeId, newManagerId) {
  await query('UPDATE employee SET manager_id = ? WHERE id = ?', [newManagerId, employeeId]);
}

/**
 * Gets all employees reporting to a specific manager.
 * @param {number} managerId 
 * @returns {Promise<Array>} 
 */
async function getEmployeesByManager(managerId) {
  return await query('SELECT * FROM employee WHERE manager_id = ?', [managerId]);
}

/**
 * Gets all employees in a specific department.
 * @param {number} departmentId 
 * @returns {Promise<Array>} 
 */
async function getEmployeesByDepartment(departmentId) {
  return await query('SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)', [departmentId]);
}

/**
 * Deletes a department from the database.
 * @param {number} departmentId 
 * @returns {Promise<void>} 
 */
async function deleteDepartment(departmentId) {
  await query('DELETE FROM department WHERE id = ?', [departmentId]);
}

/**
 * Deletes a role from the database.
 * @param {number} roleId 
 * @returns {Promise<void>} 
 */
async function deleteRole(roleId) {
  await query('DELETE FROM role WHERE id = ?', [roleId]);
}

/**
 * Deletes an employee from the database.
 * @param {number} employeeId 
 * @returns {Promise<void>} 
 */
async function deleteEmployee(employeeId) {
  await query('DELETE FROM employee WHERE id = ?', [employeeId]);
}

/**
 * Calculates and returns the total utilized budget of a department.
 * @param {number} departmentId 
 * @returns {Promise<number>} 
 */
async function getTotalUtilizedBudget(departmentId) {
  const roles = await query('SELECT * FROM role WHERE department_id = ?', [departmentId]);
  const totalBudget = roles.reduce((acc, role) => acc + role.salary, 0);
  return totalBudget;
}

module.exports = {
  query,
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  getEmployeesByManager,
  getEmployeesByDepartment,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  getTotalUtilizedBudget,
};
