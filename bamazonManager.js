var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "Localhost",
    password: "password",
    database: "bamazon_db",
    user: "root",
    port: 3306
});

connection.connect(function(error) {
    if (error) throw error;
    console.log("-------------------------------");
    console.log("*****Welcome To Bamazon********");
    console.log("-------------------------------");
    showOptions();
});

function showOptions() {
    inquirer.prompt([{
        type: "list",
        name: "command",
        message: "what would you like to do?",
        choices: ["View products for sale",
            "View low inventory", "Add to inventory", "add new product", "Exit"
        ]
    }]).then(function(answer) {
        switch (answer.command) {
            case "View products for sale":
                displayAll();
                break;
            case "View low inventory":
                lowInventoryDisplay();
                break;

            case "Add to inventory":
                addInventory();
                break;
            case "Add new product":
                addNewProduct();
                break;

            case "Exit":
                end();
                break;
        }
    })
}

function displayAll() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;


        var table = new Table({
            head: ['id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 60, 60, 6, 6]
        });

        for (var i = 0; i < res.length; i++) {

            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);

        };
        console.log(table.toString());

        showOptions();
        break;
    });

}

function lowInventoryDisplay() {
    connection.query("SELECT * FROM products where stock_quantity <5", function(error, res) {
        if (error) throw error;
        if (res.length === 0) {
            console.log("We didn't find any products low in stock");
            showOptions();
            return;
        }

        var table = new Table({
            head: ['id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 60, 30, 6, 6]
        });

        for (var i = 0; i < res.length; i++) {

            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);

        };
        console.log(table.toString());
        console.log("\n");
        showOptions();
        break;
    });

};