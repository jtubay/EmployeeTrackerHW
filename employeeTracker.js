const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table")

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
      }  else if (answer.initialAction === "Add Employee") {
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
  //connection.query("SELECT * FROM employee", (err, results) => {
    connection.query("SELECT first_name, last_name, title, salary, name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id", (err, results) => {
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
        console.table(results);
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
      },
      {
        name: "title",
        type: "list",
        message: "Pick the employee's title",
        choices: ["Web Dev", "Manager"]
      },
      {
        name: "department",
        type: "list",
        message: "Pick a department",
        choices: ["Technology", "HR"]
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
      connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title
          }
        
      )
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
                console.log(`${name} has been fired!`);
                console.log("-----------------------------------")
                start();
              }
            );
          }
        }
      });
  });
};

const updatedEmployeeByRole = () => {
    connection.query("SELECT first_name, last_name, title, salary, name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id", (err, results) => {
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
              message: "Which employee would you like to update?"
            },
            {
                name: "title",
                type: "list",
                choices: ["Web Dev", "Manager"],
                message: "Pick a new title"
            }
          ])
          .then((answer) => {
              console.log(answer.title)
            for (let i = 0; i < results.length; i++) {
                let name = `${results[i].first_name} ${results[i].last_name}`;
                if (name === answer.choice) {
                    connection.query(

                        "UPDATE  role SET ? WHERE ?",
                        [
                            {
                                title: answer.title
                            },
                            {
                                id: results[i].id
                            }
                        ],
                        (err) => {
                            if(err) throw err
                            start()
                        }
                    )
                }
            }

          })
        })
}


/*console.log(res[i].id + " | " + res[i].title + " | " + res[i].artist + " | " + res[i].genre);
}
console.log("-----------------------------------");*/