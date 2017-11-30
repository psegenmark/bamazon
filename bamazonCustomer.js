var mysql = require('mysql');
var inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "root",
  database: "bamazon"
});

con.query(("SELECT id, product_name, department_name, price FROM products"), function (err, results) {
  for (let i=0;i<results.length;i++){
  console.log("Id:" + results[i].id + "  " +  results[i].product_name + " is $" + results[i].price);
}
});

function timer() {
  setTimeout(function(){ prompt(); }, 2000);
}

function prompt() {
  inquirer.prompt([
  {
    name: "idOfProduct",
    type: "input",
    message: "What is the ID of the product you desire?",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  },{
    name: "qOfProduct",
    type: "input",
    message: "How many do you desire?",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }
]).then(function(answer){
  var id = answer.idOfProduct;
  var qRequested = answer.qOfProduct;
  queryDB(id, qRequested);
 
});

function queryDB(id, qRequested) {
con.query("SELECT id, stock_quantity, price FROM products WHERE id= ?", [id], function (err, results) {
  results.map(function(id){
    if(id.stock_quantity>qRequested) {
      var newQ = (id.stock_quantity-qRequested);
      console.log("Your Total is $" + (id.price*qRequested));
      con.query("UPDATE products SET stock_quantity= ? WHERE id= ?", [newQ, id.id], function (err, results) {
      });
    }
    else {
      console.log("Insufficient quantity!");
      prompt();
    }
  });

});
}

}

timer();
  