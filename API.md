## REQUIRED: 
- JOIN (/vehicle GET)
- INSERTION (/vehicle POST)
- UPDATE (/profile PUT)
- DELETION 
- AGGREGATION GB 
- PROJECTION  (3-5 attributes) (/profile GET)
- SELECTION 
- AGGREGATION HV 
- DIVISION 
- NESTED AGG

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
**FULFILLS**: JOIN <br/>
**RESPONSE**:
  - 200: [{ licenseplate, model, height, color, plugtype, permits: string[], iselectric }]

<hr/>

**ROUTE**: /api/types <br/>
**METHOD**: GET <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: NONE <br/>
**RESPONSE**:
  - 200: [{ permits: string[], models: string[], plugTypes: string[] }]

<hr/>

**ROUTE**: /api/vehicle <br/>
**METHOD**: POST <br/>
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: INSERTION <br/>
**RESPONSE**:   
   - 200: [{ licenseplate, model, height, color, plugtype, permits: string[], iselectric }]
   - 400: 'Failed to add user vehicle'

<hr/>