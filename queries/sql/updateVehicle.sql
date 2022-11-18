SELECT v.ownerid, v.licenseplate, ev.plugtype FROM accounts AS a
  INNER JOIN vehicleowner AS vo on vo.username = a.username
  INNER JOIN vehicle as v on v.ownerid = vo.ownerid
  LEFT JOIN electricvehicle AS ev on ev.licenseplate = v.licenseplate
  WHERE a.username = $1 AND v.licenseplate = $2 LIMIT 1;

UPDATE vehicle SET 
  modelname = $1,
  height = $2,
  color = $3 
  WHERE licenseplate = $4 RETURNING *;

DELETE FROM permits WHERE licenseplate = $1;

INSERT INTO permits(licenseplate, permittype) VALUES $permitInserts RETURNING *;

UPDATE electricvehicle SET plugtype = $1 WHERE licenseplate = $2 RETURNING *;