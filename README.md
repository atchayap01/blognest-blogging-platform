# BlogNest – Blogging Platform with Comments

> **"Write. Share. Connect."**  
> A complete, production-ready full-stack blogging platform built with **React**, **Express.js**, **TypeScript**, **MongoDB Atlas**, **Mongoose**, and **JWT Authentication**.

---

## 🌟 Key Features

- **User Registration & Secure Authentication**
  - Salted and hashed passwords with **bcrypt** (never stored in plain text).
  - Stateless JSON Web Token (**JWT**) authentication with Bearer tokens.
  - Form validation with semantic feedback and error prevention.
  - Persistent login session with automatic token hydration.

- **Blog Post Management (Full CRUD)**
  - Create articles with title, category, tags, custom excerpt, and cover image.
  - Live markdown preview mode for formatting headings, blockquotes, code blocks, and lists.
  - Edit and modify own published posts with automatic `updatedAt` tracking.
  - Delete posts with confirmation modals (automatically cascades and cleans up related comments).
  - Authorization protection: Non-owners cannot edit or delete another user's post.

- **Interactive Discussion & Comments System**
  - Authenticated users can write comments on any article.
  - View commenter avatar, name, and timestamp.
  - Comment owners can delete their own comments.
  - Real-time comment counter synchronized in the MongoDB Post document.
  - Protected backend routes ensure users cannot delete another user's comment (HTTP 403 Forbidden).

- **Rich Discovery, Search & Filters**
  - Full-text search across article titles, content, excerpts, and tags.
  - Category filters (Web Development, Career, Best Practices, Technology, Design, etc.).
  - Sort by Latest, Most Discussed (popular), and Oldest.
  - Pagination for high-volume catalogs.

- **User Dashboard & Analytics**
  - Overview of published stories and received discussions.
  - Summary metrics: Total Posts, Total Comments Received, Engagement averages.
  - Direct shortcuts to edit, view, or delete authored posts.
  - Feed of recent comments received across all your stories.

- **User Profile Customization**
  - Update display name, biography/headline, and avatar photo URL.
  - View author statistics and published articles list.

- **Production-Ready Architecture**
  - 100% real MongoDB database storage using Mongoose schemas with references (`ObjectId`, `ref: 'User'`, `ref: 'Post'`).
  - Embedded local MongoDB engine out-of-the-box for instant zero-config testing.
  - Seamless toggle to **MongoDB Atlas Cloud** cluster via `MONGODB_URI`.
  - Clean separation of concerns: routes, controllers, middleware, models, services, and context.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Routing**: React Router v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans & Lora typography
- **Icons**: Lucide React
- **HTTP Client**: Typed REST Client (`fetch` API with Bearer token interceptor)

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Language**: TypeScript (executed with `tsx`)
- **Database & ODM**: MongoDB Atlas / MongoDB with Mongoose
- **Security & Auth**: `jsonwebtoken` (JWT), `bcryptjs`, `cors`, `dotenv`

---

## 📁 Project Structure

```
blog-platform/
│
├── server/                           # Backend Application
│   ├── config/
│   │   └── db.ts                     # MongoDB Atlas & local engine connection
│   ├── controllers/
│   │   ├── authController.ts         # User registration, login, profile
│   │   ├── postController.ts         # Posts CRUD, search, filter
│   │   ├── commentController.ts      # Comments CRUD, counts
│   │   └── userController.ts         # User profiles & dashboard stats
│   ├── middleware/
│   │   └── authMiddleware.ts         # JWT Bearer verification & protection
│   ├── models/
│   │   ├── User.ts                   # Mongoose User schema & bcrypt methods
│   │   ├── Post.ts                   # Mongoose Post schema & text search indexes
│   │   └── Comment.ts                # Mongoose Comment schema with refs
│   ├── routes/
│   │   ├── authRoutes.ts             # /api/auth/*
│   │   ├── postRoutes.ts             # /api/posts/*
│   │   ├── commentRoutes.ts          # /api/comments/*
│   │   └── userRoutes.ts             # /api/users/*
│   ├── utils/
│   │   └── generateToken.ts          # JWT signing and validation
│   └── seed.ts                       # Sample data seeder
│
├── src/                              # Frontend React Application
│   ├── components/
│   │   ├── Navbar.tsx                # Responsive top navigation with auth state
│   │   ├── Footer.tsx                # Application footer
│   │   ├── PostCard.tsx              # Standard post card with meta & stats
│   │   ├── CommentSection.tsx        # Comment thread, form, and delete controls
│   │   ├── ProtectedRoute.tsx        # Client-side route guard
│   │   ├── ConfirmModal.tsx          # Reusable action confirmation modal
│   │   └── DatabaseModal.tsx         # Live MongoDB status & config helper
│   ├── context/
│   │   └── AuthContext.tsx           # Global authentication state provider
│   ├── pages/
│   │   ├── HomePage.tsx              # Landing page, hero, search, cards
│   │   ├── ExplorePage.tsx           # Search, tag & category filter catalog
│   │   ├── PostDetailPage.tsx        # Full reading page & comments
│   │   ├── CreatePostPage.tsx        # Post creation with live preview
│   │   ├── EditPostPage.tsx          # Post editor with owner check
│   │   ├── DashboardPage.tsx         # User statistics & management
│   │   ├── ProfilePage.tsx           # User profile & public stories
│   │   ├── LoginPage.tsx             # Login form with quick demo credentials
│   │   ├── RegisterPage.tsx          # Account registration form
│   │   └── NotFoundPage.tsx          # 404 error page
│   ├── services/
│   │   ├── api.ts                    # HTTP request wrapper & token handling
│   │   ├── authService.ts            # Auth REST calls
│   │   ├── postService.ts            # Post REST calls
│   │   ├── commentService.ts         # Comment REST calls
│   │   └── userService.ts            # User REST calls
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                       # Main router & layout entry
│   ├── main.tsx                      # DOM root mounting
│   └── index.css                     # Tailwind CSS imports & styles
│
├── .env.example                      # Environment variable template
├── package.json                      # Dependencies & unified scripts
├── server.ts                         # Express server with Vite middleware integration
└── README.md                         # Documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```env
# MongoDB Atlas Connection String
# Leave empty to use the automatic local embedded MongoDB engine, or provide your cloud cluster URI:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/blognest?retryWrites=true&w=majority

