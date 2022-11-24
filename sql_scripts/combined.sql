DROP TABLE IF EXISTS permits CASCADE;
DROP TABLE IF EXISTS parkingActivities CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS parkingSessions CASCADE;
DROP TABLE IF EXISTS electricVehicle CASCADE; 
DROP TABLE IF EXISTS vehicle CASCADE; 
DROP TABLE IF EXISTS electricSpots CASCADE;
DROP TABLE IF EXISTS accessibilitySpots CASCADE;
DROP TABLE IF EXISTS parkingSpots CASCADE;
DROP TABLE IF EXISTS parkingLots CASCADE; 
DROP TABLE IF EXISTS personalDetails CASCADE; 
DROP TABLE IF EXISTS vehicleOwner CASCADE; 
DROP TABLE IF EXISTS model CASCADE; 
DROP TABLE IF EXISTS permitType CASCADE; 
DROP TABLE IF EXISTS manufacturer CASCADE;
DROP TABLE IF EXISTS accounts CASCADE; 
DROP TABLE IF EXISTS chargers CASCADE; 
DROP TABLE IF EXISTS location CASCADE;

CREATE TABLE location (
	postalCode varchar(6) PRIMARY KEY,
	city varchar(256) NOT NULL,
	province varchar(256) NOT NULL
);

CREATE TABLE chargers (
	plugType varchar(50) PRIMARY KEY -- J1772, Mennekes, GB/T, CCS1, CHAdeMO
);

CREATE TABLE accounts (
	username varchar(100) PRIMARY KEY,
	password varchar(100) NOT NULL,
	email varchar(100) NOT NULL UNIQUE
);

CREATE TABLE manufacturer (
	manufacturerID int PRIMARY KEY,
	name varchar(100) NOT NULL UNIQUE,
	address varchar(100) NOT NULL 
);

CREATE TABLE permitType (
    title varchar(50) PRIMARY KEY -- vip, company, reserved, infant, accessibility
);

