# Anovibe

**Say it. Anonymously.** Anovibe is an anonymous messaging web app. Create a profile, share your unique link or QR code, and receive honest messages and questions from people who don't have to give their name.

## Features

- **Anonymous messaging**: anyone with your link or QR code can send you a message, no account needed
- **Message categories**: senders pick Question, Compliment or Other, and your inbox filters by them
- **Inbox tools**: like, reply, delete, report, and block senders
- **Public replies**: your replies show on your public page
- **Profile themes**: five presets (Lime, Cream, Sunset, Ocean, Forest) plus a bio and display name
- **Share your link**: copy, native share, and a downloadable QR code. The link and the QR code open the same page
- **Auth**: email and password, or Google sign-in
- **Admin reports screen**: review, dismiss, or delete reported messages
- **Legal pages**: FAQ, Terms, and Privacy

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 3
- [Prisma](https://www.prisma.io/) 6 and PostgreSQL (built for [Neon](https://neon.tech))
- [Auth.js](https://authjs.dev/) v5 (Google and credentials)
- `zod` for validation, `bcryptjs` for password hashing, `qrcode` for QR codes

## Getting started

### Prerequisites

- Node.js 20 or newer
- A PostgreSQL database (a free Neon project works)
- Optional: a Google OAuth client for Google sign-in

### 1. Install

```bash
git clone https://github.com/thekeyzigner/anovibe.git
cd anovibe
npm install
```

### 2. Configure environment

Copy the example file and fill it in:

```bash
cp .env.example .env        # PowerShell: copy .env.example .env
```

| Variable              | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`        | Postgres connection string                                    |
| `AUTH_SECRET`         | Random secret for Auth.js sessions (run `npx auth secret`)    |
| `SENDER_HASH_SALT`    | Long random string used to hash anonymous sender fingerprints |
| `AUTH_GOOGLE_ID`      | Google OAuth client ID (optional)                             |
| `AUTH_GOOGLE_SECRET`  | Google OAuth client secret (optional)                         |
| `NEXT_PUBLIC_APP_URL` | Public base URL, e.g. `http://localhost:3000`                 |
| `ADMIN_EMAILS`        | Comma-separated emails allowed to open `/admin`               |

Notes:

- The variable must be named `AUTH_SECRET`. Auth.js ignores other names such as `BETTER_AUTH_SECRET`.
- Don't change `SENDER_HASH_SALT` after launch. Doing so resets all sender blocks.
- On Neon's free tier the database sleeps when idle, so add timeouts to avoid pool errors on first connect:
  `...?sslmode=require&connect_timeout=30&pool_timeout=30`
- Never commit `.env`. It is already in `.gitignore`.

### 3. Set up the database

```bash
npx prisma db push
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Google sign-in (optional)

1. In Google Cloud Console, create an OAuth client of type **Web application**.
2. Add the redirect URI `http://localhost:3000/api/auth/callback/google`. For production, add `https://your-domain.com/api/auth/callback/google` as well.
3. Put the client ID and secret in `.env`.

While your Google app is in testing mode, add your account under **Test users**.

## Routes

| Route                        | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| `/`                          | Landing page                                              |
| `/signup`, `/login`          | Authentication                                            |
| `/u/[username]`              | Public profile and send-message page (link and QR target) |
| `/dashboard`                 | Home: recent messages, stats, share card                  |
| `/dashboard/inbox`           | Inbox with category filters                               |
| `/dashboard/settings`        | Profile, username, bio, theme                             |
| `/admin`                     | Reports review (admins only)                              |
| `/faq`, `/terms`, `/privacy` | Info and legal pages                                      |

## How anonymity works

- Senders never sign in. Messages store only the text, a category, and a salted hash made from the sender's IP address and a device cookie (`av_d`).
- The raw IP address is never stored, and recipients never see the hash.
- The hash is used only for rate limiting (5 messages per 10 minutes) and for blocking. Blocked senders still see a normal "sent" screen.
- Clearing cookies or changing networks can get around blocks. That is a known trade-off of having no sender accounts.

## Project structure

```
prisma/schema.prisma      Data models (User, Message, Block, Report, Auth.js tables)
src/auth.ts               Auth.js configuration
src/app/                  Pages and API routes
src/components/           UI components
src/lib/                  Helpers (prisma client, themes, sender hash, share URL)
```

## Deployment

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com).
2. Add the environment variables from the table above. Set `NEXT_PUBLIC_APP_URL` to your live URL.
3. Add the production redirect URI in Google Cloud.
4. Build runs `prisma generate` automatically. Run `npx prisma db push` against your production database once.

## Roadmap

- Self-serve account deletion
- Email or push notifications for new messages
- Moderation tools and report notifications

## Contributing

Issues and pull requests are welcome.
