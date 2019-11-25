DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE role (
id INT AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
PRIMARY KEY (id) 
);

CREATE TABLE department (
id INT AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);


SELECT * FROM employee;
INSERT INTO employee (first_name, last_name, role_id)
VALUES("Tom","Sawyer", 1),("Matha","Steward", 2), ("James","Tolkin", 1), ("Neil","Gaiman", 2);

INSERT INTO role (title, salary, department_id)
VALUES("Wed Dev", 70000.0, 2);

INSERT INTO role (title, salary, department_id)
VALUES("Manager", 100000.0, 1);


INSERT INTO department (name)
VALUE("HR");

INSERT INTO department (name)
VALUE("Technology");

