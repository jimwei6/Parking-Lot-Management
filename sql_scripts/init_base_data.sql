INSERT INTO chargers(plugType) VALUES 
  ('J1772'),
  ('Mennekes'),
  ('GB/T'),
  ('CCS1'),
  ('CHAdeMO');

INSERT INTO location(postalCode, city, province) VALUES 
  ('V6T1Z4', 'Vancouver', 'BC'),
  ('V6T1Z2', 'Vancouver', 'BC'), 
  ('V6T2A1', 'Vancouver', 'BC'), 
  ('V6T1Z3', 'Vancouver', 'BC'), 
  ('V6T1Z1', 'Vancouver', 'BC'); 

INSERT INTO manufacturer(manufacturerID, name, address) VALUES
  (1, 'Tesla Motors', '13101 Tesla Rd, Austin, TX 78725, USA'),
  (2, 'Volkswagen Group', 'Berliner Ring 2, 38440 Wolfsburg, Germany'),
  (3, 'Toyota Motor Corporation', 'Toyota-Cho, Toyota City, Aichi Prefecture 471-8571, Japan'),
  (4, 'Ford Motor Company', '1 American Road Dearborn, MI 48126 United States'),
  (5, 'BMW', 'Petuelring 130, Munich, Germany'); 

INSERT INTO model(modelName, manufacturerID) VALUES
  ('Model 3', 1),
  ('Model X', 1),
  ('Model Y', 1),
  ('Model S', 1),
  ('Atlas', 2),
  ('Taos', 2),
  ('ID.4', 2),
  ('Jetta', 2),
  ('Prius Prime', 3),
  ('GR86', 3),
  ('Tundra', 3),
  ('Sienna', 3),
  ('Mustang', 4),
  ('Shelby', 4),
  ('Escape', 4),
  ('F-150', 4),
  ('iX', 4),
  ('X3', 4),
  ('8 Series Gran Coupé', 4),
  ('M5 Competition', 4);

INSERT INTO parkingLots(lotID, capacity, postalCode, heightLimit) VALUES
  (1, 50, 'V6T1Z4', NULL),
  (2, 50, 'V6T1Z2', NULL),
  (3, 25, 'V6T2A1', NULL),
  (4, 25, 'V6T1Z3', NULL),
  (5, 50, 'V6T1Z1', NULL); 


