# Devlog - Authentication


## Authentication Flow (JWT + Refresh Token)

- Access Token: JWT (stateless), used in `Authorization: Bearer <token>`
- Refresh Token: JWT + stored in DB (`refresh_tokens`), one per user
- Login issues both tokens. Refresh token is rotated on each login (DB row stays 1).

### Endpoints
- POST /api/v1/users/signup
- POST /api/v1/users/login  -> { accessToken, refreshToken }
- GET  /api/v1/users/me     -> requires access token
- POST /api/v1/users/reissue -> refresh token -> new access token
- POST /api/v1/users/logout  -> deletes refresh token in DB

### Reissue Rule
- Validate refresh JWT (signature/exp)
- Extract userId from `sub`
- Find refresh by userId in DB and compare token equality
- If valid: issue new access token (refresh stays unchanged)

### Logout Rule
- Requires access token
- Extract userId from access token and delete refresh token in DB
- Existing access tokens remain valid until expiration (stateless JWT)
