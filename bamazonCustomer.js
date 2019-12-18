var mysql = require("mysql");
var inquirer = require("inquirer");
//var table = require("table");
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
    readproducts();
});


function readproducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("------------------------------");
        console.log("    Welcome To Bamazon        ");
        console.log("------------------------------");
        // Log all results of the SELECT statement
        var table = new Table({
            head: ['id', 'product_name', 'price'],
            colWidths: [10, 60, 8]
        });

        for (var i = 0; i < res.length; i++) {

            table.push([res[i].id, res[i].product_name, res[i].price]);

        };
        console.log(table.toString());

        buyProduct()
    });

}
/*connection.query("SELECT id, product_name, price FROM products", function(error, response) {
    if (error)
        console.log(error);
    else
    // console.log(response);
    // console.table(response);
        
    
});*/

function buyProduct() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].id);
        }
        // once you have the items, prompt the user for which they'd like to bid on
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
                        // once you have the items, prompt the user for which they'd like to bid on


                    // determine if bid was high enough
                    console.log(results[0].stock_quantity, answer.unit);
                    if (results[0].stock_quantity >= parseInt(answer.unit)) {
                        // bid was high enough, so update db, let the user know, and start over
                        console.log("Congratulations! your item is in stock!")
                        var newStock = results[0].stock_quantity - parseInt(answer.unit)
                        console.log("--->", newStock, chosenItemId)
                        var totalprice = parseInt(answer.unit) * results[0].price
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
                                keepORquit()

                                // and i will call back to show the produts and to the inquire
                                //  connection.end();

                            })

                    } else {
                        // bid wasn't high enough, so apologize and start over
                        console.log("Insufficient quantity!");
                        keepORquit()
                    }

                });
            });
    });
};

function keepORquit() {

    //inq
    //  if yes readproducts()
    //else 
    if (true) {
        readproducts()
    } else {
        connection.end()
        process.exit()
    }
}