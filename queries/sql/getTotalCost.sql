SELECT SUM(t.cost) AS totalCost
FROM parkingSessions p
JOIN tickets t
    ON p.sessionID = t.sessionId
JOIN vehicle v
    ON p.licensePlate = v.licensePlate
JOIN vehicleOwner vo
    ON v.ownerID = vo.ownerID
WHERE vo.username = $1 AND p.licensePlate = $2