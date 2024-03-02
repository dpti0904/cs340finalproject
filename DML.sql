------------------------------------------------------
-- Operations for Customers
------------------------------------------------------
-- Data Table Retrieve
SELECT customerID, firstName, lastName, email, phone, address FROM Customers;

-- Retrieve Customer Information when edit/delete button is pressed
SELECT customerID, firstName, lastName, email, phone, address FROM Customers
WHERE customerID = :customerID:;

-- Insert
INSERT INTO Customers (firstName, lastName, email, phone, address)
VALUES (:firstName:, :lastName:, :email:, :phone:, :address:);

-- Update
UPDATE Customers SET
        firstName=:firstName:,
        lastName=:lastName:,
        email=:email:,
        phone=:phone:,
        address=:address:
WHERE customerID = :customerID:;

-- Delete 
DELETE FROM Customers WHERE customerID = :customerID:;

------------------------------------------------------
-- Operations for Deliverers
------------------------------------------------------
-- Data Table Retrieve
SELECT delivererID, firstName, lastName, email, phone FROM Deliverers;

-- Retrieve Deliverer info when edit/delete button is pressed
SELECT delivererID, firstName, lastName, email, phone FROM Deliverers
WHERE delivererID = :delivererID:;

-- Insert
INSERT INTO Deliverers (firstName, lastName, email, phone)
VALUES (:firstName:, :lastName:, :email:, :phone:);

-- Update
UPDATE Deliverers SET
        firstName=:firstName:,
        lastName=:lastName:,
        email=:email:,
        phone=:phone:;
WHERE delivererID = :delivererID:;

-- Delete
DELETE FROM Deliverers WHERE delivererID = :delivererID:;

------------------------------------------------------
-- Operations for Restaurants
------------------------------------------------------
-- Data Table Retrieve
SELECT restaurantID, restaurantName, address, phone, cuisineType, hours FROM Restaurants;

-- Retrieve Restaurant info when edit/delete button is pressed
SELECT restaurantID, restaurantName, address, phone, cuisineType, hours FROM Restaurants
WHERE restaurantID = :restaurantID:;

-- Insert
INSERT INTO Restaurants (restaurantName, address, phone, cuisineType, hours)
VALUES (:restaurantName:, :address:, :phone:, :cuisineType:, :hours:);

-- Update
UPDATE Restaurants SET
        restaurantName = :restaurantName:,
        address = :address:,
        phone = :phone:,
        cuisineType = :cuisineType:,
        hours = :hours:
WHERE restaurantID = :restaurantID:;

-- Delete
DELETE FROM Restaurants WHERE restaurantID = :restaurantID:;

------------------------------------------------------
-- Operations for RestaurantsDishesTable
------------------------------------------------------
-- Data Table Retrieve
SELECT RestaurantsDishesTable.restaurantID, Restaurants.restaurantName, RestaurantsDishesTable.dishID, Dishes.name FROM RestaurantsDishesTable
INNER JOIN Restaurants ON RestaurantsDishesTable.restaurantID = Restaurants.restaurantID
INNER JOIN Dishes ON RestaurantsDishesTable.dishID = Dishes.dishID;

-- Insert
INSERT INTO RestaurantsDishesTable (restaurantID, orderID)
VALUES (:restaurantID:, :orderID:);

-- Dynamic Dropdowns
SELECT restaurantID, restaurantName FROM Restaurants;

SELECT dishID, name FROM Dishes;

------------------------------------------------------
-- Operations for Dishes
------------------------------------------------------
-- Data Table Retrieve
SELECT dishID, name as dishName, description, ingredient, price FROM Dishes

-- Retrieve Dish info when edit/delete button is pressed
SELECT dishID, name, description, ingredient, price FROM Dishes
WHERE dishID = :dishID:;


-- Insert
INSERT INTO Dishes (name, description, ingredient, price)
VALUES (:name:, :description:, :ingredient:, :price:);

-- Update
UPDATE Dishes SET
        name = :name:,
        description = :description:,
        ingredient = :ingredient:,
        price = :price:
WHERE dishID = :dishID:;

-- Delete
DELETE FROM Dishes WHERE dishID = :dishID:;

------------------------------------------------------
-- Operations for OrdersDishesTable
------------------------------------------------------
-- Data Table Retrieve
SELECT OrdersDishesTable.orderID, OrdersDishesTable.dishID, Dishes.name  FROM OrdersDishesTable
INNER JOIN Dishes ON OrdersDishesTable.dishID = Dishes.dishID;

-- Insert
INSERT INTO OrdersDishesTable (orderID, dishID)
VALUES (:orderID:, :dishID:);

-- Dynamic Dropdowns
SELECT orderID FROM Orders;

SELECT dishID, name FROM Dishes;

------------------------------------------------------
-- Operations for Orders
------------------------------------------------------
-- Data Table Retrieve
SELECT * FROM Orders;

-- Retrieve Order info when edit/delete button is pressed
SELECT orderID, delivererID, restaurantID, customerID, address, deliveryAddress, deliveryTime, specialInstructions, totalFee FROM Orders
WHERE orderID = :orderID:; 


-- Insert
INSERT INTO Orders (delivererID, restaurantID, customerID, deliveryAddress, deliveryStatus, deliveryTime, specialInstructions, totalFee)
VALUES (:delivererID:, :restaurantID:, :customerID:, :deliveryAddress:, :deliveryStatus:, :deliveryTime:, :specialInstructions:, :totalFee:)

-- Update
UPDATE Orders SET
        delivererID = :delivererID:,
        restaurantID = :restaurantID:,
        customerID = :customerID:,
        deliveryAddress = :deliveryAddress:,
        deliveryStatus = :deliveryStatus:,
        deliveryTime = :deliveryTime:,
        specialInstructions = :specialInstructions:,
        totalFee = :totalFee:
WHERE orderID = :orderID:;

SELECT * FROM Orders WHERE orderID = :orderID:;

-- Delete
DELETE FROM Orders WHERE orderID = :orderID:;

-- Dynamic Dropdowns
SELECT delivererID, firstName, lastName from Deliverers;

SELECT restaurantID, restaurantName FROM Restaurants;

SELECT customerID, firstName, lastName FROM Customers;
