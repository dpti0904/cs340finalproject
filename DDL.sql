----------------------------------------------------------------
-- Disables commits and foreign key checks.
----------------------------------------------------------------

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

----------------------------------------------------------------
-- Create the tables
----------------------------------------------------------------

-- Entities
CREATE OR REPLACE TABLE Restaurants (
    restaurantID int(11) AUTO_INCREMENT NOT NULL,
    restaurantName varchar(60) NOT NULL,
    address varchar(100) not NULL,
    phone varchar(20) NOT NULL,
    cuisineType varchar(55) NOT NULL,
    hours varchar(300) NOT NULL,
    PRIMARY KEY (restaurantID),
    UNIQUE (phone)
);

CREATE OR REPLACE TABLE Customers (
    customerID int(11) AUTO_INCREMENT NOT NULL,
    firstName varchar(55) NOT NULL,
    lastName varchar(55) NOT NULL,
    email varchar(55) NOT NULL,
    phone varchar(20) NOT NULL,
    address varchar(155),
    PRIMARY KEY (customerID),
    UNIQUE (email),
    UNIQUE (phone)
);

CREATE OR REPLACE TABLE Deliverers (
    delivererID int(11) AUTO_INCREMENT NOT NULL,
    firstName varchar(55) NOT NULL,
    lastName varchar(55) NOT NULL,
    email varchar(55) NOT NULL,
    phone varchar(20) NOT NULL,
    PRIMARY KEY (delivererID),
    UNIQUE (email),
    UNIQUE (phone)
);

CREATE OR REPLACE TABLE Dishes (
    dishID int(11) AUTO_INCREMENT NOT NULL,
    name varchar(55) NOT NULL,
    description varchar(800),
    ingredient varchar(800),
    price int(11) NOT NULL,
    PRIMARY KEY (dishID),
    UNIQUE (name)
);

