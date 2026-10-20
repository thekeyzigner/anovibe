# Anovibe
Next.js 15 + Prisma/Postgres + Auth.js (Google + email).

1. `cp .env.example .env` and fill it in (`npx auth secret` for AUTH_SECRET)
2. Google OAuth redirect URI: `{APP_URL}/api/auth/callback/google`
3. `npm install && npx prisma db push && npm run dev`

Link and QR code both point to `/u/<username>`.
