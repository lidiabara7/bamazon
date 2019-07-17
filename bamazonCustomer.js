var mysql = require("mysql");

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
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllproducts();
});

//to show the list of products in the cli
function queryAllproducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("Items available for sale:")
    console.log("-------------------------------------------------");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-------------------------------------------------");
  });
  connection.end();
}
