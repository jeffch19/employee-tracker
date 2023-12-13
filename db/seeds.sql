-- db/seeds.sql
INSERT INTO department (id, name) VALUES
  (1, 'Department 1'),
  (2, 'Department 2');

INSERT INTO role (id, title, salary, department_id) VALUES
  (1, 'Manager', 60000.00, 1),
  (2, 'Developer', 50000.00, 2),
  (3, 'HR Specialist', 55000.00, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
  (1, 'John', 'Doe', 1, NULL),
  (2, 'Jane', 'Smith', 2, 1),
  (3, 'Bob', 'Johnson', 3, 1);
