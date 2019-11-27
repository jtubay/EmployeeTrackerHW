const inquirer = require("inquirer");
const mysql = require("mysql");

const mainMenue = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Whate would you like to do?",
        choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View Employees",
          "View Roles",
          "View Departments",
          "Fire An Employee",
          "Update An Employee's Role",
          "Exit"
        ]
      }
    ])
    .then(answers => {
      switch (answers.action) {
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "View Employees":
          viewEmployees();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Departments":
          viewDepartments();
          break;
        case "Fire An Employee":
          fireAnEmployee();
          break;
        case "Update An Employee's Role":
          updateEmployee();
          break;
        default:
          console.log("exit");
          connection.end();
      }
    });
};

const fireAnEmployee = () => {
  connection.query("SELECT * FROM employees", (err, results) => {
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              choiceArray.push(
                `${results[i].first_name} ${results[i].last_name}`
              );
            }
            return choiceArray;
          },
          message: "Which employee would you like to fire?"
        }
      ])
      .then(answer => {
        for (let i = 0; i < results.length; i++) {
          let name = `${results[i].first_name} ${results[i].last_name}`;
          if (name === answer.choice) {
            connection.query(
              "DELETE FROM employees WHERE ?",
              {
                id: `${results[i].id}`
              },
              (err, res) => {
                if (err) throw err;
                console.log(`${name} has been fired!`);
                console.log("-----------------------------------");
                mainMenue();
              }
            );
          }
        }
      });
  });
};

const updateEmployee = () => {
  connection.query(
    `SELECT emp.first_name, emp.last_name, r.title AS role_title, CONCAT(mgr.first_name,' ', mgr.last_name) AS managers_name
    FROM employees AS emp
    LEFT JOIN role as r ON emp.role_id = r.id
    LEFT JOIN employees AS mgr ON emp.manager_id = mgr.id
    LEFT JOIN departments AS d ON r.department_id = d.id`,
    (err, results) => {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Which employee would you like to update?",
            name: "title",
            choices: function() {
              return results.map(emp => {
                return {
                  name: r.title,
                  value: r.id,
                  short: managers_name
                };
              });
            }
          }
        ])
        .then(answers => {});
    }
  );
};

const viewEmployees = () => {
  connection.query(
    `SELECT emp.first_name, emp.last_name, r.title AS role_title, CONCAT(mgr.first_name,' ', mgr.last_name) AS managers_name
    FROM employees AS emp
    LEFT JOIN role as r ON emp.role_id = r.id
    LEFT JOIN employees AS mgr ON emp.manager_id = mgr.id
    LEFT JOIN departments AS d ON r.department_id = d.id`,
    (err, results) => {
      console.table(results);
      mainMenue();
    }
  );
};

const viewDepartments = () => {
  connection.query("SELECT * FROM departments", (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenue();
  });
};

const viewRoles = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenue();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Department name?"
      }
    ])
    .then(answers => {
      connection.query(
        "INSERT INTO departments (name) VALUE (?)",
        [answers.name],
        (err, rows) => {
          if (err) throw err;
          console.log(`Adeed ${answers.name} to departments.`);
          mainMenue();
        }
      );
    });
};
const addRole = () => {
  connection.query("SELECT * FROM departments", (err, rows) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "Title?",
          name: "title"
        },
        {
          type: "input",
          message: "Salary?",
          name: "salary"
        },
        {
          type: "list",
          name: "department",
          message: "Department?",
          choices: function() {
            return rows.map(row => {
              return { name: row.name, value: row.id, short: row.name };
            });
          }
        }
      ])
      .then(answers => {
        connection.query(
          "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
          [answers.title, answers.salary, answers.department],
          (err, data) => {
            if (err) throw err;
            mainMenue();
          }
        );
      });
  });
};
const addEmployee = () => {
  connection.query("SELECT * FROM role", (err, role) => {
    if (err) throw err;
    connection.query("SELECT * FROM employees", (err, employees) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            message: "first name?",
            name: "firstName"
          },
          {
            type: "input",
            message: "last name?",
            name: "lastName"
          },
          {
            type: "list",
            message: "Role?",
            name: "roleId",
            choices: function() {
              return role.map(role => {
                return { name: role.title, value: role.id, short: role.title };
              });
            }
          },
          {
            type: "list",
            message: "manager",
            name: "managerId",
            choices: function() {
              return employees.map(emp => {
                return {
                  name: `${emp.first_name} ${emp.last_name}`,
                  value: emp.id,
                  short: emp.last_name
                };
              });
            }
          }
        ])
        .then(answers => {
          connection.query(
            "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)",
            [
              answers.firstName,
              answers.lastName,
              answers.roleId,
              answers.managerId
            ],
            (err, results) => {
              if (err) throw err;
              mainMenue();
            }
          );
        });
    });
  });
};

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "employee_tracker"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  mainMenue();
});
