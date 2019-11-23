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
tile VARCHAR(30),
salary DECIMAL,
department_id INT,
PRIMARY KEY (id) 
);

CREATE TABLE department (
id INT AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);