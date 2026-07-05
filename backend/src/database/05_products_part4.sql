INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Baby Diapers Small', 'Newborn diapers', 120.00, 60, 15, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Diapers Medium', 'Medium size diapers', 130.00, 60, 15, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Diapers Large', 'Large diapers', 140.00, 60, 15, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Wipes', 'Wet wipes', 45.00, 100, 25, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Powder', 'Talc powder', 60.00, 70, 20, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Soap', 'Mild soap', 35.00, 90, 20, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Shampoo', 'Gentle shampoo', 85.00, 60, 15, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Lotion', 'Moisturizer', 90.00, 50, 15, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Bottle', 'Feeding bottle', 120.00, 40, 10, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Food Jar', 'Pureed food', 70.00, 80, 20, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Formula Milk', 'Infant formula', 250.00, 30, 8, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW()),
('Baby Oil Small', 'Baby care oil', 65.00, 70, 20, (SELECT id FROM categories WHERE name='Baby Care'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Dishwashing Liquid', 'Dish soap', 35.00, 120, 30, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Laundry Detergent Powder', 'Washing powder', 120.00, 80, 20, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Bleach Bottle', 'Cleaning bleach', 60.00, 90, 20, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Fabric Conditioner', 'Softener', 110.00, 60, 15, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Floor Cleaner', 'Multi-purpose cleaner', 90.00, 70, 20, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Air Freshener Spray', 'Room spray', 80.00, 60, 15, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Trash Bags', 'Garbage bags', 50.00, 100, 25, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Sponges Pack', 'Kitchen sponge', 30.00, 120, 30, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Broom Stick', 'Cleaning broom', 85.00, 40, 10, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Dustpan Set', 'Cleaning set', 70.00, 50, 15, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Mop Head Refill', 'Mop replacement', 60.00, 60, 15, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Glass Cleaner', 'Window cleaner', 75.00, 60, 15, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Toilet Cleaner', 'Bathroom cleaner', 85.00, 70, 20, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Scrub Brush', 'Cleaning brush', 40.00, 80, 20, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW()),
('Dish Rack', 'Kitchen organizer', 150.00, 30, 8, (SELECT id FROM categories WHERE name='Household Supplies'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Tide Powder 1kg', 'Laundry detergent', 150.00, 60, 15, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Ariel Powder 1kg', 'Laundry detergent', 145.00, 60, 15, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Downy Fabric Softener', 'Clothes softener', 110.00, 70, 20, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Surf Powder', 'Laundry soap', 90.00, 80, 20, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Liquid Detergent', 'Washing liquid', 120.00, 60, 15, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Bleach Concentrate', 'Strong bleach', 65.00, 70, 20, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Laundry Bar Soap', 'Washing soap bar', 30.00, 100, 30, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Stain Remover', 'Clothes stain remover', 95.00, 50, 15, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Clothes Brush', 'Laundry brush', 40.00, 80, 20, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Cloth Hanger Pack', 'Hangers', 60.00, 90, 25, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Laundry Basket', 'Clothes basket', 180.00, 30, 8, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW()),
('Ironing Spray', 'Wrinkle remover', 85.00, 40, 10, (SELECT id FROM categories WHERE name='Laundry'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Dog Food 1kg', 'Dry dog food', 180.00, 50, 15, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Cat Food 1kg', 'Dry cat food', 170.00, 50, 15, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Dog Shampoo', 'Pet shampoo', 120.00, 40, 10, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Cat Litter', 'Sand litter', 150.00, 40, 10, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Pet Snacks', 'Treats', 60.00, 80, 20, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Dog Leash', 'Walking leash', 90.00, 40, 10, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Pet Shampoo Spray', 'Flea control', 140.00, 30, 8, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Dog Collar', 'Collar strap', 70.00, 50, 15, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Fish Food', 'Aquarium food', 50.00, 60, 15, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW()),
('Pet Vitamins', 'Health supplement', 200.00, 30, 8, (SELECT id FROM categories WHERE name='Pet Care'), TRUE, NOW(), NOW());

INSERT INTO products (name, description, price, stock_qty, low_stock_threshold, category_id, is_active, created_at, updated_at)
VALUES
('Ballpen Pack', 'Blue pens', 25.00, 200, 50, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Notebook 80 pages', 'School notebook', 35.00, 150, 40, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Legal Pad', 'Writing pad', 45.00, 100, 30, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Stapler', 'Office stapler', 120.00, 50, 15, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Staples Box', 'Stapler refill', 25.00, 120, 30, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Folder Plastic', 'Document folder', 20.00, 150, 40, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Scissors', 'Office scissors', 60.00, 70, 20, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Glue Stick', 'School glue', 30.00, 100, 30, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Whiteboard Marker', 'Dry erase marker', 35.00, 120, 30, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Bond Paper A4', 'Printing paper', 180.00, 60, 15, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Eraser Pack', 'Rubber eraser', 15.00, 200, 50, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW()),
('Ruler 12 inch', 'Plastic ruler', 20.00, 150, 40, (SELECT id FROM categories WHERE name='School & Office Supplies'), TRUE, NOW(), NOW());