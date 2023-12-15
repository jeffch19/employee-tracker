-- db/seeds.sql
USE employeetracker_db;

-- Add new departments
INSERT INTO department (name) VALUES
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Sales'),
  ('Service');

-- Add new roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Lead', 60000.00, 4),
  ('Salesperson', 50000.00, 4),
  ('Lead Engineer', 80000.00, 1),
  ('Software Engineer', 70000.00, 1),
  ('Account Manager', 75000.00, 2),
  ('Accountant', 60000.00, 2),
  ('Legal Team Lead', 75000.00, 3);

-- Add example employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Bob', 'Johnson', 3, 1);