-- parking lot: (1) 1-50, (2) 1 - 50, (3) 1 - 25, (4) 1 - 25, (5) 1 - 50.
INSERT INTO parkingSpots(spotID, lotID, availableTime, spotType, height) VALUES 
  (1, 1, 7200, 'normal', NULL), (2, 1, 7200, 'normal', NULL), (3, 1, 7200, 'normal', NULL), (4, 1, 7200, 'normal', NULL), (5, 1, 7200, 'normal', NULL), -- p1
  (6, 1, 7200, 'normal', NULL), (7, 1, 7200, 'normal', NULL), (8, 1, 7200, 'normal', NULL), (9, 1, 7200, 'normal', NULL), (10, 1, 7200, 'normal', NULL),
  (11, 1, 7200, 'normal', NULL), (12, 1, 7200, 'normal', NULL), (13, 1, 3600, 'normal', NULL), (14, 1, 3600, 'normal', NULL), (15, 1, 3600, 'normal', NULL),
  (16, 1, 3600, 'normal', NULL), (17, 1, 1600, 'normal', NULL), (18, 1, 3600, 'normal', NULL), (19, 1, 3600, 'normal', NULL), (20, 1, 7200, 'normal', NULL),
  (21, 1, 7200, 'vip', NULL), (22, 1, 7200, 'vip', NULL), (23, 1, 7200, 'vip', NULL), (24, 1, 3600, 'vip', NULL), (25, 1, 3600, 'vip', NULL),
  (26, 1, 7200, 'vip', NULL), (27, 1, 7200, 'vip', NULL), (28, 1, 7200, 'vip', NULL), (29, 1, 3600, 'vip', NULL), (30, 1, 7200, 'vip', NULL),
  (31, 1, 28800, 'company', NULL), (32, 1, 28800, 'company', NULL), (33, 1, 28800, 'company', NULL), (34, 1, 28800, 'company', NULL), (35, 1, 28800, 'company', NULL),
  (36, 1, 28800, 'company', NULL), (37, 1, 28800, 'company', NULL), (38, 1, 28800, 'company', NULL), (39, 1, 28800, 'company', NULL), (40, 1, 28800, 'company', NULL),
  (41, 1, 7200, 'reserved', NULL), (42, 1, 1600, 'reserved', NULL), (43, 1, 3600, 'reserved', NULL), (44, 1, 3600, 'reserved', NULL), (45, 1, 3600, 'reserved', NULL),
  (46, 1, 3600, 'reserved', NULL), (47, 1, 3600, 'reserved', NULL), (48, 1, 3600, 'reserved', NULL), (49, 1, 3600, 'reserved', NULL), (50, 1, 3600, 'reserved', NULL),
  (1, 2, 3600, 'normal', NULL), (2, 2, 3600, 'normal', NULL), (3, 2, 3600, 'normal', NULL), (4, 2, 3600, 'normal', NULL), (5, 2, 3600, 'normal', NULL), -- p2
  (6, 2, 3600, 'normal', NULL), (7, 2, 3600, 'normal', NULL), (8, 2, 3600, 'normal', NULL), (9, 2, 3600, 'normal', NULL), (10, 2, 3600, 'normal', NULL),
  (11, 2, 3600, 'normal', NULL), (12, 2, 3600, 'normal', NULL), (13, 2, 3600, 'normal', NULL), (14, 2, 3600, 'normal', NULL), (15, 2, 3600, 'normal', NULL),
  (16, 2, 3600, 'normal', NULL), (17, 2, 3600, 'normal', NULL), (18, 2, 3600, 'normal', NULL), (19, 2, 3600, 'normal', NULL), (20, 2, 3600, 'normal', NULL), 
  (21, 2, 3600, 'reserved', NULL), (22, 2, 3600, 'reserved', NULL), (23, 2, 3600, 'reserved', NULL), (24, 2, 10800, 'reserved', NULL), (25, 2, 3600, 'reserved', NULL),
  (26, 2, 3600, 'reserved', NULL), (27, 2, 3600, 'reserved', NULL), (28, 2, 3600, 'reserved', NULL), (29, 2, 10800, 'reserved', NULL), (30, 2, 3600, 'reserved', NULL),
  (31, 2, 3600, 'reserved', NULL), (32, 2, 3600, 'reserved', NULL), (33, 2, 3600, 'reserved', NULL), (34, 2, 10800, 'reserved', NULL), (35, 2, 3600, 'reserved', NULL),
  (36, 2, 3600, 'reserved', NULL), (37, 2, 3600, 'reserved', NULL), (38, 2, 3600, 'reserved', NULL), (39, 2, 10800, 'reserved', NULL), (40, 2, 3600, 'reserved', NULL),
  (41, 2, 10800, 'vip', NULL), (42, 2, 10800, 'vip', NULL), (43, 2, 10800, 'vip', NULL), (44, 2, 3600, 'vip', NULL), (45, 2, 3600, 'vip', NULL),
  (46, 2, 10800, 'vip', NULL), (47, 2, 10800, 'vip', NULL), (48, 2, 10800, 'vip', NULL), (49, 2, 3600, 'vip', NULL), (50, 2, 3600, 'vip', NULL), 
  (1, 3, 3600, 'normal', NULL), (2, 3, 3600, 'normal', NULL), (3, 3, 3600, 'normal', NULL), (4, 3, 3600, 'normal', NULL), (5, 3, 3600, 'normal', NULL), -- p3
  (6, 3, 3600, 'normal', NULL), (7, 3, 3600, 'normal', NULL), (8, 3, 3600, 'normal', NULL), (9, 3, 3600, 'normal', NULL), (10, 3, 3600, 'normal', NULL),
  (11, 3, 3600, 'reserved', NULL), (12, 3, 3600, 'reserved', NULL), (13, 3, 3600, 'reserved', NULL), (14, 3, 3600, 'reserved', NULL), (15, 3, 3600, 'reserved', NULL),
  (16, 3, 3600, 'vip', NULL), (17, 3, 3600, 'vip', NULL), (18, 3, 3600, 'vip', NULL), (19, 3, 3600, 'vip', NULL), (20, 3, 3600, 'vip', NULL),
  (21, 3, 28800, 'company', NULL), (22, 3, 28800, 'company', NULL), (23, 3, 28800, 'company', NULL), (24, 3, 28800, 'company', NULL), (25, 3, 28800, 'company', NULL),
  (1, 4, 3600, 'normal', NULL), (2, 4, 3600, 'normal', NULL), (3, 4, 3600, 'normal', NULL), (4, 4, 3600, 'normal', NULL), (5, 4, 10800, 'normal', NULL), -- p4
  (6, 4, 3600, 'normal', NULL), (7, 4, 3600, 'normal', NULL), (8, 4, 3600, 'normal', NULL), (9, 4, 3600, 'normal', NULL), (10, 4, 10800, 'normal', NULL),
  (11, 4, 3600, 'normal', NULL), (12, 4, 3600, 'normal', NULL), (13, 4, 3600, 'normal', NULL), (14, 4, 3600, 'normal', NULL), (15, 4, 10800, 'normal', NULL),
  (16, 4, 3600, 'normal', NULL), (17, 4, 3600, 'normal', NULL), (18, 4, 3600, 'normal', NULL), (19, 4, 3600, 'normal', NULL), (20, 4, 3600, 'normal', NULL),
  (21, 4, 3600, 'reserved', NULL), (22, 4, 3600, 'reserved', NULL), (23, 4, 3600, 'reserved', NULL), (24, 4, 3600, 'reserved', NULL), (25, 4, 3600, 'reserved', NULL),
  (1, 5, 7200, 'normal', NULL), (2, 5, 7200, 'normal', NULL), (3, 5, 7200, 'normal', NULL), (4, 5, 7200, 'normal', NULL), (5, 5, 7200, 'normal', NULL), -- p5
  (6, 5, 7200, 'normal', NULL), (7, 5, 7200, 'normal', NULL), (8, 5, 7200, 'normal', NULL), (9, 5, 7200, 'normal', NULL), (10, 5, 7200, 'normal', NULL),
  (11, 5, 3600, 'normal', NULL), (12, 5, 3600, 'normal', NULL), (13, 5, 3600, 'normal', NULL), (14, 5, 3600, 'normal', NULL), (15, 5, 10800, 'normal', NULL),
  (16, 5, 3600, 'normal', NULL), (17, 5, 3600, 'normal', NULL), (18, 5, 3600, 'normal', NULL), (19, 5, 3600, 'normal', NULL), (20, 5, 3600, 'normal', NULL),
  (21, 5, 3600, 'vip', NULL), (22, 5, 3600, 'vip', NULL), (23, 5, 3600, 'vip', NULL), (24, 5, 3600, 'vip', NULL), (25, 5, 3600, 'vip', NULL),
  (26, 5, 3600, 'vip', NULL), (27, 5, 3600, 'vip', NULL), (28, 5, 3600, 'vip', NULL), (29, 5, 3600, 'vip', NULL), (30, 5, 7200, 'vip', NULL),
  (31, 5, 28800, 'company', NULL), (32, 5, 28800, 'company', NULL), (33, 5, 28800, 'company', NULL), (34, 5, 28800, 'company', NULL), (35, 5, 28800, 'company', NULL),
  (36, 5, 28800, 'company', NULL), (37, 5, 28800, 'company', NULL), (38, 5, 28800, 'company', NULL), (39, 5, 28800, 'company', NULL), (40, 5, 28800, 'company', NULL),
  (41, 5, 7200, 'reserved', NULL), (42, 5, 3600, 'reserved', NULL), (43, 5, 3600, 'reserved', NULL), (44, 5, 3600, 'reserved', NULL), (45, 5, 3600, 'reserved', NULL),
  (46, 5, 3600, 'reserved', NULL), (47, 5, 3600, 'reserved', NULL), (48,  5,3600, 'reserved', NULL), (49, 5, 3600, 'reserved', NULL), (50, 5, 3600, 'reserved', NULL);


