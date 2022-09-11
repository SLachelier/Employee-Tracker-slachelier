USE emptracker_db;

INSERT INTO department
    (name)
VALUES
('Operations'),
('Development'),
('HR');

INSERT INTO role
    (title, salary, department_id)
VALUES
('Data Scientist', '120000', 1),
('Developer', '100000', 2),
('Representative', '70000', 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
('Maria', 'Barton', 1, NULL),
('Jose', 'Gonzalez', 2, NULL),
('Bianca', 'Brewer', 3, NULL);


UPDATE employee
SET manager_id = 1
WHERE role_id = 2;