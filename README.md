# Sartaj Security — Elite Protection Services

Premium security firm offering bodyguards, event security, and corporate protection services. Verified protection since 2010.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Framer Motion
- **Database:** MongoDB via Prisma ORM
- **Authentication:** Clerk (Secured Admin Portal)
- **Media Management:** Cloudinary (Signed, secure uploads)
- **Emails:** Resend
- **Validation:** Zod

## ✨ Features

- **Public Landing Page & Leads:** Contact form with rate-limiting, bot protection (IP verification & Session fallbacks), and automated email notifications.
- **Admin Dashboard:** Secure dashboard strictly available to authenticated `ADMIN_USER_ID` users.
- **Inquiry Management:** Read, monitor, and delete prospective client leads safely.
- **Gallery Management:** High-performance Next-Cloudinary widget uploading signed media directly to Cloudinary endpoints, synced cleanly with the MongoDB layer.

---

## 🛠 Beginner Setup Instructions

Ready to run this on your local machine? Follow these step-by-step instructions.

### 1. Prerequisites
Make sure you have installed on your computer:
- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/) cluster
- A free [Clerk](https://clerk.com/) account
- A free [Cloudinary](https://cloudinary.com/) account
- A free [Resend](https://resend.com/) account

### 2. Clone the Repository
```bash
git clone https://github.com/Anu8hav/SartajSecurity-.git
cd SartajSecurity-
```

### 3. Install Dependencies
Run the following command to download all required packages:
```bash
npm install
```

### 4. Setup Environment Variables
You need to connect your local code to your databases and services.
1. Create a new file named `.env.local` in the root folder (next to `package.json`).
2. Copy the contents of `.env.example` into your new `.env.local` file.
3. Fill in all the actual API keys and URLs from your respective dashboards:
   - **MongoDB URL:** Needs to look like `mongodb+srv://...`
   - **Clerk:** Look for Publishable and Secret Keys.
   - **Cloudinary:** Look for Cloud Name, API Key, and Secret.
   - **Resend:** Look for your API Key.
   - **Admin Variables:** Put your own email in `ADMIN_EMAIL` and your Clerk User ID in `ADMIN_USER_ID`.

### 5. Setup the Database (Prisma)
With your database URL inside `.env.local`, hook up Prisma:

```bash
# Generate the Prisma client
npx prisma generate

# Push the schema structure into your empty MongoDB
npx prisma db push
```

### 6. Run the Developer Server
Start coding!

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 
To access the admin dashboard, visit [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) and log in.

---

## 🏗 Architecture Map

```text
           [Client Browser]
                   │
 (Public Routes)   │    (Admin Routes guarded by Clerk middleware.ts)
   /page.tsx       │         /admin/dashboard/page.tsx
   /gallery        │         /admin/gallery & /admin/inquiries
                   ▼
       [React Server Components]
            [Server Actions] 
         (inquiry.ts, gallery.ts)
           │            │
           ▼            ▼
[Resend API]      [Prisma Client (db.ts)] ──▶ [MongoDB]
(Emails)                │
                        ▼
            [Cloudinary API (via route.ts)]
```
