## REQUIRED: 
- JOIN (/vehicle GET)
- INSERTION 
- UPDATE (/profile PUT)
- DELETION (/vehicle PUT)
- AGGREGATION GB 
- PROJECTION  (3-5 attributes) (/profile GET)
- SELECTION (user provides params)
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
  - 200: [{ permits: string[], models: string[], plugTypes: string[] }]

<hr/>