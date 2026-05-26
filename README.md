# Sartaj Security — Elite Protection Services

Premium security firm offering bodyguards, event security, and corporate protection services. Verified protection since 2010.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Framer Motion
- **Database:** MongoDB via Prisma ORM
- **Authentication:** Clerk (secured admin portal)
- **Media Management:** Cloudinary (signed, secure uploads)
- **Emails:** Resend
- **Validation:** Zod

## Features

- **Public landing page and leads:** Contact form with rate-limiting, bot protection (IP verification and session fallbacks), and automated email notifications.
- **Admin dashboard:** Secure dashboard strictly available to authenticated `ADMIN_USER_ID` users.
- **Inquiry management:** Read, monitor, and delete prospective client leads safely.
- **Gallery management:** Next-Cloudinary widget uploads signed media directly to Cloudinary endpoints and syncs with MongoDB.

---

## Beginner Quick Start

Follow these steps in order. You can run the project end-to-end with no prior setup.

### 1) Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/) cluster
- A free [Clerk](https://clerk.com/) account
- A free [Cloudinary](https://cloudinary.com/) account
- A free [Resend](https://resend.com/) account

### 2) Clone the repository

```bash
git clone https://github.com/Anu8hav/SartajSecurity-.git
cd SartajSecurity-
```

### 3) Install dependencies

```bash
npm install
```

### 4) Create your environment file

Create a `.env.local` file in the project root (next to `package.json`) and add the variables below.

```bash
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_unsigned_preset"

RESEND_API_KEY="re_..."

ADMIN_EMAIL="you@example.com"
ADMIN_USER_ID="user_..."
```

Where to find each value:

- **MongoDB Atlas:** Use the connection string for your cluster.
- **Clerk:** Dashboard → API Keys (publishable + secret). After you sign in once, copy your Clerk user id and set it as `ADMIN_USER_ID`.
- **Cloudinary:** Dashboard → Product Environment (cloud name, API key, API secret). Create an upload preset and set its name in `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- **Resend:** Dashboard → API Keys.

### 5) Set up the database (Prisma)

```bash
npx prisma generate
npx prisma db push
```

### 6) Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To access the admin dashboard, visit [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) and log in. Only the `ADMIN_USER_ID` will have access.

---

## Useful Commands

```bash
npm run dev     # Start the dev server
npm run build   # Create a production build
npm run start   # Run the production server
npm run lint    # Lint the project
```

---

## Architecture Map

```text
                [Client Browser]
                            |
 (Public Routes)   |    (Admin Routes guarded by Clerk middleware.ts)
    /page.tsx       |         /admin/dashboard/page.tsx
    /gallery        |         /admin/gallery & /admin/inquiries
                            v
          [React Server Components]
                  [Server Actions]
             (inquiry.ts, gallery.ts)
                |            |
                v            v
[Resend API]      [Prisma Client (db.ts)] --> [MongoDB]
(Emails)                |
                                    v
                  [Cloudinary API (via route.ts)]
```
