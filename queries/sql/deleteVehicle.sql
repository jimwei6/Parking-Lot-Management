SELECT ownerID
FROM vehicleOwner
WHERE username = $1;

DELETE FROM vehicle
WHERE ownerID = $1 AND licensePlate = $2 RETURNING *;