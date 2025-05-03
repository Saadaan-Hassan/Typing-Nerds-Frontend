# Typing Nerds Frontend

A modern typing practice and competition platform built with Next.js.

## Racing Competition Feature Guide

We've implemented a real-time racing competition feature that allows users to:

- Create typing race rooms
- Join existing public or private races
- Compete in real-time with other users
- View live race progress of all participants
- Get detailed performance metrics after races

### Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:3000/competition
```

### Using the Competition Feature

1. From the Competition page, you can:
   - Create a new competition room
   - Join an existing public room
2. In a competition room:
   - Wait for other participants to join
   - Follow the countdown when it starts
   - Type the text as quickly and accurately as possible
   - See your progress and that of other participants in real-time
   - View results at the end of the race

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS & Shadcn/UI
- **State Management**: React Context
- **Real-time**: Socket.io
- **Deployment**: Vercel

## Features

- Typing practice mode
- Multiplayer racing competitions
- User authentication
- Performance statistics
- Leaderboards
- Code typing mode
- Customizable settings

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
