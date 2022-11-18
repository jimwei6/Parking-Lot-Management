SELECT ownerID
FROM vehicleOwner
WHERE username = $1;

INSERT INTO electricVehicle (licensePlate, plugType)
VALUES ($1, $2) RETURNING *;

INSERT INTO permits (licensePlate, permitType)
VALUES ($1, $2) RETURNING *

INSERT INTO vehicle (licensePlate, modelName, ownerID, height, color)
VALUES ($1, $2, $3, $4, $5) RETURNING *
