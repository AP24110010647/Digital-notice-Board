# Digital Notice Board

A full-stack Digital Notice Board application with React, Tailwind CSS, Express, MongoDB, JWT authentication, role-based access, file uploads, Socket.io real-time updates, and optional email notifications.

## Features

- User registration and login with JWT
- Password hashing with bcrypt
- Admin and user roles
- Admin notice create, edit, delete, pin, and attachment upload
- User read-only dashboard
- Active notices only, with expired notices hidden automatically
- Category filter and text search
- MongoDB storage with Mongoose models
- Real-time notice create/update/delete events with Socket.io
- Notification badge for new notices
- Dark mode toggle
- RESTful API with validation and error handling
- DSA-based notice organization using Trie search, Heap priority sorting, and Map/Set grouping

## DSA Concepts Used

- **Trie**: builds a prefix search index for notice title, description, and category.
- **Heap / Priority Queue**: keeps pinned and latest notices ordered by importance.
- **HashMap / Map**: groups notices by category for dashboard rows.
- **Set**: removes duplicate search results and intersects multi-word matches.

## DAA Concepts Used

- **Searching Algorithm**: finds matching notices from title, description, and category.
- **Sorting Algorithm**: orders notices by pinned status and latest creation time.
- **Greedy Approach**: always gives higher display priority to pinned notices first.
- **Time Complexity Analysis**: compares basic filtering with indexed prefix search.
- **Space Complexity Analysis**: explains extra memory used by Trie, Map, and Set.
- **Search Optimization**: improves repeated notice lookup through an indexed structure.

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Install dependencies.

   ```bash
   npm run install:all
   ```

2. Configure backend environment.

   ```bash
   copy backend\.env.example backend\.env
   ```

   Update `backend/.env`:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/digital_notice_board
   JWT_SECRET=use_a_long_random_secret
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

3. Configure frontend environment.

   ```bash
   copy frontend\.env.example frontend\.env
   ```

4. Start the backend.

   ```bash
   npm run dev:backend
   ```

5. Start the frontend in another terminal.

   ```bash
   npm run dev:frontend
   ```

6. Open the app at `http://localhost:5173`.

The first registered account is automatically created as an admin. Later accounts are users.

## API Overview

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Notices

- `GET /notices?category=Exam&search=fees`
- `GET /notices/categories`
- `POST /notices` admin only, multipart form data
- `PUT /notices/:id` admin only, multipart form data
- `DELETE /notices/:id` admin only

Notice form fields:

- `title`
- `description`
- `category`
- `expiryDate`
- `isPinned`
- `attachment` optional PDF/image, max 5 MB

## Deployment

### Backend on Render

1. Create a new Render Web Service from this repository.
2. Set root directory to `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
   - optional SMTP variables

Uploads are stored on the server filesystem. For production, use persistent disk storage on Render or replace local uploads with S3/Cloudinary.

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set root directory to `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variables:
   - `VITE_API_URL=https://your-render-backend.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-render-backend.onrender.com`
