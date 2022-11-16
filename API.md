## REQUIRED: 
- JOIN (/profile GET)
- INSERTION 
- UPDATE (/profile PUT)
- DELETION 
- AGGREGATION GB 
- PROJECTION 
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
**FULFILLS**: JOIN <br/>
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
**EXPECT**: username and password in cookies else 401 <br/>
**FULFILLS**: JOIN <br/>
**RESPONSE**:
  - 200: [{licensePlate, model, height, color, isElectric, plugType[], permit}]

<hr/>