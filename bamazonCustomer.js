var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'bamazon'
});

connection.connect(function(error){
	if (error) {
		return error;
	}

		start();
});


function start(){
	connection.query('SELECT * FROM products', function(error, results){
		if (error) {
			return error;
		}

		for (var i = 0; i < results.length; i++) {
			console.log('Product: ' + results[i].product_name + '\nID: ' + results[i].id + '\nPrice: ' + results[i].price + '\nQuantity: ' + results[i].stock_quantity + '\n-------------------------------');
		}

		inquire();
	});
}


function inquire() {
	inquirer.prompt([
		{
			name: 'itemID',
			type: 'input',
			message: 'Enter ID of product you would like to purchase!'
		},
		{
			name: 'itemAmount',
			type: 'input',
			message: 'How many would you like?'
		}
	]).then(function(answers){
		connection.query('SELECT id, product_name, price, stock_quantity FROM products WHERE id = "' + answers.itemID + '"', function(error, results){

			if (error) {
				return error;
			}

			if (answers.itemAmount > results[0].stock_quantity) {
				console.log('Insufficient quantity!');
				inquire();
			} 

			else if (answers.itemAmount <= results[0].stock_quantity){
				var totalQuantity = results[0].stock_quantity - answers.itemAmount;

				console.log('Your total for ' + answers.itemAmount + ' ' + results[0].product_name + '(s) is ' +(answers.itemAmount * results[0].price) );

				connection.query('UPDATE products SET ? WHERE ?', 
					[{
						stock_quantity: totalQuantity
					},
					{
						id: answers.itemID
					}],
				function(error, results){
					if (error) {
						return error;
					}

					// console.log('Amount updated!');
				})

				inquire();
			}

		})
	})
}
