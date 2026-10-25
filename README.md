This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Firebase: admin page for products and recipes

Products and recipes live in Firestore and are edited at `/admin`. Until Firebase is set up, the site shows the starter content from `lib/seed.ts` and `/admin` shows a notice.

1. Create a Firebase project. Enable **Authentication → Email/Password**, **Firestore** (production mode) and **Storage** (needs the Blaze plan; usage at this size stays in the free tier).
2. Copy `.env.example` to `.env.local` and fill it in: the web app config for the `NEXT_PUBLIC_FIREBASE_*` values, and a service account key (Project settings → Service accounts → Generate new private key) for the `FIREBASE_*` values. Add the same variables in Vercel.
3. Publish the rules: paste `firestore.rules` and `storage.rules` into the console (Firestore → Rules, Storage → Rules), or run `firebase deploy --only firestore:rules,storage`.
4. In Authentication → Users, add her account (email + password), then run `node --env-file=.env.local scripts/set-admin.mjs her@email.com`.
5. Sign in at `/admin` and click **استوردي المحتوى الأوّلي** to copy the starter products and recipes into Firestore. From then on, edit them there.

Saving in `/admin` updates the live site right away, with no redeploy.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
