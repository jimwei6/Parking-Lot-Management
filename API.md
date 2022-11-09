ROUTE: /api/authenticate
METHOD: GET
QUERY: username (string), password (string)
RESPONSE:
  200: {authenticated: true}
  400: {error: 'Missing uername or password'}
  401: {error: 'Login credentials are incorrect'}