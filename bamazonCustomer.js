var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
  host: "localhost",

  // port
  port: 3306,

  // username
  user: "root",

  //  password
  password: "asdfasdf",
  database: "bamazon"
});

//to check if the connection actially happened
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllproducts();
  start();
});

//to show the list of products in the cli
function queryAllproducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("Items available for sale:")
    console.log("-------------------------------------------------");
    console.table(res);
    console.log("-------------------------------------------------");
  });

};

//function to prompt the user to choose the id of the product that they'd like to buy and the quantity that they'd like to buy
function start(res) {
  // query the database for all the products that are in the products table
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    inquirer

      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the id number of the product you would like to buy? "
        },
        {
          name: "quantity",
          type: "input",
          message: "How many units of the product would you like to buy? "
        }
      ])
      .then(function (answer) {

        var selection = answer.item;
        var quantity = answer.quantity;
        var newQuantity = res[0].stock_quantity - quantity;

        connection.query("SELECT * FROM products WHERE Id=?", selection, function (err, res) {
          if (err) throw err;
          if (res.length === 0) {
            console.log("Sorry... That product id does not match our records. please try again");
          }
        })
        if (newQuantity > 0) {
          // connection.query("UPDATE products SET ? WHERE",
          //   [
          //     {
          //       stock_quantity: newQuantity
          //     },
          //     {
          //       id: selection
          //     }
          //   ],
          //   function (err, res) {
          //     if (err) throw err;
          var totalprice = quantity * res[0].price
          console.log("The total cost of your purchase: " + "$" + totalprice)
          console.log("You just purchased: " + answer.quantity + " units of " + res[0].product_name);
          console.log("thank you for shoping at Bamazon")
          //   })
        }

        else {
          console.log("Sorry! we have an insufficient quantity!");
          queryAllproducts();
        }
   
          connection.end();
       
        })

  })
}

