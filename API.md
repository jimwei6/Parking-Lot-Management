ROUTE: /auth
METHOD: GET
QUERY: username (string), password (string)
RESPONSE:
  200: {authenticated: true}
  400: {error: 'Missing uername or password'}
  401: {error: 'Login credentials are incorrect'}

ROUTE: /api/parkingLot
METHOD: GET
EXPECT: username and password in cookies else 401
RESPONSE:
  200: {result: [] parking lots (*)}

ROUTE: /api/profile
METHOD: GET
EXPECT: username and password in cookies else 401
RESPONSE:
  200: {name, address, phone, pronouns, gender, dob, email}
