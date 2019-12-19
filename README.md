# bamazon
Bamazon is a Node and MySQL based ecommerce app(backend).
The app will take in orders from customers and deplete stock from the store's inventory.It uses MySQL database to connect and retrieve product information.


### App-Demo
![app-demo](https://media.giphy.com/media/cOzWoMyP95X6Z7u7CU/giphy.gif)

## Getting Started
#### These instructions will get you a copy of the project up and running on your local machine.
1. Clone the repository
2. Run nmp install 
#### Go to npmjs if you want to know more about other node modules used in the project:
1. **inquirer**: https://www.npmjs.com/package/inquirer
2. **mySQL**: https://www.npmjs.com/package/mysql
3. **cli-table**: https://www.npmjs.com/package/cli-table
## Built With
- Nodejs
- Javascript
- github

## How this work?

#### Customer.js
This module firstly displays all the items available for sale in the store. 
Then it prompts user to select items to buy from the list.
As the user selects items and unit of it to buy,it then goes and checks if suffient quantity is available for the user to buy or not. 
If the quantity is available the purchase is made and total price is shown to the user.
The stock quantity is also updated after the purchase in the database.
If the quantity is not sufficient for the purchase to go through a "insufficient quantity" message is displayed on the screen. The code snippet that shows how this was accomplished is as follows-
    
### Code Snippet

```
connection.query("SELECT * FROM products WHERE id=" + chosenItemId, function(err, results) {
                    if (err) throw err;
                    // determine if the product is available

                    if (results[0].stock_quantity >= parseInt(chosenUnit)) {
                        // if the unit asked is available, update db, let the user know ask to keep shoopinn or quit
                        console.log("Congratulations! your item is in stock!");
                        var newStock = results[0].stock_quantity - parseInt(chosenUnit);

                        var totalprice = parseInt(chosenUnit) * results[0].price

                        connection.query("UPDATE products SET ? WHERE ?", [{
                                    stock_quantity: newStock
                                },
                                {
                                    id: chosenItemId
                                }
                            ],
                            function(err, res) {

                                console.log("your order was placed successfully!, total price: ", totalprice);
                                keepOrQuit();
                            })
                    } else {
                        // the unit asked by user was not in stock
                        console.log("Insufficient quantity!");
                        keepOrQuit();
                    }

```

        