INSERT INTO electricSpots(spotID, lotID, plugType) VALUES
  (1, 1, 'J1772'), (2, 1, 'J1772'), (3, 1, 'J1772'), (4, 1, 'J1772'), (5, 1, 'J1772'), -- p1
  (6, 1, 'CHAdeMO'), (7, 1, 'CCS1'), (8, 1, 'GB/T'), (9, 1, 'Mennekes'), (10, 1, 'Mennekes'),
  (20, 1, 'J1772'), (21, 1, 'J1772'), (30, 1, 'J1772'), (31, 1, 'J1772'), (40, 1, 'J1772'),
  (1, 2, 'J1772'), (2, 2, 'J1772'), (3, 2, 'J1772'), (4, 2, 'J1772'), (5, 2, 'J1772'), -- p2
  (6, 2, 'CHAdeMO'), (7, 2, 'CCS1'), (8, 2, 'GB/T'), (9, 2, 'Mennekes'), (10, 2, 'Mennekes'),
  (11, 2, 'J1772'), (12, 2, 'J1772'), (13, 2, 'J1772'), (14, 2, 'J1772'), (15, 2, 'J1772'),
  (20, 2, 'J1772'), (21, 2, 'J1772'), (30, 2, 'J1772'), (31, 2, 'J1772'), (40, 2, 'J1772'),
  (1, 3, 'J1772'), (2, 3, 'J1772'), (3, 3, 'J1772'), (4, 3, 'J1772'), (5, 3, 'CHAdeMO'), -- p3
  (1, 4, 'J1772'), (2, 4, 'J1772'), (3, 4, 'J1772'), (4, 4, 'J1772'), (5, 4, 'CHAdeMO'), -- p4
  (1, 5, 'J1772'), (2, 5, 'J1772'), (3, 5, 'J1772'), (4, 5, 'J1772'), (5, 5, 'J1772'), -- p5
  (6, 5, 'CHAdeMO'), (7, 5, 'CCS1'), (8, 5, 'GB/T'), (9, 5, 'Mennekes'), (10, 5, 'Mennekes'),
  (20, 5, 'J1772'), (21, 5, 'J1772'), (30, 5, 'J1772'), (31, 5, 'J1772'), (40, 5, 'J1772');

INSERT INTO accessibilitySpots(spotID, lotID, accessibilityType) VALUES 
  (11, 1, 'infant'), (12, 1, 'infant'), (13, 1, 'accessibility'), (14, 1, 'accessibility'), (15, 1, 'accessibility'), -- p1
  (16, 2, 'infant'), (17, 2, 'accessibility'), (18, 2, 'accessibility'), (19, 2, 'accessibility'), (22, 2, 'accessibility'), -- p2
  (6, 3, 'accessibility'), (7, 3, 'accessibility'), -- p3
  (6, 4, 'accessibility'), (7, 4, 'infant'), -- p4
  (11, 5, 'infant'), (12, 5, 'infant'), (13, 5, 'accessibility'), (14, 5, 'accessibility'), (15, 5, 'accessibility'), -- p5
  (16, 5, 'infant'), (17, 5, 'accessibility'), (18, 5, 'accessibility'), (19, 5, 'accessibility'), (22, 5, 'accessibility');

  
  