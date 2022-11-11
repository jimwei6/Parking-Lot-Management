## REQUIRED: 
- JOIN
- INSERTION 
- UPDATE 
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
**FULFILLS**: JOIN or PROJECTION  <br/>
**RESPONSE**:  
  - 200: { name, address, phone, pronouns, gender, dob, email}

<hr/>