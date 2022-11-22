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
    ('CA762X', 2, 1, 7200, FALSE, '2022-11-01 07:05:35-08', FALSE), -- electric, normal
    ('DE310T', 5, 1, 7200, FALSE, '2022-11-01 09:19:05-08', FALSE), -- electric, normal
    ('XNK656', 31, 1, 28800, FALSE, '2022-11-01 10:01:09-08', FALSE), -- electric, company
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
    ('229KBX', 16, 1, 3600, TRUE, '2022-11-05 11:05:28-08', FALSE), -- normal
    ('VVF388', 10, 4, 10800, TRUE, '2022-11-05 11:27:01-08', FALSE), -- normal
    ('BH909R', 25, 4, 3600, TRUE, '2022-11-05 12:00:49-08', FALSE); -- reserved

-- ticketNumber: serial (automatically increments), cost: 50 (default?)
INSERT INTO tickets(cost, paid, details, sessionId) VALUES
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-01 07:05:35-08' AND licensePlate = 'CA762X')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-01 10:01:09-08' AND licensePlate = 'XNK656')),
    (50, FALSE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-02 05:59:48-08' AND licensePlate = '896REN')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-02 09:10:38-08' AND licensePlate = 'GDM839')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-02 12:31:07-08' AND licensePlate = 'DPU597')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-03 10:05:39-08' AND licensePlate = '245AFC')),
    (50, FALSE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-04 14:39:00-08' AND licensePlate = '589WGN')),
    (50, FALSE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-04 16:18:49-08' AND licensePlate = 'CD7172')),
    (50, TRUE, NULL, (SELECT sessionid FROM parkingSessions WHERE starttime = '2022-11-04 18:07:58-08' AND licensePlate = 'MBG091'));

INSERT INTO parkingActivities(timeStamp, licensePlate, spotID, lotID, activityType) VALUES
    ('2022-11-01 06:29:10-08', 'CF346E', 21, 1, 'in'),
    ('2022-11-01 06:59:29-08', 'CF346E', 21, 1, 'out'),
    ('2022-11-01 07:05:35-08', 'CA762X', 2, 1, 'in'), -- ticket
    ('2022-11-01 10:03:01-08', 'CA762X', 2, 1, 'out'),
    ('2022-11-01 09:19:05-08', 'DE310T', 5, 1, 'in'),
    ('2022-11-01 09:30:19-08', 'DE310T', 5, 1, 'out'),
    ('2022-11-01 10:01:09-08', 'XNK656', 31, 1, 'in'), -- ticket
    ('2022-11-01 20:25:39-08', 'XNK656', 31, 1, 'out'),
    ('2022-11-01 15:30:03-08', 'KD978P', 46, 1, 'in'),
    ('2022-11-01 15:48:40-08', 'KD978P', 46, 1, 'out'),
    ('2022-11-02 05:59:48-08', '896REN', 16, 2, 'in'), -- ticket
    ('2022-11-02 07:03:19-08', '896REN', 16, 2, 'out'),
    ('2022-11-02 07:23:36-08', '706SGL', 9, 2, 'in'),
    ('2022-11-02 07:48:01-08', '706SGL', 9, 2, 'out'),
    ('2022-11-02 09:10:38-08', 'GDM839', 17, 2, 'in'), -- ticket
    ('2022-11-02 10:39:58-08', 'GDM839', 17, 2, 'out'),
    ('2022-11-02 12:31:07-08', 'DPU597', 10, 2, 'in'), -- ticket
    ('2022-11-02 13:35:39-08', 'DPU597', 10, 2, 'out'),
    ('2022-11-02 18:45:49-08', '985HDE', 48, 2, 'in'),
    ('2022-11-02 19:57:28-08', '985HDE', 48, 2, 'out'),
    ('2022-11-03 10:00:15-08', 'DHR427', 11, 3, 'in'),
    ('2022-11-03 10:38:29-08', 'DHR427', 11, 3, 'out'),
    ('2022-11-03 10:05:39-08', '245AFC', 8, 3, 'in'), -- ticket
    ('2022-11-03 11:51:19-08', '245AFC', 8, 3, 'out'),
    ('2022-11-03 10:06:08-08', '144PKF', 17, 3, 'in'),
    ('2022-11-03 10:39:10-08', '144PKF', 17, 3, 'out'),
    ('2022-11-03 10:27:19-08', '645RTM', 6, 3, 'in'),
    ('2022-11-03 10:37:20-08', '645RTM', 6, 3, 'out'),
    ('2022-11-04 14:39:00-08', '589WGN', 31, 5, 'in'), -- ticket
    ('2022-11-04 23:59:03-08', '589WGN', 31, 5, 'out'),
    ('2022-11-04 16:18:49-08', 'CD7172', 12, 1, 'in'), -- ticket
    ('2022-11-04 19:20:20-08', 'CD7172', 12, 1, 'out'),
    ('2022-11-04 18:07:58-08', 'MBG091', 10, 2, 'in'), -- ticket
    ('2022-11-04 21:05:39-08', 'MBG091', 10, 2, 'out'),
    ('2022-11-05 11:05:28-08', '229KBX', 16, 1, 'in'), -- active
    ('2022-11-05 11:27:01-08', 'VVF388', 10, 4, 'in'), -- active
    ('2022-11-05 12:00:49-08', 'BH909R', 25, 4, 'in'); -- active

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
