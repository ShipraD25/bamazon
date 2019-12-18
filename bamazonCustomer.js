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
    readproducts();
});


function readproducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;


        var table = new Table({
            head: ['id', 'product_name', 'price'],
            colWidths: [10, 60, 8]
        });

        for (var i = 0; i < res.length; i++) {

            table.push([res[i].id, res[i].product_name, res[i].price]);

        };
        console.log(table.toString());

        buyProduct();
    });

}


function buyProduct() {
    // query the database for all items being sold
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].id);
        }
        // once you have the items, prompt the user what they would like to purchase 
        inquirer
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: choiceArray,
                    message: "What is the id of the product that you would like to buy?"
                },
                {
                    name: "unit",
                    type: "input",
                    message: "How many units of the product you would like to buy?"
                }
            ])
            .then(function(answer) {
                // get the information of the chosen item
                var chosenItemId = parseInt(answer.choice)
                var chosenUnit = answer.unit;

                connection.query("SELECT * FROM products WHERE id=" + chosenItemId, function(err, results) {
                    if (err) throw err;
                    console.log(results)


                    // determine if the product is available
                    //console.log(results[0].stock_quantity, answer.unit);
                    if (results[0].stock_quantity >= parseInt(chosenUnit)) {
                        // bid was high enough, so update db, let the user know, and start over
                        console.log("Congratulations! your item is in stock!");
                        var newStock = results[0].stock_quantity - parseInt(chosenUnit);
                        //console.log("--->", newStock, chosenItemId);
                        var totalprice = parseInt(chosenUnit) * results[0].price
                            // chosenItemId.stock_quantity -= parseInt(answer.unit);
                        connection.query("UPDATE products SET ? WHERE ?", [{
                                    stock_quantity: newStock
                                },
                                {
                                    id: chosenItemId

                                }
                            ],
                            function(err, res) {

                                console.log("order placed successfully!, total price: ", totalprice);
                                keepOrQuit();

                                // and i will call back to show the produts and to the inquire
                                //  connection.end();

                            })

                    } else {
                        // bid wasn't high enough, so apologize and start over
                        console.log("Insufficient quantity!");
                        keepOrQuit();
                    }

                });
            });
    });
};

function keepOrQuit() {
    inquirer
        .prompt([{
            name: "reply",
            type: "confirm",
            message: "Would you like to buy more products? "
        }])
        .then(function(answer) {
            if (answer.reply) {
                readproducts();
            } else {
                console.log("Thanks for shopping with us. See you later!");
                connection.end();
                process.exit();

            }
        });

    //inq
    //  if yes readproducts()
    //else 


}