CREATE TABLE vehicleOwner (
	ownerID int PRIMARY KEY,
	username varchar(100) NOT NULL,
	address varchar(100) NOT NULL,
	name varchar(100) NOT NULL,
	FOREIGN KEY (username) REFERENCES accounts(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE personalDetails (
	ownerID int PRIMARY KEY,
	phoneNumber varchar(20),
	pronouns varchar(100) NOT NULL DEFAULT 'They/Them/Theirs', -- He/Him/His, She/Her/Hers, They/Them/Theirs
	gender varchar(50) NOT NULL DEFAULT 'Other', -- Male, Female, Non-Binary, Other
	dob DATE NOT NULL,
	FOREIGN KEY (ownerID) REFERENCES vehicleOwner(ownerID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE model (
	modelName varchar PRIMARY KEY,
	manufacturerID int NOT NULL,
	FOREIGN KEY (manufacturerID) REFERENCES manufacturer ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE parkingLots (
    lotID int PRIMARY KEY,
    capacity int NOT NULL DEFAULT 10,
    postalCode varchar(6) NOT NULL,
    heightLimit int,
    FOREIGN KEY (postalCode) REFERENCES location(postalCode) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE parkingSpots (
	spotID int,
	lotID int,
	availableTime int NOT NULL DEFAULT 3600,
	spotType varchar(100) NOT NULL DEFAULT 'normal', -- normal, vip, company, reserved
	height int,
	PRIMARY KEY (spotID, lotID),
	FOREIGN KEY (lotID) REFERENCES parkingLots(lotID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE accessibilitySpots (
	spotID int,
    lotID int,
	accessibilityType varchar(100) NOT NULL DEFAULT 'accessibility', -- infant, accessibility 
    PRIMARY KEY (spotID, lotID),
	FOREIGN KEY (spotID, lotID) REFERENCES parkingSpots(spotID, lotID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE electricSpots (
	spotID int,
    lotID int,
	plugType varchar(50) NOT NULL DEFAULT 'J1772',
    PRIMARY KEY (spotID, lotID),
	FOREIGN KEY (spotID, lotID) REFERENCES parkingSpots(spotID, lotID) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (plugType) REFERENCES chargers ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE vehicle (
	licensePlate varchar(10) PRIMARY KEY,
	modelName varchar NOT NULL,
	ownerID int NOT NULL,
	height int NOT NULL,
	color varchar(6) NOT NULL DEFAULT '000000', -- Black
	FOREIGN KEY (modelName) REFERENCES model(modelName) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (ownerID) REFERENCES vehicleOwner(ownerID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE electricVehicle (
	licensePlate varchar(10) PRIMARY KEY,
	plugType varchar(50) NOT NULL,
    FOREIGN KEY (licensePlate) REFERENCES vehicle(licensePlate) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (plugType) REFERENCES chargers(plugType) ON DELETE CASCADE  ON UPDATE CASCADE
);

CREATE TABLE parkingSessions (
	sessionID SERIAL PRIMARY KEY,
	licensePlate varchar(10) NOT NULL,
	spotID int NOT NULL,
	lotID int NOT NULL,
	allottedTime int NOT NULL, 
	isActive bool NOT NULL DEFAULT FALSE,
	startTime TIMESTAMP WITH TIME ZONE NOT NULL,
	isCharging bool NOT NULL DEFAULT FALSE,
	FOREIGN KEY (licensePlate) REFERENCES vehicle ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (spotID, lotID) REFERENCES parkingSpots(spotID, lotID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tickets (
    ticketNumber SERIAL PRIMARY KEY,
    cost int NOT NULL DEFAULT 10,
    paid bool NOT NULL DEFAULT FALSE,
    details varchar,
    sessionId int,
    FOREIGN KEY (sessionId) REFERENCES parkingSessions ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE parkingActivities (
	timeStamp TIMESTAMP WITH TIME ZONE,
	licensePlate varchar(10) NOT NULL,
	spotID int NOT NULL,
	lotID int NOT NULL,
	activityType varchar(50) NOT NULL, -- 'in', 'out'
    PRIMARY KEY (timeStamp, spotID, lotID),
	FOREIGN KEY (licensePlate) REFERENCES vehicle ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (spotID, lotID) REFERENCES parkingSpots(spotID, lotID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE permits (
	licensePlate varchar(10),
	permitType varchar(50) NOT NULL,
	PRIMARY KEY (licensePlate, permitType),
    FOREIGN KEY (licensePlate) REFERENCES vehicle(licensePlate) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (permitType) REFERENCES permitType(title) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO permitType(title) VALUES
    ('vip'),
    ('company'),
    ('reserved'),
    ('infant'),
    ('accessibility');

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

INSERT INTO accounts(username, password, email) VALUES
    ('jim', 'jim', 'nash_krajcik@gmail.com'), -- jim
    ('asad', 'asad', 'joannie.bernhard69@hotmail.com'), -- asad
    ('richard', 'richard', 'cristal7@hotmail.com'), -- richard
    ('cohelm', 'ruperost', 'duncan.ratke95@gmail.com'),
    ('flyjean', 'ateudotr', 'alessandro.bernier@yahoo.com'),
    ('henrymb', 'tionat', 'emmet11@gmail.com'),
    ('kreater', 'olemeter', 'lauriane.blick@gmail.com'),
    ('mongodw', 'lowere', 'lia96@yahoo.com'),
    ('peritai', 'nteo', 'olaf_bartell95@yahoo.com'),
    ('quovati', 'itidis', 'emmanuelle10@hotmail.com'),
    ('bellog', 'gthumpt', 'lorenza.heathcote@yahoo.com'),
    ('blesta', 'oclishunutc', 'oswald46@gmail.com'),
    ('clemati', 'y5623vruhhu', 'linnie78@gmail.com'),
    ('dayspice', 'u2n77jj2zf', 'june40@yahoo.com'),
    ('instanton', '6t46yfdk8q76r', 'vena_ullrich82@hotmail.com'),
    ('ofbene', '578apple', 'green.wilkinson@yahoo.com'),
    ('prodigyle', 'titishy', 'daisha_prohaska28@hotmail.com'),
    ('simonfreak', '9r83yzb', 'kenyatta1@hotmail.com'),
    ('monser', 'twisomedynapa', 'kory_brakus@yahoo.com'),
    ('prankia', 'fc5p2d856n', 'mable.huel13@gmail.com');

INSERT INTO vehicleOwner(ownerID, username, address, name) VALUES
    (1, 'jim', '1567 Hastings St, Vancouver BC V6C 1B4 Canada', 'Nash Krajcik'),
    (2, 'asad', '4737 Cordova St, Vancouver BC V6B 1E1 Canada', 'Joannie Bernhard'),
    (3, 'richard', '3622 Cardero St, Vancouver BC S4P 3Y2 Canada', 'Cristal Fung'),
    (4, 'cohelm', '3002 Cordova St, Vancouver BC V6B 1E1 Canada', 'Duncan Ratke'),
    (5, 'flyjean', '978 St George St, Vancouver BC V5T 1Z7 Canada', 'Alessandro Bernier'),
    (6, 'henrymb', '122 Keith Road, North Vancouver BC V5T 2C1 Canada', 'Emmet Stone'),
    (7, 'kreater', '3256 Robson St, Vancouver BC V6B 3K9 Canada', 'Lauriane Blick'),
    (8, 'mongodw', '4421 Cardero St, Vancouver BC S4P 3Y2 Canada', 'Lia Kim'),
    (9, 'peritai', '4770  Hastings St, Vancouver BC V6C 1B4 Canada', 'Olaf Bartell'),
    (10, 'quovati', '3627 Hastings St, Vancouver BC V6C 1B4 Canada', 'Emmanuelle Nguyen'),
    (11, 'bellog', '1814 Robson St, Vancouver BC V6B 3K9 Canada', 'Lorenza Heathcote'),
    (12, 'blesta', '3155 Tolmie St, Vancouver BC V6A 4E6 Canada', 'Oswald Son'),
    (13, 'clemati', '3922 Tanner St, Vancouver BC V5R 2T4 Canada', 'Linnie Lang'),
    (14, 'dayspice', '2054 Keith Road, North Vancouver BC V5T 2C1 Canada', 'June Faye'),
    (15, 'instanton', '3812 James St, Vancouver BC V5W 3C3 Canada', 'Vena Ullrich'),
    (16, 'ofbene', '1144 St George Street, Vancouver BC V5T 1Z7 Canada', 'Green Wilkinson'),
    (17, 'prodigyle', '4308 Keith Road, North Vancouver BC V5T 2C1 Canada', 'Daisha Prohaska'),
    (18, 'simonfreak', '2797 James St, Vancouver BC V5W 3C3 Canada', 'Kenyatta Knight'),
    (19, 'monser', '1574 Jade St, West Vancouver BC V7V 1Y8 Canada', 'Kory Brakus'),
    (20, 'prankia', '3536 Cardero St, Vancouver BC S4P 3Y2 Canada', 'Mable Huel');

-- dob: YYYY-MM-DD
INSERT INTO personalDetails(ownerID, phoneNumber, pronouns, gender, dob) VALUES
    (1, '604-339-4819', 'He/Him/His', 'Male', '2004-08-20'),
    (2, '778-998-0756', 'She/Her/Hers', 'Female', '1969-02-23'),
    (3, '604-684-1519', 'They/Them/Theirs', 'Non-Binary', '1977-05-02'),
    (4, '604-418-1518', 'He/Him/His', 'Male', '1980-06-14'),
    (5, '604-707-3783', 'She/Her/Hers', 'Female', '2001-02-07'),
    (6, '604-904-2212', 'They/Them/Theirs', 'Other', '1987-12-10'),
    (7, '604-837-2507', 'She/Her/Hers', 'Female', '1973-11-15'),
    (8, '604-696-1931', 'They/Them/Theirs', 'Non-Binary', '2003-06-22'),
    (9, '604-721-2960', 'He/Him/His', 'Male', '1992-01-11'),
    (10, '604-618-3150', 'He/Him/His', 'Male', '1978-05-25'),
    (11, '604-331-3096', 'She/Her/Hers', 'Female', '1981-09-20'),
    (12, '604-677-5911', 'He/Him/His', 'Male', '1970-08-22'),
    (13, '604-319-3438', 'She/Her/Hers', 'Female', '2000-12-25'),
    (14, '604-903-5346', 'She/Her/Hers', 'Female', '1995-06-25'),
    (15, '604-341-9314', 'She/Her/Hers', 'Female', '1976-04-21'),
    (16, '604-877-3085', 'He/Him/His', 'Male', '1979-09-10'),
    (17, '604-986-6573', 'She/Her/Hers', 'Female', '1999-12-16'),
    (18, '604-329-9002', 'He/Him/His', 'Male', '1984-05-25'),
    (19, '604-923-1466', 'He/Him/His', 'Male', '1966-10-05'),
    (20, '604-696-4478', 'They/Them/Theirs', 'Other', '1994-11-27');

-- height: mm, color: hex
INSERT INTO vehicle(licensePlate, modelName, ownerID, height, color) VALUES -- -- vip, company, reserved, infant, accessibility
    ('CF346E', 'Model 3', 1, 1443, 'FF0000'), -- permits: vip, company, reserved
    ('CF346B', 'Model 3', 2, 1443, 'FF0000'), -- permits: vip, company, reserved
    ('CF346C', 'Model 3', 3, 1443, 'FF0000'), -- permits: vip, company, reserved
    ('CA762X', 'Model X', 2, 1684, 'FFFFFF'),
    ('DE310T', 'Model Y', 3, 1624, '000000'),
    ('XNK656', 'Model S', 4, 1445, '0000FF'), -- permits: company
    ('KD978P', 'Atlas', 5, 1780, '808080'), -- permits: reserved, accessibility
    ('896REN', 'Taos', 6, 1654, '00FF00'), -- permits: infant, reserved
    ('706SGL', 'ID.4', 7, 1654, 'C0C0C0'),
    ('GDM839', 'Jetta', 8, 1471, 'FF0000'), -- permits: accessibility, vip, infant, company
    ('DPU597', 'Prius Prime', 9, 1473, 'FFFFFF'),
    ('985HDE', 'GR86', 10, 1310, '000000'), -- permits: vip
    ('DHR427', 'Tundra', 11, 1984, '0000FF'), -- permits: reserved
    ('245AFC', 'Sienna', 12, 1776, '808080'),
    ('144PKF', 'Mustang', 13, 1394, '00FF00'), -- permits: vip, accessibility, reserved, infant, company
    ('645RTM', 'Shelby', 14, 1384, 'C0C0C0'), -- permits: accessibility
    ('589WGN', 'Escape', 15, 1679, 'FF0000'), -- permits: company, infant
    ('CD7172', 'F-150', 16, 2026, 'FFFFFF'), -- permits: infant
    ('MBG091', 'iX', 17, 1696, '000000'),
    ('229KBX', 'X3', 18, 1676, '0000FF'),
    ('VVF388', '8 Series Gran Coupé', 19, 1407, '808080'),
    ('BH909R', 'M5 Competition', 20, 1473, '00FF00'); -- permits: reserved, vip

-- plugType: J1772 (Type 1), Mennekes (Type 2), GB/T, CCS1, CHAdeMO
INSERT INTO electricVehicle(licensePlate, plugType) VALUES
    ('CF346E', 'J1772'),
    ('CA762X', 'J1772'),
    ('DE310T', 'J1772'),
    ('XNK656', 'J1772'),
    ('706SGL', 'Mennekes'),
    ('DPU597', 'Mennekes'),
    ('MBG091', 'Mennekes');

-- sessionID: serial (automatically increments)
INSERT INTO parkingSessions(licensePlate, spotID, lotID, allottedTime, isActive, startTime, isCharging) VALUES
    ('CF346E', 21, 1, 7200, FALSE, '2022-11-01 06:29:10-08', FALSE), -- electric, vip
    ('CF346E', 21, 1, 7200, FALSE, '2022-11-11 06:29:10-08', FALSE), -- electric, vip
    ('CF346E', 21, 1, 7200, FALSE, '2022-11-22 06:29:10-08', FALSE), -- electric, vip
    ('CF346E', 21, 1, 7200, FALSE, '2022-11-21 06:29:10-08', FALSE), -- electric, vip
    ('CA762X', 2, 1, 7200, FALSE, '2022-11-01 07:05:35-08', FALSE), -- electric, normal
    ('CA762X', 2, 1, 7200, FALSE, '2022-11-05 07:05:35-08', FALSE), -- electric, normal
    ('CA762X', 2, 1, 7200, FALSE, '2022-11-10 07:05:35-08', FALSE), -- electric, normal
    ('CA762X', 2, 1, 7200, FALSE, '2022-11-22 07:05:35-08', FALSE), -- electric, normal
    ('DE310T', 5, 1, 7200, FALSE, '2022-11-01 09:19:05-08', FALSE), -- electric, normal
    ('DE310T', 1, 1, 3600, FALSE, '2022-11-02 09:19:05-08', FALSE), -- electric, normal
    ('DE310T', 1, 2, 3600, FALSE, '2022-11-03 09:19:05-08', FALSE), -- electric, normal
    ('DE310T', 1, 3, 3600, FALSE, '2022-11-04 09:19:05-08', FALSE), -- electric, normal
    ('DE310T', 1, 4, 3600, FALSE, '2022-11-05 09:19:05-08', FALSE), -- electric, normal
    ('DE310T', 1, 5, 3600, FALSE, '2022-11-06 09:19:05-08', FALSE), -- electric, normal
    ('XNK656', 31, 1, 28800, FALSE, '2022-11-01 10:01:09-08', FALSE), -- electric, company
    ('XNK656', 31, 1, 28800, FALSE, '2022-11-04 10:01:09-08', FALSE), -- electric, company
    ('XNK656', 31, 1, 28800, FALSE, '2022-11-06 10:01:09-08', FALSE), -- electric, company
    ('KD978P', 46, 1, 3600, FALSE, '2022-11-01 15:30:03-08', FALSE), -- reserved
    ('896REN', 16, 2, 3600, FALSE, '2022-11-02 05:59:48-08', FALSE), -- infant, normal
    ('706SGL', 9, 2, 3600, FALSE, '2022-11-02 07:23:36-08', FALSE), -- electric, normal
    ('GDM839', 17, 2, 3600, FALSE, '2022-11-02 09:10:38-08', FALSE), -- accessibility, normal
    ('DPU597', 10, 2, 3600, FALSE, '2022-11-02 12:31:07-08', FALSE), -- electric, normal
    ('985HDE', 48, 2, 10800, FALSE, '2022-11-02 18:45:49-08', FALSE), -- vip
    ('DHR427', 11, 3, 3600, FALSE, '2022-11-03 10:00:15-08', FALSE), -- reserved
    ('245AFC', 8, 3, 3600, FALSE, '2022-11-03 10:05:39-08', FALSE), -- normal
    ('144PKF', 17, 3, 3600, FALSE, '2022-11-03 10:06:08-08', FALSE), -- vip
    ('645RTM', 6, 3, 3600, FALSE, '2022-11-03 10:27:19-08', FALSE), -- accessibility, normal
    ('589WGN', 31, 5, 28800, FALSE, '2022-11-04 14:39:00-08', FALSE), -- company
    ('CD7172', 12, 1, 7200, FALSE, '2022-11-04 16:18:49-08', FALSE), -- infant, normal
    ('MBG091', 10, 2, 3600, FALSE, '2022-11-04 18:07:58-08', FALSE), -- electric, normal
    ('229KBX', 16, 1, 3600, FALSE, '2022-11-05 11:05:28-08', FALSE), -- normal
    ('VVF388', 10, 4, 10800, FALSE, '2022-11-05 11:27:01-08', FALSE), -- normal
    ('BH909R', 25, 4, 3600, FALSE, '2022-11-05 12:00:49-08', FALSE), -- reserved
    ('BH909R', 25, 4, 3600, FALSE, '2022-11-06 12:00:49-08', FALSE), -- reserved
    ('BH909R', 25, 4, 3600, FALSE, '2022-11-07 12:00:49-08', FALSE), -- reserved
    ('BH909R', 25, 4, 3600, FALSE, '2022-11-08 12:00:49-08', FALSE), -- reserved
    ('BH909R', 25, 4, 3600, FALSE, '2022-11-09 12:00:49-08', FALSE); -- reserved

-- ticketNumber: serial (automatically increments), cost: 50 (default?)
INSERT INTO tickets(cost, paid, details, sessionId) VALUES
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-01 07:05:35-08' AND licensePlate = 'CA762X')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-05 07:05:35-08' AND licensePlate = 'CA762X')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-10 07:05:35-08' AND licensePlate = 'CA762X')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-22 07:05:35-08' AND licensePlate = 'CA762X')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-01 10:01:09-08' AND licensePlate = 'XNK656')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-04 10:01:09-08' AND licensePlate = 'XNK656')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-06 10:01:09-08' AND licensePlate = 'XNK656')),
    (50, FALSE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-02 05:59:48-08' AND licensePlate = '896REN')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-02 09:10:38-08' AND licensePlate = 'GDM839')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-02 12:31:07-08' AND licensePlate = 'DPU597')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-03 10:05:39-08' AND licensePlate = '245AFC')),
    (50, FALSE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-04 14:39:00-08' AND licensePlate = '589WGN')),
    (50, FALSE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-04 16:18:49-08' AND licensePlate = 'CD7172')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-05 11:05:28-08' AND licensePlate = '229KBX')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-05 11:27:01-08' AND licensePlate = 'VVF388')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-05 12:00:49-08' AND licensePlate = 'BH909R')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-06 12:00:49-08' AND licensePlate = 'BH909R')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-07 12:00:49-08' AND licensePlate = 'BH909R')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-08 12:00:49-08' AND licensePlate = 'BH909R')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-09 12:00:49-08' AND licensePlate = 'BH909R'));


INSERT INTO parkingActivities(timeStamp, licensePlate, spotID, lotID, activityType) VALUES
    ('2022-11-01 06:29:10-08', 'CF346E', 21, 1, 'in'),
    ('2022-11-01 06:59:29-08', 'CF346E', 21, 1, 'out'),
    ('2022-11-11 06:29:10-08', 'CF346E', 21, 1, 'in'),
    ('2022-11-11 06:59:29-08', 'CF346E', 21, 1, 'out'),
    ('2022-11-22 06:29:10-08', 'CF346E', 21, 1, 'in'),
    ('2022-11-22 06:59:29-08', 'CF346E', 21, 1, 'out'),
    ('2022-11-21 06:29:10-08', 'CF346E', 21, 1, 'in'),
    ('2022-11-21 06:59:29-08', 'CF346E', 21, 1, 'out'),
    ('2022-11-01 07:05:35-08', 'CA762X', 2, 1, 'in'), -- ticket
    ('2022-11-01 09:05:35-08', 'CA762X', 2, 1, 'removed'),
    ('2022-11-05 07:05:35-08', 'CA762X', 2, 1, 'in'), -- ticket
    ('2022-11-05 09:05:35-08', 'CA762X', 2, 1, 'removed'),
    ('2022-11-10 07:05:35-08', 'CA762X', 2, 1, 'in'), -- ticket
    ('2022-11-10 09:05:35-08', 'CA762X', 2, 1, 'removed'),
    ('2022-11-22 07:05:35-08', 'CA762X', 2, 1, 'in'), -- ticket
    ('2022-11-22 09:05:35-08', 'CA762X', 2, 1, 'removed'),
    ('2022-11-01 09:19:05-08', 'DE310T', 5, 1, 'in'),
    ('2022-11-01 09:30:19-08', 'DE310T', 5, 1, 'out'),
    ('2022-11-02 09:19:05-08', 'DE310T', 1, 1, 'in'),
    ('2022-11-02 09:30:19-08', 'DE310T', 1, 1, 'out'),
    ('2022-11-03 09:19:05-08', 'DE310T', 1, 2, 'in'),
    ('2022-11-03 09:30:19-08', 'DE310T', 1, 2, 'out'),
    ('2022-11-04 09:19:05-08', 'DE310T', 1, 3, 'in'),
    ('2022-11-04 09:30:19-08', 'DE310T', 1, 3, 'out'),
    ('2022-11-05 09:19:05-08', 'DE310T', 1, 4, 'in'),
    ('2022-11-05 09:30:19-08', 'DE310T', 1, 4, 'out'),
    ('2022-11-06 09:19:05-08', 'DE310T', 1, 5, 'in'),
    ('2022-11-06 09:30:19-08', 'DE310T', 1, 5, 'out'),
    ('2022-11-01 10:01:09-08', 'XNK656', 31, 1, 'in'), -- ticket
    ('2022-11-01 18:01:09-08', 'XNK656', 31, 1, 'removed'),
    ('2022-11-04 10:01:09-08', 'XNK656', 31, 1, 'in'), -- ticket
    ('2022-11-04 18:01:09-08', 'XNK656', 31, 1, 'removed'),
    ('2022-11-06 10:01:09-08', 'XNK656', 31, 1, 'in'), -- ticket
    ('2022-11-06 18:01:09-08', 'XNK656', 31, 1, 'removed'),
    ('2022-11-01 15:30:03-08', 'KD978P', 46, 1, 'in'),
    ('2022-11-01 15:48:40-08', 'KD978P', 46, 1, 'out'),
    ('2022-11-02 05:59:48-08', '896REN', 16, 2, 'in'), -- ticket
    ('2022-11-02 06:59:48-08', '896REN', 16, 2, 'removed'),
    ('2022-11-02 07:23:36-08', '706SGL', 9, 2, 'in'),
    ('2022-11-02 07:48:01-08', '706SGL', 9, 2, 'out'),
    ('2022-11-02 09:10:38-08', 'GDM839', 17, 2, 'in'), -- ticket
    ('2022-11-02 10:10:38-08', 'GDM839', 17, 2, 'removed'),
    ('2022-11-02 12:31:07-08', 'DPU597', 10, 2, 'in'), -- ticket
    ('2022-11-02 13:31:07-08', 'DPU597', 10, 2, 'removed'),
    ('2022-11-02 18:45:49-08', '985HDE', 48, 2, 'in'),
    ('2022-11-02 19:30:28-08', '985HDE', 48, 2, 'out'),
    ('2022-11-03 10:00:15-08', 'DHR427', 11, 3, 'in'),
    ('2022-11-03 10:38:29-08', 'DHR427', 11, 3, 'out'),
    ('2022-11-03 10:05:39-08', '245AFC', 8, 3, 'in'), -- ticket
    ('2022-11-03 11:05:39-08', '245AFC', 8, 3, 'removed'),
    ('2022-11-03 10:06:08-08', '144PKF', 17, 3, 'in'),
    ('2022-11-03 10:39:10-08', '144PKF', 17, 3, 'out'),
    ('2022-11-03 10:27:19-08', '645RTM', 6, 3, 'in'),
    ('2022-11-03 10:37:20-08', '645RTM', 6, 3, 'out'),
    ('2022-11-04 14:39:00-08', '589WGN', 31, 5, 'in'), -- ticket
    ('2022-11-04 22:39:03-08', '589WGN', 31, 5, 'removed'),
    ('2022-11-04 16:18:49-08', 'CD7172', 12, 1, 'in'), -- ticket
    ('2022-11-04 18:18:49-08', 'CD7172', 12, 1, 'removed'),
    ('2022-11-04 18:07:58-08', 'MBG091', 10, 2, 'in'), -- ticket
    ('2022-11-04 20:07:58-08', 'MBG091', 10, 2, 'removed'),
    ('2022-11-05 11:05:28-08', '229KBX', 16, 1, 'in'), -- ticket
    ('2022-11-05 11:27:01-08', 'VVF388', 10, 4, 'in'), -- ticket
    ('2022-11-05 12:00:49-08', 'BH909R', 25, 4, 'in'), -- ticket
    ('2022-11-06 12:00:49-08', 'BH909R', 25, 4, 'in'), -- ticket
    ('2022-11-07 12:00:49-08', 'BH909R', 25, 4, 'in'), -- ticket
    ('2022-11-08 12:00:49-08', 'BH909R', 25, 4, 'in'), -- ticket
    ('2022-11-09 12:00:49-08', 'BH909R', 25, 4, 'in'), -- ticket
    ('2022-11-05 12:05:28-08', '229KBX', 16, 1, 'removed'),
    ('2022-11-05 14:27:01-08', 'VVF388', 10, 4, 'removed'),
    ('2022-11-05 13:00:49-08', 'BH909R', 25, 4, 'removed'),
    ('2022-11-06 13:00:49-08', 'BH909R', 25, 4, 'removed'),
    ('2022-11-07 13:00:49-08', 'BH909R', 25, 4, 'removed'),
    ('2022-11-08 13:00:49-08', 'BH909R', 25, 4, 'removed'),
    ('2022-11-09 13:00:49-08', 'BH909R', 25, 4, 'removed');

-- permitType: vip, company, reserved, infant, accessibility
INSERT INTO permits(licensePlate, permitType) VALUES
    ('CF346E', 'vip'),
    ('CF346E', 'company'),
    ('CF346E', 'reserved'),
    ('XNK656', 'company'),
    ('KD978P', 'reserved'),
    ('KD978P', 'accessibility'),
    ('896REN', 'infant'),
    ('896REN', 'reserved'),
    ('GDM839', 'accessibility'),
    ('GDM839', 'vip'),
    ('GDM839', 'infant'),
    ('GDM839', 'company'),
    ('985HDE', 'vip'),
    ('DHR427', 'reserved'),
    ('144PKF', 'vip'),
    ('144PKF', 'accessibility'),
    ('144PKF', 'reserved'),
    ('144PKF', 'infant'),
    ('144PKF', 'company'),
    ('645RTM', 'accessibility'),
    ('589WGN', 'company'),
    ('589WGN', 'infant'),
    ('CD7172', 'infant'),
    ('BH909R', 'reserved'),
    ('BH909R', 'vip');
