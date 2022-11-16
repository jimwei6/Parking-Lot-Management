-- VehicleListPage: licensePlate, model (modelName), height, color, isElectric, plugType, permit (permitType)
SELECT
    v.licensePlate,
    v.modelName AS model,
    v.height,
    v.color,
    ev.plugType,
    array_agg(p.permitType) AS permit,
    CASE
        WHEN ev.plugType = NULL THEN FALSE
        ELSE TRUE
    END AS isElectric
FROM vehicle v
LEFT JOIN electricVehicle ev
    ON v.licensePlate = ev.licensePlate
LEFT JOIN permits p
    ON v.licensePlate = p.licensePlate
JOIN vehicleOwner vo
    ON v.ownerID = vo.ownerID
WHERE vo.username = $1
GROUP BY v.licensePlate, ev.plugType