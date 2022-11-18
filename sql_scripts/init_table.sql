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
