SELECT
    p.sessionID,
    p.startTime,
    p.isActive,
    p.allottedTime,
    p.isCharging,
    p.lotID AS parkingLotId,
    CONCAT(l.postalCode, ' ', l.city, ', ', l.province) AS parkingLotAddress,
    p.licensePlate AS vehicleLicensePlate,
    p.spotID,
    ps.spotType,
    CASE
        WHEN a.accessibilityType IS NOT NULL THEN a.accessibilityType
    END AS accessibilityType
    CASE
        WHEN a.accessibilityType IS NULL THEN FALSE
        ELSE TRUE
    END AS isAccessibilitySpot
    CASE
        WHEN e.plugType IS NULL THEN FALSE
        ELSE TRUE
    END AS isElectricSpot
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
LEFT JOIN accessibilitySpots a
    ON p.spotID = a.spotID AND p.lotID = a.lotID
LEFT JOIN electricSpots e
    ON p.spotID = e.spotID AND p.lotID = e.lotID
WHERE vo.username = $1