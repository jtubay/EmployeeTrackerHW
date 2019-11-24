const mysql = require("mysql");
const inquirer = require("inquirer");

const connection= mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database:""
});

connection.connect((err) => {
    if(err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "initialAction",
            type: "list",
            message: "What would you like to do?",
            choices:["Add employee", "get employee", "remove"]
        })
}