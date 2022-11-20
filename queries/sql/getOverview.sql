-- number of people parked at any parking lot
SELECT COUNT(DISTINCT licensePlate) AS AnyLot
FROM parkingSessions

-- number of people parked at all parking lots
SELECT COUNT(DISTINCT licensePlate) AS AllLots
FROM parkingSessions ps0
WHERE NOT EXISTS
        ((SELECT lotID
          FROM parkingSpots)
          EXCEPT
            (SELECT lotID
             FROM parkingSessions ps1
             WHERE ps1.licensePlate = ps0.licensePlate))