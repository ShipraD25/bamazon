DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(200),
  department_name VARCHAR(100),
  price DECIMAL (10,2),
  stock_quantity INTEGER(100),
  PRIMARY KEY (id)
);

 INSERT INTO products (product_name,department_name, price, stock_quantity)
 VALUES ("lego-duplo", "toys and games", 39.99, 30), ("cards against humanity", "board games", 12.99, 20), ("skinny jeans","apparel", 78.90, 40), ("wonder women", "films",12.99, 10),("iphone11 pro max","electronics", 1099,15),("cast iron skillet","home & kitchen", 20.99,20),("becoming", "Michelle Obama",11.89,10),("what Alice forgot","books",8.19,15),("iRobotRoomba","appliances",249.99,10),("Apple MacBook Air","electronics",699.95,10);