SELECT ps.spotid,
  pl.lotid,
  ps.availabletime, 
  es.plugType,
  accs.accessibilitytype,
  pl.postalcode,
  l.city,
  l.province,
  ps.spottype
  FROM parkingspots as ps 
  INNER JOIN parkinglots as pl ON pl.lotid = ps.lotid
  INNER JOIN location as l ON l.postalcode = pl.postalcode
  LEFT JOIN electricspots as es ON es.spotid = ps.spotid AND es.lotid = ps.lotid
  LEFT JOIN accessibilityspots as accs ON accs.spotid = ps.spotid AND accs.lotid = ps.lotid
  WHERE (pl.heightlimit IS NULL OR pl.heightlimit >= $1)
    AND (ps.height IS NULL OR ps.height >= $1)
    AND es.plugType = $${args.length + 1}
    AND pl.lotid = $${args.length + 1}
    AND ps.availabletime >= $${args.length + 1}
    AND accs.accessibilitytype = $${args.length + 1}
    AND ps.spottype = $${args.length + 1}