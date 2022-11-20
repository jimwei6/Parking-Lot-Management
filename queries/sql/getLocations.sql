SELECT pl.lotID, l.postalCode, l.city, l.province
FROM location l, parkingLots pl
WHERE l.postalCode = pl.postalCode