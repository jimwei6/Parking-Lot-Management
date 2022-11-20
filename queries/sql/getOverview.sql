SELECT COUNT(DISTINCT licensePlate) AS AnyLot
FROM parkingSessions

SELECT COUNT(DISTINCT licensePlate) AS AllLots
FROM parkingSessions ps0
WHERE NOT EXISTS
        ((SELECT lotID
          FROM parkingSpots)
          EXCEPT
            (SELECT lotID
             FROM parkingSessions ps1
             WHERE ps1.licensePlate = ps0.licensePlate))