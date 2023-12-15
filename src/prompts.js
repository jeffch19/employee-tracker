// src/prompts.js
const inquirer = require('inquirer');
const db = require('../db/db');

// Add the following roles to the choices array
const roleChoices = [
  { name: 'Sales Lead', value: 1 },
  { name: 'Salesperson', value: 2 },
  { name: 'Lead Engineer', value: 3 },
  { name: 'Software Engineer', value: 4 },
  { name: 'Account Manager', value: 5 },
  { name: 'Accountant', value: 6 },
  { name: 'Legal Team Lead', value: 7 },
];


async function viewAllDepartments() {
  const departments = await db.getAllDepartments();
  console.table(departments);
}

async function viewAllRoles() {
  const roles = await db.getAllRoles();
  console.table(roles);
}

async function viewAllEmployees() {
  const employees = await db.getAllEmployees();
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
      choices: roleChoices,
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
