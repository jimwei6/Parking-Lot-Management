## REQUIRED: 
- JOIN (/vehicle GET)
- INSERTION (/vehicle POST)
- UPDATE (/profile PUT)
- DELETION (/vehicle PUT, /vehicle DELETE)
- AGGREGATION GB (/parkingLots/stats GET, /summary GET)
- PROJECTION  (3-5 attributes) (/profile GET)
- SELECTION (/parkingSpots GET)
- AGGREGATION HV  (/parkingLots/stats GET)
- DIVISION (/overview GET)
- NESTED AGG (/parkingLots/stats GET)

## ROUTES
<hr/>

**ROUTE**: /auth <br/>
**METHOD**: GET  <br/>
**QUERY**: username (string), password (string)  <br/>
**RESPONSE**: 
  - 200: {authenticated: true} 
  - 400: {error: 'Missing uername or password'}
  - 401: {error: 'Login credentials are incorrect'}

<hr/>

**ROUTE**: /api/parkingLot  <br/>
**METHOD**: GET  <br/>
**EXPECT**: username and password in cookies else 401  <br/>
**RESPONSE**:
 - 200: {result: [] parking lots (*)}

<hr/>

**ROUTE**: /api/profile  <br/>
**METHOD**: GET  <br/>
**EXPECT**: username and password in cookies else 401  <br/>
**FULFILLS**: PROJECTION <br/>
**RESPONSE**:  
  - 200: {name, address, phonenumber, pronouns, gender, dob, email}

<hr/>

**ROUTE**: /api/profile  <br/>
**METHOD**: PUT  <br/>
**EXPECT**: username and password in cookies else 401  <br/>
**FULFILLS**: UPDATE  <br/>
**RESPONSE**:  
  - 200: {name, address, phonenumber, pronouns, gender, dob, email}
  - 400: 'Failed to update user profile'

<hr/>

**ROUTE**: /api/vehicle <br/>
**METHOD**: GET <br/>
**QUERY**: licensePlate (string) (OPTIONAL)  <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: JOIN, PROJECTION <br/>
**RESPONSE**:
  - 200: [{ licenseplate, model, height, color, plugtype, permits: string[], iselectric }]

<hr/>

**ROUTE**: /api/vehicle <br/>
**METHOD**: PUT <br/>
**BODY**: { licensePlate, model, height, color, plugType, permits: string[], isElectric } <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: DELETION, JOIN, UPDATE <br/>
**RESPONSE**:
  - 200: [{ licensePlate, model, height, color, plugType, permits: string[], isElectric }]

<hr/>

**ROUTE**: /api/types <br/>
**METHOD**: GET <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: NONE <br/>
**RESPONSE**:
  - 200: [{ permits: string[], models: string[], plugTypes: string[], spotTypes: string[], accessTypes: string[] }]

<hr/>

**ROUTE**: /api/vehicle <br/>
**METHOD**: POST <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: INSERTION <br/>
**RESPONSE**:   
  - 200: [{ licenseplate, model, height, color, plugtype, permits: string[], iselectric }]
  - 400: 'Failed to add user vehicle'

<hr/>

**ROUTE**: /api/vehicle <br/>
**METHOD**: DELETE <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: DELETION <br/>
**RESPONSE**:
  - 200: [{ licenseplate, model, height, color, plugtype, permits: string[], iselectric }]
  - 400: 'Failed to delete user vehicle'

<hr/>

**ROUTE**: /api/overview <br/>
**METHOD**: GET <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: DIVISION  <br/>
**RESPONSE**:
  - 200: { anylot, alllots }

<hr/>

**ROUTE**: /api/location <br/>
**METHOD**: GET <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**RESPONSE**:
  - 200: [{ lotid, postalcode, city, province }]

<hr/>

**ROUTE**: /api/parkingHistory <br/>
**METHOD**: GET <br/>
**QUERY**: licenseplate (string) (optional), 
  attr (string of array JSON string array)
    // p.allottedTime,
    // p.isCharging,
    // p.sessionID
    // p.spotID,
    // ps.spotType
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: JOIN, PROJECTION <br/>
**RESPONSE**:
  - 200: [{ sessionid, starttime, isactive, allottedtime, ischarging, parkinglotid, parkinglotaddress, 
            vehiclelicenseplate, spotid, spottype, accessibilitytype, isaccessibilityspot, iselectricspot}]

<hr/>

**ROUTE**: /api/parkingLots/stats <br/>
**METHOD**: GET <br/>
**QUERY**: lotId (number) <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: JOIN, PROJECTION, Aggregate GB, Aggregate GB Having, Nested AGG <br/>
**RESPONSE**:
  - 200: { tickets: {name, email, num_tickets}[], averagePark: string, parked: {name, email, parked}[]}

<hr/>

**ROUTE**: /api/parkingSpots <br/>
**METHOD**: GET <br/>
**QUERY**: licensePlate (string), spotType (string) (optional), needsCharging (boolean) (optional), duration (number) (optional), accessType (string) (optional),
  lotId (number) (optional) <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: SELECTION <br/>
**RESPONSE**:
  - 200: { result: [{ spotid, lotid, availabletime, plugtype, accessibilitytype,
                      postalcode, city, province, spottype}]}

<hr/>

**ROUTE**: /api/ticketHistory <br/>
**METHOD**: GET <br/>
**QUERY**: licenseplate (string) (optional), 
  attr (string of array JSON string array)
  // t.ticketNumber,
  // p.sessionid,
  // t.details
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: JOIN, PROJECTION <br/>
**RESPONSE**:
  - 200: [{ licensePlate, ticketNumber, dateReceived, paid, cost }]

<hr/>

**ROUTE**: /api/summary <br/>
**METHOD**: GET <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: JOIN, PROJECTION, AGGREGATION GB <br/>
**RESPONSE**:
  - 200: [{ parkinglotid, parkinglotaddress, vehiclelicenseplate, count }]

<hr/>

**ROUTE**: /api/session <br/>
**METHOD**: POST <br/>
**BODY**: lotId: number, spotId: number, licensePlate: string
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: PROJECTION, INSERT <br/>
**RESPONSE**:
  - 200: {message: "session started"}
  - 4xx: user cannot park at spot due to message or have existing session

<hr/>

**ROUTE**: /api/session/end <br/>
**METHOD**: PUT <br/>
**BODY**: sessionid: number
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: UPDATE, INSERT <br/>
**RESPONSE**:
  - 200: {message: "session ended"}
  - 4xx: No session found etc

<hr/>

**ROUTE**: /api/totalCost/:licensePlate <br/>
**METHOD**: GET <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: JOIN <br/>
**RESPONSE**:
  - 200: { totalCost }

<hr/>

**ROUTE**: /api/numTickets/:licensePlate <br/>
**METHOD**: GET <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: JOIN <br/>
**RESPONSE**:
  - 200: { numTickets }

<hr/>