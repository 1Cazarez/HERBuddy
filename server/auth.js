import { auth } from 'express-oauth2-jwt-bearer';
import 'dotenv/config';

// Verifies the Auth0-issued access token sent as `Authorization: Bearer <token>`
// on every /api/* request. req.auth.payload.sub is the stable Auth0 user id
// we use as the primary key for the users table.
export const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`
});
