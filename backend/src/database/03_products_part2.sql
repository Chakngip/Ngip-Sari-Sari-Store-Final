INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Coca Cola 500ml', 'Soft drink', 25.00, 300, 30, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Coca Cola 1.5L', 'Soft drink', 60.00, 200, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Pepsi 500ml', 'Soft drink', 25.00, 300, 30, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Pepsi 1.5L', 'Soft drink', 60.00, 200, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Royal Orange', 'Soda', 25.00, 250, 25, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Sprite 500ml', 'Soda', 25.00, 250, 25, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Mountain Dew', 'Soda', 25.00, 220, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('RC Cola', 'Soda', 20.00, 280, 30, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Mirinda Orange', 'Soda', 25.00, 200, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('7Up', 'Soda', 25.00, 200, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Rootbeer', 'Soda', 25.00, 180, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Sarsi', 'Soda', 22.00, 180, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('C2 + Soda Lemon', 'Mixed drink', 22.00, 160, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Coke Zero', 'Diet soda', 30.00, 180, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW()),
('Pepsi Max', 'Diet soda', 30.00, 180, 20, (SELECT id FROM categories WHERE name='Soda Drinks'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Red Horse Beer 1L', 'Beer', 75.00, 120, 10, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('San Miguel Pale Pilsen', 'Beer', 60.00, 150, 15, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('San Mig Light', 'Beer light', 65.00, 140, 15, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('Emperador Light', 'Brandy', 120.00, 80, 10, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('Emperador Deluxe', 'Brandy', 150.00, 70, 10, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('Fundador Light', 'Brandy', 160.00, 60, 10, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('Tanduay Rum 65', 'Rum', 90.00, 100, 10, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('Tanduay Rhum Dark', 'Rum', 110.00, 90, 10, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('Ginebra San Miguel', 'Gin', 85.00, 120, 10, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW()),
('Gin Bilog', 'Gin', 45.00, 200, 20, (SELECT id FROM categories WHERE name='Adult Beverages'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Piattos Cheese', 'Chips', 18.00, 250, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Nova Multigrain', 'Chips', 18.00, 240, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('V-Cut BBQ', 'Chips', 15.00, 260, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Chippy BBQ', 'Chips', 15.00, 280, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Clover Chips', 'Snack', 10.00, 300, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Oishi Prawn Crackers', 'Snack', 12.00, 260, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Nagaraya Cracker Nuts', 'Peanuts', 20.00, 220, 20, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('SkyFlakes Crackers', 'Biscuits snack', 10.00, 300, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Rebisco Crackers', 'Biscuits snack', 10.00, 300, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Hansel Sandwich', 'Biscuits', 12.00, 280, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Jack n Jill Roller Coaster', 'Snack', 15.00, 240, 25, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Pillows Chocolate', 'Snack', 12.00, 260, 25, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Boy Bawang Cornick', 'Corn snack', 14.00, 270, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Cheetos Cheese', 'Snack', 20.00, 200, 20, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Doritos Nacho Cheese', 'Snack', 25.00, 180, 20, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Lays Classic', 'Chips', 25.00, 180, 20, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Pringles Original', 'Chips', 85.00, 100, 10, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Jack n Jill Piattos BBQ', 'Chips', 18.00, 240, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Oishi Ridges', 'Chips', 18.00, 230, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW()),
('Cloud 9 Chocolate', 'Chocolate snack', 10.00, 300, 30, (SELECT id FROM categories WHERE name='Snacks'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('SkyFlakes 10s', 'Crackers', 10.00, 300, 30, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Rebisco Crackers', 'Crackers', 10.00, 300, 30, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Hansel Chocolate', 'Biscuits', 12.00, 280, 30, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Fita Crackers', 'Biscuits', 10.00, 300, 30, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Marie Biscuits', 'Biscuits', 18.00, 250, 25, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Magic Flakes', 'Crackers', 12.00, 260, 25, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Butter Coconut Biscuits', 'Biscuits', 15.00, 240, 25, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Cream-O Chocolate', 'Biscuits', 20.00, 200, 20, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Choco Mucho', 'Biscuits', 15.00, 220, 20, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Graham Crackers', 'Biscuits', 35.00, 150, 15, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Digestive Biscuits', 'Biscuits', 45.00, 120, 10, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Oreo Original', 'Biscuits', 25.00, 200, 20, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Oreo Double Stuf', 'Biscuits', 30.00, 180, 20, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Jacob Cream Crackers', 'Biscuits', 22.00, 210, 20, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Nissin Wafers', 'Biscuits', 18.00, 230, 25, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Jack n Jill Magic Cream', 'Biscuits', 15.00, 240, 25, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Sunflower Crackers', 'Biscuits', 10.00, 300, 30, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Rebisco Sandwich', 'Biscuits', 12.00, 280, 25, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('SkyFlakes Large', 'Biscuits', 20.00, 200, 20, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW()),
('Magic Flakes Chocolate', 'Biscuits', 15.00, 220, 20, (SELECT id FROM categories WHERE name='Biscuits'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Pandesal Pack 10s', 'Fresh Filipino bread', 25.00, 50, 10, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Tasty Bread White', 'Sliced sandwich bread', 45.00, 40, 10, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Monay Pack', 'Soft local bread', 30.00, 35, 10, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Spanish Bread', 'Sweet filled bread', 40.00, 30, 10, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Ensaymada Classic', 'Buttery ensaymada', 35.00, 25, 8, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Cheese Roll', 'Soft bread with cheese', 38.00, 25, 8, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Egg Pie Slice', 'Sweet egg custard pie', 28.00, 20, 5, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Ube Pandesal', 'Purple yam bread', 32.00, 30, 10, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Hotdog Bun', 'Bread bun for hotdog', 20.00, 45, 10, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Burger Bun Pack', 'Soft burger buns', 50.00, 30, 10, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Garlic Bread', 'Toasted garlic bread', 55.00, 20, 5, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Cheese Bread Loaf', 'Cheesy loaf bread', 60.00, 25, 8, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Donut Classic', 'Sugar coated donut', 18.00, 60, 15, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Brownies Slice', 'Chocolate brownies', 22.00, 40, 10, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW()),
('Cinnamon Roll', 'Sweet cinnamon pastry', 45.00, 20, 5, (SELECT id FROM categories WHERE name='Bread & Bakery'), TRUE, NOW(), NOW());