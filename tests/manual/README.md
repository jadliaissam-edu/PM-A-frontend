# Manual / ad-hoc tests (curl and Postman)

This file contains quick examples for manual debugging using curl or to import into Postman.

Login (example):

```
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Testpass123"}' -c cookies.txt
```

Use cookies for authenticated requests:

```
curl -X GET http://127.0.0.1:8000/api/projects/ -b cookies.txt
```

Import these endpoints into Postman and use cookie/session auth or bearer tokens depending on your backend setup.
