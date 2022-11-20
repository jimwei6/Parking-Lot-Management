SELECT COUNT(DISTINCT v.ownerID) AS AnyLot
FROM parkingSessions ps
JOIN vehicle v ON ps.licensePlate = v.licensePlate
WHERE ps.startTime > CURRENT_TIMESTAMP - INTERVAL '30 day'

SELECT COUNT(DISTINCT v0.ownerID) AS AllLots
FROM parkingSessions ps0
JOIN vehicle v0 ON ps0.licensePlate = v0.licensePlate
WHERE ps0.startTime > CURRENT_TIMESTAMP - INTERVAL '30 day'
    AND NOT EXISTS
        ((SELECT lotID
          FROM parkingSpots)
          EXCEPT
          (SELECT ps1.lotID
           FROM parkingSessions ps1
           JOIN vehicle v1 ON ps1.licensePlate = v1.licensePlate
           WHERE v1.ownerID = v0.ownerID))