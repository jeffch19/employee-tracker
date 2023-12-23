const inquirer = require('inquirer');
const db = require('../db/db');
const process = require('process'); // Import the process module

async function viewAllDepartments() {
  const departments = await db.getAllDepartments();
  console.table(departments);
}

async function viewAllRoles() {
  const query = `
    SELECT id, title, salary, department_id
    FROM role;
  `;

  const roles = await db.query(query);
  console.table(roles);
}

async function viewAllEmployees() {
  const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, department.name AS department_name, CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN department ON roles.department_id = department.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id;
  `;

  const employees = await db.query(query);
  console.table(employees);
}

async function addDepartmentPrompt() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);
  await db.addDepartment(name);
  console.log('Department added successfully!');
}

async function addRolePrompt() {
  const departments = await db.getAllDepartments();
  const roleQuestions = [
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the role:',
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department for the role:',
      choices: departments.map((department) => ({ name: department.name, value: department.id })),
    },
  ];

  const { title, salary, departmentId } = await inquirer.prompt(roleQuestions);
  await db.addRole(title, salary, departmentId);
  console.log('Role added successfully!');
}

async function addEmployeePrompt() {
  // Update roleChoices dynamically after adding a new role
  const roles = await db.getAllRoles();
  const employees = await db.getAllEmployees();
  const employeeQuestions = [
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee:',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee:',
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role for the employee:',
      choices: roles.map((role) => ({ name: role.title, value: role.id })),
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the manager for the employee:',
      choices: [{ name: 'None', value: null }, ...employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))]
    },
  ];

  const { firstName, lastName, roleId, managerId } = await inquirer.prompt(employeeQuestions);
  await db.addEmployee(firstName, lastName, roleId, managerId);
  console.log('Employee added successfully!');
}

async function updateEmployeeRolePrompt() {
  const employees = await db.getAllEmployees();
  const roles = await db.getAllRoles();
  const updateEmployeeRoleQuestions = [
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
    },
    {
      type: 'list',
      name: 'newRoleId',
      message: 'Select the new role for the employee:',
      choices: roles.map((role) => ({ name: role.title, value: role.id })),
    },
  ];

  const { employeeId, newRoleId } = await inquirer.prompt(updateEmployeeRoleQuestions);
  await db.updateEmployeeRole(employeeId, newRoleId);
  console.log('Employee role updated successfully!');
}

async function start() {
  try {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Quit', // Add a "Quit" option
        ],
      },
    ]);

    switch (action) {
      case 'View all departments':
        await viewAllDepartments();
        break;
      case 'View all roles':
        await viewAllRoles();
        break;
      case 'View all employees':
        await viewAllEmployees();
        break;
      case 'Add a department':
        await addDepartmentPrompt();
        break;
      case 'Add a role':
        await addRolePrompt();
        break;
      case 'Add an employee':
        await addEmployeePrompt();
        break;
      case 'Update an employee role':
        await updateEmployeeRolePrompt();
        break;
      case 'Quit':
        process.exit(); // Exit the application
        break;
      default:
        console.log('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    start(); // Restart the application
  }
}

module.exports = { start };