CREATE OR REPLACE TABLE Orders (
    orderID int(11) AUTO_INCREMENT NOT NULL,
    delivererID int(11),
    restaurantID int(11),
    customerID int(11) NOT NULL,
    deliveryAddress varchar(155) NOT NULL,
    deliveryStatus tinyint NOT NULL DEFAULT 0,
    deliveryTime datetime,
    specialInstructions varchar(800),
    totalFee int(11) NOT NULL,
    PRIMARY KEY (orderID),
    FOREIGN KEY (delivererID) 
        REFERENCES Deliverers(delivererID)
        ON DELETE SET NULL
        ON UPDATE SET NULL,
    FOREIGN KEY (restaurantID) 
        REFERENCES Restaurants(restaurantID)
        ON DELETE SET NULL
        ON UPDATE SET NULL,
    FOREIGN KEY (customerID) 
        REFERENCES Customers(customerID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Intersection Tables
CREATE OR REPLACE TABLE RestaurantsDishesTable (
    restaurantID int(11) NOT NULL,
    dishID int(11) NOT NULL,
    FOREIGN KEY (restaurantID) 
        REFERENCES Restaurants(restaurantID) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (dishID) 
        REFERENCES Dishes(dishID) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE OR REPLACE TABLE OrdersDishesTable (
    orderID int(11) NOT NULL,
    dishID int(11) NOT NULL,
    FOREIGN KEY (orderID) 
        REFERENCES Orders(orderID) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (dishID) 
        REFERENCES Dishes(dishID) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
----------------------------------------------------------------
-- Insert statements for data
----------------------------------------------------------------

INSERT INTO Restaurants (restaurantName, address, phone, cuisineType, hours)
VALUES 
    ('Rose Garden', '31231 Serenity Way Ave', '342-535-5251', 'Italian Food', '11am - 8pm'),
    ('Cheeseburger Factory', '25346 Shade Street', '144-532-5255', 'American Food', '10am - 8pm'),
    ('Windy Papa', '14597 Emerald Ave', '242-646-7352', 'Fast Food', '24 hours');

INSERT INTO Customers (firstName, lastName, email, phone, address)
VALUES 
    ('Evan', 'Liu', 'evan12345@customer.com', '775-111-2222', NULL),
    ('Shuyao', 'Zeng', 'zengs@customer.com', '553-567-1975', '123 Oregon State Dr'),
    ('Linda', 'Francis', 'lindafree@customer.com', '883-091-1254', '41875 NW Mary Blvd');

INSERT INTO Deliverers (firstName, lastName, email, phone)
VALUES 
    ('Karry', 'Boone', 'kariboom@deliverer.com', '423-904-1125'),
    ('Emily', 'Duke', 'emily2002@deliverer.com', '332-435-4534'),
    ('Peeta', 'West', 'peetaeast@deliverer.com', '596-330-2535');

INSERT INTO Dishes (name, description, ingredient, price)
VALUES 
    ('Buffalo Chicken Wing', 'Chicken wings served with secret buffalo sauce.', 'chicken wings, buffalo sauce', '15'),
    ('Cheeseburger & Fries', 'Cheeseburger served with French fries.', 'bread, beef, cheese, onions, lettuce, mayonnaise, potato', '12'),
    ('Garlic Cheese Bread', 'Loaf served with garlic butter and mozzarella cheese.', 'loaf, garlic butter, mozzarella cheese', '9');

INSERT INTO Orders (delivererID, restaurantID, customerID, deliveryStatus, deliveryAddress, 
deliveryTime, specialInstructions, totalFee)
VALUES 
    (
        (SELECT delivererID from Deliverers WHERE firstName = 'Karry' AND lastName = 'Boone'),
        (SELECT restaurantID from Restaurants WHERE restaurantName = 'Rose Garden' AND phone = '342-535-5251'),
        (SELECT customerID from Customers WHERE firstName = 'Evan' and lastName = 'Liu'),
        '1',
        '2753 EW Rosemary Dr apt 391',
        '2023-08-19',
        'Leave it at the door.',
        '56'
    ),
    (
        (SELECT delivererID from Deliverers WHERE firstName = 'Emily' AND lastName = 'Duke'),
        (SELECT restaurantID from Restaurants WHERE restaurantName = 'Cheeseburger Factory' AND phone = '144-532-5255'),
        (SELECT customerID from Customers WHERE firstName = 'Shuyao' and lastName = 'Zeng'),
        '1',
        '3930 NW Witham Hill Dr apt 168',
        '2024-02-07',
        'Hand it to me please.',
        '33'
    ),
    (
        (SELECT delivererID from Deliverers WHERE firstName = 'Peeta' AND lastName = 'West'),
        (SELECT restaurantID from Restaurants WHERE restaurantName = 'Windy Papa' AND phone = '242-646-7352'),
        (SELECT customerID from Customers WHERE firstName = 'Linda' and lastName = 'Francis'),
        '0',
        '41875 NW Mary Blvd',
        '2024-02-02',
        'Can I have the food in two bags?',
        '28'
    );

INSERT INTO RestaurantsDishesTable (restaurantID, dishID)
VALUES
    (
        (SELECT restaurantID from Restaurants WHERE restaurantName = 'Rose Garden' AND phone = '342-535-5251'),
        (SELECT dishID from Dishes WHERE name = 'Buffalo Chicken Wing' AND price = '15')
    ),
    (
        (SELECT restaurantID from Restaurants WHERE restaurantName = 'Cheeseburger Factory' AND phone = '144-532-5255'),
        (SELECT dishID from Dishes WHERE name = 'Cheeseburger & Fries' AND price = '12')
    ),
    (
        (SELECT restaurantID from Restaurants WHERE restaurantName = 'Windy Papa' AND phone = '242-646-7352'),
        (SELECT dishID from Dishes WHERE name = 'Garlic Cheese Bread' AND price = '9')
    );

INSERT INTO OrdersDishesTable (orderID, dishID)
VALUES
    (
        (SELECT orderID from Orders WHERE deliveryTime = '2023-08-19' AND totalFee = '56'),
        (SELECT dishID from Dishes WHERE name = 'Buffalo Chicken Wing' AND price = '15')
    ),
    (
        (SELECT orderID from Orders WHERE deliveryTime = '2024-02-07' AND totalFee = '33'),
        (SELECT dishID from Dishes WHERE name = 'Cheeseburger & Fries' AND price = '12')
    ),
    (
        (SELECT orderID from Orders WHERE deliveryTime = '2024-02-02' AND totalFee = '28'),
        (SELECT dishID from Dishes WHERE name = 'Garlic Cheese Bread' AND price = '9')
    );


----------------------------------------------------------------
-- Disables commits and foreign key checks.
----------------------------------------------------------------

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