# Secret for signing JWT authentication tokens
JWT_SECRET=super_secure_jwt_secret_key_change_in_production

# Server Port
PORT=3000

# Client Application URL
CLIENT_URL=http://localhost:3000
```

---

## 🚀 Running Locally

### 1. Installation
Install all project dependencies:
```bash
npm install
```

### 2. Start Development Server
Run the full-stack application (starts Express backend with integrated Vite dev server on port 3000):
```bash
npm run dev
```

Open your browser at **`http://localhost:3000`**.

### 3. Seed Sample Posts (Optional)
The application automatically seeds realistic sample posts and comments on initial launch if the database is empty. You can also re-run the seed script manually at any time:
```bash
npm run seed
```

---

## 🔑 Demo Test Accounts

The database comes pre-seeded with two active accounts for immediate testing:

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin / Author** | Alex Rivers | `alex@blognest.dev` | `Password123!` |
| **User / Reader** | Sophia Chen | `sophia@blognest.dev` | `Password123!` |

*(You can also click the quick-login chips on the `/login` page to sign in with one click, or register a new user).*

---

## 🌐 Connecting MongoDB Atlas

1. Log into your [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Create a free cluster (**M0 Free Tier**).
3. Under **Database Access**, create a database user (e.g. `blognest_user`) and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. In your cluster dashboard, click **Connect** → **Drivers** (Node.js).
6. Copy the connection string and paste it into your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://blognest_user:<password>@cluster0.abcde.mongodb.net/blognest?retryWrites=true&w=majority
   ```
7. Restart the server (`npm run dev`). The server log will print:
   ```
   Connecting to MongoDB Atlas at provided URI...
   Successfully connected to MongoDB Atlas!
   ```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new user account with hashed password.
- `POST /api/auth/login` — Authenticate user and receive signed JWT.
- `GET /api/auth/me` — Retrieve current authenticated user profile *(Requires JWT)*.
- `PUT /api/auth/profile` — Update display name, bio, or avatar *(Requires JWT)*.

### Blog Posts (`/api/posts`)
- `GET /api/posts` — Get paginated posts with optional query filters:
  - `?search=query`
  - `?category=Web+Development`
  - `?tag=React`
  - `?sort=newest|popular|oldest`
  - `?page=1&limit=10`
- `GET /api/posts/categories` — Get list of active categories with article counts.
- `GET /api/posts/:id` — Get single post by ID with populated author details.
- `POST /api/posts` — Create and publish a new post *(Requires JWT)*.
- `PUT /api/posts/:id` — Edit an existing post *(Requires JWT, Author ownership verified)*.
- `DELETE /api/posts/:id` — Delete post and all its comments *(Requires JWT, Author ownership verified)*.

### Comments (`/api/posts/:postId/comments` & `/api/comments`)
- `GET /api/posts/:postId/comments` — Fetch all comments on a post.
- `POST /api/posts/:postId/comments` — Add a comment to an article *(Requires JWT)*.
- `DELETE /api/comments/:id` — Delete a comment *(Requires JWT, Comment author ownership verified)*.

### Users & Dashboard (`/api/users`)
- `GET /api/users/me/dashboard` — Fetch author metrics, posts, and comment threads *(Requires JWT)*.
- `GET /api/users/:id` — View public author profile and published articles.
- `PUT /api/users/:id` — Update user profile details *(Requires JWT, Owner verified)*.

### System & Health (`/api/status`)
- `GET /api/status` — Live health check returning database host type (Atlas vs local) and connection state.

---

## 🚢 Production Deployment

### Building for Production
```bash
npm run build
```
This builds the client assets into the `dist/` directory.

### Running in Production
```bash
NODE_ENV=production npm start
```
The Express server will automatically serve optimized static assets from `dist/` and handle client-side SPA routing fallbacks.

### Cloud Hosting Options
- **Backend / Full Stack**: Render, Railway, Google Cloud Run, AWS Elastic Beanstalk, Heroku.
- **Database**: MongoDB Atlas Cloud.

---

## 📄 License
MIT License. Built for Full Stack Development Internship Task 4.
