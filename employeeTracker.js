const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "employeeTracker_DB"
});

connection.connect(err => {
  if (err) throw err;
  console.log("connected");
  start();
});

function start() {
  inquirer
    .prompt({
      name: "initialAction",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "Add Employee",
        "Remove Employee",
        "Update Employee By Role"
      ]
    })
    .then(answer => {
      if (answer.initialAction === "View All Employees") {
        console.log("View All Employees");
        viewEmployees();
      } else if (answer.initialAction === "View All Employees By Departmen") {
        viewEmployeesByDep();
      } else if (answer.initialAction === "Add Employee") {
        addEmployee();
      } else if (answer.initialAction === "Remove Employee") {
        removeEmployee();
      } else if (answer.initialAction === "Update Employee By Role") {
        updatedEmployeeByRole();
      } else {
        connection.end();
      }
    });
}

const viewEmployees = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
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
          message: "Which employee would you like to view?"
        }
      ])
      .then(answer => {
        console.log(answer.choice);
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: ["Return to start", "End"],
              message: "What would you like to do now?"
            }
          ])
          .then(answer => {
            if (answer.choice === "Return to start") {
              start();
            } else {
              connection.end();
            }
          });
      });
  });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      }
    ])
    .then(answer => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName
        },
        err => {
          if (err) throw err;
          console.log("Employee was added");
          start();
        }
      );
    });
};

const removeEmployee = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
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
        const id = [];
        for (let i = 0; i < results.length; i++) {
          let name = `${results[i].first_name} ${results[i].last_name}`;
          if (name === answer.choice) {
            connection.query(
              "DELETE FROM employee WHERE ?",
              {
                id: `${results[i].id}`
              },
              (err, res) => {
                if (err) throw err;
                console.log("Deleted");
                start();
              }
            );
          }
        }
      });
  });
};
