/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
PORT = 8107;

// Serve static files
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// Database
var db = require('./database/db-connector');

// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');



/*
    ROUTES
*/



/* Home */
app.get('/', function(req, res)
    {
        res.render('index');
    });

/* Customers */
app.get('/customers', function(req, res)
{   
    let queryTable = "SELECT * FROM Customers"
    db.pool.query(queryTable, function(error, rows, fields){
        res.render('customers', {data:rows});
    })
});

/* Deliverers */
app.get('/deliverers', function(req, res)
{   
    let queryTable = "SELECT * FROM Deliverers"
    db.pool.query(queryTable, function(error, rows, fields){
        res.render('deliverers', {data:rows});
    })
});

/* Restaurants */
app.get('/restaurants', function(req, res)
{   
    let queryTable = "SELECT * FROM Restaurants"
    db.pool.query(queryTable, function(error, rows, fields){
        res.render('restaurants', {data:rows});
    })
});

/* Restaurant Dishes */
app.get('/restaurantsdishes', function(req, res)
{   
    let queryTable = "SELECT RestaurantsDishesTable.restaurantID, Restaurants.restaurantName, RestaurantsDishesTable.dishID, Dishes.name as dishName FROM RestaurantsDishesTable INNER JOIN Restaurants ON RestaurantsDishesTable.restaurantID = Restaurants.restaurantID INNER JOIN Dishes ON RestaurantsDishesTable.dishID = Dishes.dishID;"
    db.pool.query(queryTable, function(error, rows, fields){
        res.render('restaurants_dishes', {data:rows});
    })
});

/* Dishes */
app.get('/dishes', function(req, res)
{   
    let queryTable = "SELECT dishID, name as dishName, description, ingredient, price FROM Dishes"
    db.pool.query(queryTable, function(error, rows, fields){
        res.render('dishes', {data:rows});
    })
});

/* Ordered Dishes */
app.get('/ordersdishes', function(req, res)
{   
    let queryTable = "SELECT OrdersDishesTable.orderID, OrdersDishesTable.dishID, Dishes.name as dishName FROM OrdersDishesTable INNER JOIN Dishes ON OrdersDishesTable.dishID = Dishes.dishID;"
    db.pool.query(queryTable, function(error, rows, fields){
        res.render('orders_dishes', {data:rows});
    })
});

/* Orders */
app.get('/orders', function(req, res)
{   
    let queryTable = "SELECT * FROM Orders;";
    let queryDropDeli = "SELECT delivererID, firstName, lastName FROM Deliverers ORDER BY delivererID ASC;";
    let queryDropRest = "SELECT restaurantID, restaurantName FROM Restaurants ORDER BY restaurantID ASC;";
    let queryDropCust = "SELECT customerID, firstName, lastName FROM Customers ORDER BY customerID ASC;";
    let queryDropOrd = "SELECT orderID FROM Orders ORDER BY orderID ASC;";

    db.pool.query(queryTable, function(error, rows, fields){
        let orders = rows;


        db.pool.query(queryDropDeli, (error, rows, fields) => {
            let deliverer = rows;

            db.pool.query(queryDropRest, (error, rows, fields) => {
                let restaurant = rows;

                db.pool.query(queryDropCust, (error, rows, field) => {
                    let customer = rows;

                    db.pool.query(queryDropOrd, (error, rows, field) => {
                        let order = rows;

                        return res.render('orders', {data: orders, deliverer: deliverer, restaurant: restaurant, customer: customer, order: order});
                    }) 
                })
            })
        })
    })
});

app.post('/add-order-ajax', function(req, res)
    {
        let data = req.body;

        let delivererID = parseInt(data.delivererID);
        if (isNaN(delivererID))
        {
            delivererID = 'NULL'
        }

        let restaurantID = parseInt(data.restaurantID);
        if (isNaN(restaurantID))
        {
            restaurantID = 'NULL'
        }
        
        let customerID = parseInt(data.customerID);
        if (isNaN(customerID))
        {
            customerID = 'NULL'
        }

        let totalFee = parseInt(data.totalFee);
        if (isNaN(totalFee))
        {
            totalFee = 'NULL'
        }

        let deliveryTime = data.deliveryTime.replace("T"," ")

            // Create the query and run it on the database
    queryAdd = `INSERT INTO Orders (delivererID, restaurantID, customerID, deliveryAddress, deliveryStatus, deliveryTime, specialInstructions, totalFee) VALUES (${delivererID}, ${restaurantID}, ${customerID}, "${data.deliveryAddress}", ${data.deliveryStatus}, "${deliveryTime}", "${data.specialInstructions}", ${totalFee});`;
    
    db.pool.query(queryAdd, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Orders
            querySelect = `SELECT * FROM Orders;`;
            db.pool.query(querySelect, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
    });

app.delete('/delete-order-ajax/', function(req, res, next) {
    let data = req.body;
    let orderID = parseInt(data.id);
    let deleteOrder = 'DELETE FROM Orders WHERE orderID = ?;'

    db.pool.query(deleteOrder, [orderID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
})

app.put('/put-order-ajax', function(req,res,next){
    let data = req.body;

    // If delivererID or restaurantID is set to null by user, sets value to null, otherwise parses into integer.
    if (data.delivererID == null) {
        delivererID = null
    } else {
        delivererID = parseInt(data.delivererID)
    };
    
    if (data.restaurantID == null) {
        restaurantID = null
    } else {
        restaurantID = parseInt(data.restaurantID);
    }

    let customerID = parseInt(data.customerID);
    let deliveryAddress = data.deliveryAddress;
    let deliveryStatus = parseInt(data.deliveryStatus);
    let deliveryTime = data.deliveryTime;
    let specialInstructions = data.specialInstructions;
    let totalFee = parseInt(data.totalFee);
    let orderID = parseInt(data.orderID);
  
    let queryUpdate = `UPDATE Orders SET
                        delivererID = ?,
                        restaurantID = ?,
                        customerID = ?,
                        deliveryAddress = ?,
                        deliveryStatus = ?,
                        deliveryTime = ?,
                        specialInstructions = ?,
                        totalFee = ?
                        WHERE orderID = ?;`;
    let selectOrder = `SELECT * FROM Orders WHERE orderID = ?;`;
  
          // Run the 1st query
          db.pool.query(queryUpdate, [delivererID, restaurantID, customerID, deliveryAddress, deliveryStatus, deliveryTime, specialInstructions, totalFee, orderID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectOrder, [orderID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

app.post('/get-order-form-ajax', function(req,res,next){
    let data = req.body;
    let orderID = parseInt(data.orderID)

    let queryFindOrder = `SELECT * FROM Orders WHERE orderID = ?`

        db.pool.query(queryFindOrder, [orderID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else {

              res.send(rows);
            }
        })
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
