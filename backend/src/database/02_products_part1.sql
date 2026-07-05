INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('NFA Rice 5kg', 'Government rice', 250.00, 100, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Jasmine Rice 5kg', 'Fragrant rice', 320.00, 80, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Sinandomeng Rice 5kg', 'Premium rice', 300.00, 90, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Well-milled Rice 5kg', 'White rice', 270.00, 120, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Dinorado Rice 5kg', 'Premium rice', 340.00, 70, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Brown Rice 1kg', 'Healthy rice', 85.00, 150, 20, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Brown Rice 5kg', 'Healthy rice', 380.00, 60, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Special Rice 25kg', 'Wholesale rice', 1400.00, 40, 5, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Ordinary Rice 1kg', 'Budget rice', 55.00, 200, 20, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Broken Rice 5kg', 'Cheaper rice', 220.00, 100, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Premium Jasmine 10kg', 'High quality rice', 650.00, 50, 5, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Imported Rice 5kg', 'Imported grain', 450.00, 70, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Local White Rice 10kg', 'Local rice', 500.00, 80, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Well-milled Rice 10kg', 'Everyday rice', 520.00, 90, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW()),
('Premium Dinorado 5kg', 'Soft rice', 360.00, 60, 10, (SELECT id FROM categories WHERE name='Rice'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Century Tuna Flakes Oil', 'Tuna', 38.00, 120, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Century Tuna Hot & Spicy', 'Tuna spicy', 39.00, 100, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('555 Sardines Tomato Sauce', 'Sardines', 18.00, 200, 20, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Mega Sardines Chili', 'Sardines spicy', 19.00, 180, 20, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Ligo Sardines', 'Classic sardines', 17.00, 220, 20, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Argentina Corned Beef', 'Beef', 52.00, 110, 15, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Purefoods Corned Beef', 'Beef premium', 58.00, 100, 15, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Libby Vienna Sausage', 'Sausage', 45.00, 80, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Spam Classic', 'Premium meat', 180.00, 40, 5, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Del Monte Corn Cream', 'Corn', 38.00, 90, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Del Monte Pineapple', 'Fruit can', 45.00, 80, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Hunt Tomato Sauce', 'Sauce', 28.00, 100, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Hunt Ketchup', 'Ketchup', 35.00, 90, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('San Marino Corned Tuna', 'Tuna mix', 30.00, 120, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Mega Tuna Flakes', 'Tuna', 32.00, 110, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Argentina Beef Loaf', 'Beef loaf', 35.00, 90, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Purefoods Liver Spread', 'Spread', 42.00, 80, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Maling Luncheon Meat', 'Meat', 70.00, 60, 5, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('Century Tuna Lite', 'Low fat tuna', 40.00, 90, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW()),
('555 Tuna Adobo', 'Tuna flavor', 25.00, 100, 10, (SELECT id FROM categories WHERE name='Canned Goods'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Lucky Me Pancit Canton Original', 'Noodles', 18.50, 200, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Lucky Me Chili Mansi', 'Noodles spicy', 18.50, 180, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Lucky Me Beef', 'Noodles', 17.50, 190, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Nissin Cup Noodles Beef', 'Cup noodles', 22.00, 160, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Nissin Cup Noodles Chicken', 'Cup noodles', 22.00, 150, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Payless Instant Mami Beef', 'Noodles', 12.00, 250, 30, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Payless Chicken', 'Noodles', 12.00, 240, 30, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Lucky Me Chicken', 'Noodles', 17.50, 180, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Quickchow Beef', 'Noodles', 14.00, 200, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Quickchow Chicken', 'Noodles', 14.00, 190, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Mami King Beef', 'Noodles', 13.00, 170, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Mami King Chicken', 'Noodles', 13.00, 160, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Nissin Yakisoba', 'Fried noodles', 25.00, 140, 15, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Lucky Me Spicy Labuyo', 'Spicy noodles', 18.50, 150, 20, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW()),
('Payless Chili Beef', 'Noodles spicy', 12.00, 220, 30, (SELECT id FROM categories WHERE name='Instant Noodles'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Nescafe Classic 100g', 'Coffee', 95.00, 120, 15, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Nescafe Gold', 'Premium coffee', 180.00, 80, 10, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Great Taste White', '3in1 coffee', 7.00, 300, 30, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Great Taste Brown', 'Coffee mix', 8.00, 280, 30, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Kopiko Brown', 'Coffee', 10.00, 260, 30, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Kopiko Blanca', 'Creamy coffee', 10.00, 250, 30, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('San Mig Coffee 3in1', 'Coffee mix', 9.00, 240, 30, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Essenso Coffee', 'Premium mix', 12.00, 180, 20, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('UCC Coffee', 'Instant coffee', 15.00, 160, 20, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Barako Coffee', 'Local coffee', 120.00, 70, 10, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Cafe Puro', 'Classic coffee', 85.00, 110, 15, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Nescafe Stick', 'Single serve', 8.00, 400, 40, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Great Taste Twin Pack', 'Sachet coffee', 14.00, 220, 25, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Kopiko Lucky Day', 'Instant coffee', 11.00, 210, 25, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW()),
('Nescafe Original Roast', 'Strong coffee', 105.00, 90, 10, (SELECT id FROM categories WHERE name='Coffee'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('C2 Green Tea Apple', 'Iced tea drink', 20.00, 200, 20, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('C2 Green Tea Lemon', 'Iced tea drink', 20.00, 200, 20, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Wilkins Pure Water 500ml', 'Bottled water', 15.00, 300, 30, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Absolute Distilled Water', 'Water', 15.00, 280, 30, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Gatorade Blue', 'Sports drink', 45.00, 120, 10, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Gatorade Orange', 'Sports drink', 45.00, 120, 10, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Minute Maid Orange', 'Juice drink', 25.00, 150, 15, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Minute Maid Apple', 'Juice drink', 25.00, 150, 15, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Nature Spring Water 1L', 'Water', 20.00, 250, 25, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Summit Water 500ml', 'Water', 15.00, 300, 30, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Del Monte Pineapple Juice', 'Juice', 35.00, 140, 15, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Zesto Apple', 'Juice drink', 12.00, 260, 25, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Zesto Orange', 'Juice drink', 12.00, 260, 25, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Tropicana Apple', 'Juice', 40.00, 100, 10, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW()),
('Lipton Iced Tea', 'Tea drink', 18.00, 180, 20, (SELECT id FROM categories WHERE name='Beverages'), TRUE, NOW(), NOW());