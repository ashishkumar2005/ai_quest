# AI Quest

AI Quest is a mobile-first Class 10 Artificial Intelligence learning platform built with Next.js App Router, TypeScript, Tailwind CSS and Supabase. The current course includes exactly seven units, 28 demo lessons and seven starter quizzes. Each unit has one independent notes-PDF slot.

The project includes a browser-local demo mode for student data. Admin access is always protected by a server-checked password and a signed, HTTP-only session cookie. Connect Supabase to enable shared accounts, RLS-protected content, persistent progress and private resource storage.

## Included

- Student landing page, dashboard, course units, lesson pages, learning objectives, topics and unit progress
- Seven original, lightweight unit illustrations
- Interactive quizzes with scored attempts, explanations and quiz history
- Student profile editor, progress view, global search, and a suggestions form with exactly **Subject** and **Message** fields
- Admin portal for unit and lesson editing, lesson ordering, video IDs, unit notes PDFs, CBSE sample papers, quiz questions, announcements, suggestions and student profiles
- Supabase email/password authentication, a password-protected admin portal, optional admin-role enforcement and a database profile trigger
- Supabase SQL migrations with Row Level Security, private storage policies and server-scored quiz RPCs that keep answer keys out of student table access
- Private Supabase Storage for lesson videos, PDFs and course images, with signed playback links
- Vercel-compatible Next.js production scripts

## Local preview

Install Node.js 20.9 or newer. From this folder, install the locked dependencies and run the checks:

```bash
npm ci
npm run check
```

Start the local development server:

```bash
npm run dev
```

Open `http://localhost:3000`. Choose **Start learning**, then **Explore units** to try the included lessons. Student progress is saved in this browser; no Supabase account or environment variables are needed for the local preview. Starter lessons include lesson descriptions and progress tracking, but video playback requires published videos.

`npm run check` runs the TypeScript check and a production build. A successful build confirms the app compiles; while `npm run dev` is running, opening the URL confirms the local server responds. Set the admin environment variables below to use the protected **Admin portal**. The password is validated on the server and is never sent to client-side code.

For a production build and local production server:

```bash
npm run build
npm run start
```

## Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL editor, apply `supabase/migrations/202609260001_initial_schema.sql`, `supabase/migrations/202609260002_seed_quizzes.sql`, then `supabase/migrations/202609290001_supabase_video_storage.sql`.
3. In **Project Settings → API**, copy the project URL and publishable/anon key into `.env.local` using the names in `.env.example`.
4. In **Authentication → Providers**, enable Email and Password. Configure email confirmation and password rules to suit your school’s account policy.
5. Create the first account through `/login`. The signup metadata creates a student profile. Promote a trusted account to admin from the Supabase SQL editor:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'admin@example.com');
   ```

   Replace the example email with the administrator’s account email. Only admins can read or change the CMS tables and upload course resources. The profile trigger always creates new accounts as students; it ignores client-supplied role values.

6. Add the environment variables to `.env.local`, then restart the development server. Never put a service-role key in a `NEXT_PUBLIC_` variable or in browser code. This project does not need a service-role key for its normal student and admin operations.

The migration seeds the Class 10 course, its seven units, 28 lessons and a published starter quiz for each unit. Unit PDFs and sample papers are not seeded; admins upload the real course material through the CMS.

## Admin setup and content uploads

`/admin` always requires the `ADMIN_PORTAL_PASSWORD` and a valid server-signed session. When Supabase is connected, the user must also be signed in to an account whose profile role is `admin`. Admin writes are also enforced by database RLS and private Storage policies. Sessions expire after 12 hours; use **Sign out** in the admin header to end one early.

For local development, add both values to the ignored `.env.local` file. Keep the password private and use a cryptographically random signing secret with at least 32 characters. For Vercel, add both as server-side environment variables for Preview and Production, then redeploy. Do not use a `NEXT_PUBLIC_` prefix for either value.

- **Unit PDFs:** Admin portal → Unit notes PDFs. Choose the unit, add PDF metadata and upload one primary PDF. Replacing the file updates that unit’s slot; publishing controls student visibility.
- **CBSE sample papers:** Admin portal → Sample papers. Add a title, academic session, paper type, description and PDF. Students see published papers only.
- **Videos:** In Admin portal → Units & lessons, choose a lesson and upload an MP4 or WebM video up to 50 MB. Select **Save course changes** after upload. Video files are stored in the private `course-resources` bucket; students receive signed playback links only for published lessons.
- **Unit illustrations:** The seven original SVG illustrations are in `public/images`. Admins can replace a unit illustration in the CMS. Supabase-backed replacement images are stored in the private `course-resources` bucket.

Supabase Storage does not transcode videos or provide adaptive-bitrate streaming. Use browser-compatible MP4 (H.264/AAC) or WebM files. Do not commit video files to GitHub. Signed playback links expire after one hour; no web player can prevent screen recording.

## Vercel deployment

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Use the default Next.js framework preset and root directory `.`.
4. Add the variables from `.env.example` under **Project Settings → Environment Variables**. Set the Supabase URL and anon/publishable key for Preview and Production.
5. Deploy. Vercel runs `npm install` and `npm run build`; no separate server is required.
6. Add the deployed Vercel URL to Supabase **Authentication → URL Configuration → Site URL** and the allowed redirect URLs.
7. Create the first admin account, then promote it with the SQL statement above.

## Environment variables

| Variable | Where it is used | Required |
| --- | --- | --- |
| `ADMIN_PORTAL_PASSWORD` | Server-side admin login check | Required for `/admin` |
| `ADMIN_SESSION_SECRET` | Server-side session signing | Required; 32+ random characters |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase browser and server clients | For shared auth and data |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase browser and server clients; subject to RLS | For shared auth and data |

## Structure

```text
app/                    Frontend pages and layouts; app/api/ contains server API routes
components/             Reusable frontend navigation, cards and UI
lib/                    Course data, browser demo state and Supabase clients
public/                 Static files served by the app, including unit illustrations
supabase/migrations/     Database schema, access policies and starter quiz content
```

## Operational notes

- The no-credential preview uses `localStorage` and does not create real user accounts. Clear the browser site data to reset the demo.
- Supabase migrations and third-party accounts must be configured by the deployer. The repository contains placeholders only and no API credentials.
- Student quiz answers are scored by a database function in connected mode. Direct student reads of `quiz_questions` are denied by RLS.
- PDF and image files are stored in a private Supabase Storage bucket. Student links are short-lived signed URLs for published resources.
- Progress, attempts, suggestions, announcements, course records and uploads become shared only after Supabase is connected and the migration has been applied.
