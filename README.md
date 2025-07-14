# Waste Control

Control your waste.

This project is a technical assessment from wwwaste.io.

Tech stack:

- SvelteKit with Svelte 5
- MongoDB and MongoDB atlas for freemium hosted MongoDB
- Fly.io for deployment

## How to run?

1. Clone this repository.
2. Run `pnpm install`.
3. Run `cp .env.example .env` to copy `.env` file and set `MONGO_URL` value.
4. Run `pnpm run db:seed` to seed data into database.
4. Run `pnpm run dev --open` and it open the web app.