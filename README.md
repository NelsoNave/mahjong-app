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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Update Schema

### develop

```bash
# immediately apply schema changes to database
npx prisma db push

# generate & update prisma client
npx prisma generate

# start prisma studio ( http://localhost:5555 )
npx prisma studio
```

### production

```bash
# create migration file
npx prisma migrate dev --name <name>
# deploy migration file
npx prisma migrate deploy
```

## How to Preview Swagger Documentation in VSCode
1. Install Swagger Viewer Extension
2. Open Command Palette(Press `Command + Shift + P`)
3. Run `Swagger Preview`
4. View the Documentation