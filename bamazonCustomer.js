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
async function start() {
  // query the database for all the products that are in the products table
  await connection.query("SELECT * FROM products", function (err, res) {
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

        //do this if the quantity select is more then what is in stock
         connection.query("SELECT * FROM products WHERE stock_quantity", quantity, function (err, res) {
          if (err) throw err;

          if (quantity > res[0].stock_quatity) {
            console.log("Sorry! we have an insufficient quantity!")
          }
        });

        //if the custumer enters a product id that is not valid
        connection.query("SELECT * FROM products WHERE Id=?", selection, function (err, res) {
          if (err) throw err;

          if (res.length === 0) {
            console.log("Sorry... That product id does not match our records. please try again");
          }

          else {
            var totalprice = quantity * res[0].price
            console.log("The total cost of your purchase: " + "$" + totalprice)
            console.log("You just purchased: " + res[0].product_name);

            //to update the new quantity
            var newQuantity = res[0].stock_quantity - quantity;
            console.log(newQuantity)

            // connection.query("UPDATE product SET stock_quantity =", newQuantity, "WHERE stock_quantity =", res[0].stock_quantity, function (err, res) {
            // if (err) throw err;
            // console.log(res)
            //   console.log("Your order was succefully placed!")
            //   console.log("thank you for shoping at Bamazon")
            // })
          }
// i want ot replace the current amount - the qunatity from the inquirer
        })
        connection.end();
      })
  })
}




// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
