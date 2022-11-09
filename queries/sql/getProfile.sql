SELECT vo.name,
  vo.address,
  pd.phone,
  pd.pronouns,
  pd.gender,
  pd.dob
FROM vehicleOwner as vo 
JOIN personalDetails as pd 
  ON pd.name = vo.name AND pd.address = vo.address
WHERE vo.username = $1 LIMIT 1