SELECT
    p.lotID AS parkingLotID,
    CONCAT(l.postalCode, ' ', l.city, ', ', l.province) AS parkingLotAddress,
    p.licensePlate AS vehicleLicensePlate,
    COUNT(DISTINCT p.sessionID) AS count
FROM parkingSessions p
JOIN parkingSpots ps
    ON p.spotID = ps.spotID AND p.lotID = ps.lotID
JOIN parkingLots pl
    ON ps.lotID = pl.lotID
JOIN location l
    ON pl.postalCode = l.postalCode
JOIN vehicle v
    ON p.licensePlate = v.licensePlate
JOIN vehicleOwner vo
    ON v.ownerID = vo.ownerID
WHERE vo.username = $1
GROUP BY p.licensePlate, p.lotID, l.postalCode