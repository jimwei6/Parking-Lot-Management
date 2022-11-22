SELECT p.licensePlate,
       t.ticketNumber,
       p.startTime + (p.allottedTime / 3600 * interval '1 hour') AS dateReceived,
       t.paid,
       t.cost
FROM parkingSessions p
JOIN vehicle v
    ON p.licensePlate = v.licensePlate
JOIN vehicleOwner vo
    ON v.ownerID = vo.ownerID
JOIN tickets t
    ON p.sessionID = t.sessionID
WHERE vo.username = $1