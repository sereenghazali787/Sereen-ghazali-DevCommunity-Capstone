# DevCommunity

DevCommunity is a full-stack developer community platform built as a TechTalks Full-Stack Capstone Project.

The platform allows developers to discover technical communities and blog posts, join communities, publish and manage technical content, interact through comments, bookmark useful posts, and maintain public developer profiles.

## Live Application

Production deployment:

https://sereen-ghazali-dev-community-capsto.vercel.app

## Features

### Authentication

- Sign in with GitHub
- Sign in with Google
- Authentication powered by Auth.js
- User accounts persisted in MongoDB
- Protected user routes
- Server-side authorization and ownership validation

### Developer Communities

- Explore developer communities
- View individual community pages
- Search communities
- Filter communities by topic
- Join communities
- Leave communities
- Track joined communities from the dashboard

### Technical Blogs

- Explore published blog posts
- View individual blog posts
- Create new posts
- Edit owned posts
- Delete owned posts
- Search posts
- Filter posts by topic
- Pagination
- Latest-post sorting
- Trending-post sorting based on views
- Automatic view counting

### Comments

- Add comments to blog posts
- View comments on posts
- Delete owned comments
- Authentication required for comment creation
- Server-side ownership checks for deletion

### Bookmarks

- Bookmark useful blog posts
- Remove bookmarks
- Dedicated protected bookmarks page
- Duplicate bookmarks prevented at the database level

### Developer Profiles

- Public developer profiles
- Display published posts
- Editable name and username
- Developer bio
- GitHub profile URL
- Profile validation
- Cached public profile data with revalidation

### Dashboard

Authenticated developers have access to a personalized dashboard containing:

- User statistics
- Published posts
- Joined communities
- Bookmark information
- Quick links
- Post management controls

### User Experience

- Dark content-focused interface
- Loading state
- Application error state
- Custom 404 page
- Responsive Tailwind CSS layout
- Authentication-aware navigation
- Empty and error states

## Technology Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js Route Handlers
- MongoDB Atlas
- Mongoose

### Authentication and Validation

- Auth.js
- GitHub OAuth
- Google OAuth
- Zod

### Deployment

- Vercel
- MongoDB Atlas

## Application Architecture

DevCommunity uses the Next.js App Router.

Server Components are used by default for server-side data access and rendering. Client Components are used only where browser-side state and user interaction are required, including:

- Community join/leave controls
- Bookmark controls
- Comment interaction
- Create/edit forms
- Profile settings form
- Delete controls

The application also uses Next.js Cache Components and Partial Prerendering. Static page shells can be prerendered while request-specific and authenticated content is streamed dynamically.

API Route Handlers remain dynamic and process database mutations and authenticated requests on demand.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/communities` | Explore and search communities |
| `/communities/[slug]` | Community details and membership |
| `/blogs` | Explore, search, filter and sort blogs |
| `/blogs/[slug]` | Read an individual blog |
| `/blogs/[slug]/edit` | Edit an owned blog |
| `/create` | Create a blog |
| `/profile/[username]` | Public developer profile |
| `/dashboard` | Personalized developer dashboard |
| `/bookmarks` | Saved blog posts |
| `/settings` | Profile settings |

## API Routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/communities` | Retrieve communities |
| POST | `/api/communities/[id]/join` | Join a community |
| DELETE | `/api/communities/[id]/join` | Leave a community |
| GET | `/api/posts` | Retrieve/search blog posts |
| POST | `/api/posts` | Create a blog post |
| PATCH | `/api/posts/[id]` | Update an owned post |
| DELETE | `/api/posts/[id]` | Delete an owned post |
| GET | `/api/posts/[id]/comments` | Retrieve post comments |
| POST | `/api/posts/[id]/comments` | Add a comment |
| DELETE | `/api/comments/[id]` | Delete an owned comment |
| POST | `/api/posts/[id]/bookmark` | Bookmark a post |
| DELETE | `/api/posts/[id]/bookmark` | Remove a bookmark |
| PATCH | `/api/profile` | Update the authenticated user's profile |
| GET/POST | `/api/auth/[...nextauth]` | Auth.js authentication handlers |

## Database Models

### User

Stores developer identity and profile information, including:

- Name
- Username
- Email
- Profile image
- Bio
- GitHub URL
- Joined communities

### Community

Stores developer communities, including:

- Name
- Slug
- Description
- Image
- Topics
- Creator
- Members

### Post

Stores technical blog posts, including:

- Title
- Slug
- Excerpt
- Content
- Author
- Community
- Topics
- Publication status
- Views

### Comment

Stores comments associated with users and blog posts.

### Bookmark

Stores the relationship between a user and a bookmarked post.

A compound unique index prevents the same user from bookmarking the same post multiple times.

## Database Indexes

The application uses MongoDB indexes to support efficient application behavior.

Examples include:

- Text indexes for community search
- Text indexes for blog search
- Post creation-date index
- Post views index for trending content
- Comment post/date index
- Unique user/post bookmark index

Search and filtering are performed at the database level rather than loading all records and filtering them only in the browser.

## Validation

Zod is used to validate application input.

Post validation includes:

- Title
- Excerpt
- Content
- Community ID
- Topics

Profile validation includes:

- Name
- Username
- Bio
- GitHub URL

The validated and parsed Zod result is used before database mutations are performed.

## Authentication and Authorization

Authentication is implemented using Auth.js with GitHub and Google OAuth providers.

Protected operations verify the authenticated session on the server.

The application distinguishes between:

- `401 Unauthorized` — the user is not authenticated.
- `403 Forbidden` — the user is authenticated but does not own the requested resource.

Post and comment ownership is validated server-side rather than relying only on hidden UI controls.

## Data Integrity

DevCommunity includes several protections for database consistency:

- Duplicate bookmarks are prevented with a unique compound index.
- Duplicate community membership is prevented.
- Post ownership is checked before editing or deletion.
- Comment ownership is checked before deletion.
- Deleting a post also removes associated comments and bookmarks.
- Invalid MongoDB ObjectIds are rejected before database operations.

## Search and Discovery

Blog and community discovery uses URL query parameters and MongoDB-side filtering.

The blog explorer supports:

- Search
- Topic filtering
- Pagination
- Latest sorting
- Trending sorting

Trending posts are ordered using their view count.

## Rendering Strategy

DevCommunity combines multiple Next.js rendering techniques.

### Partial Prerendering

With Next.js Cache Components enabled, application pages can provide prerendered static shells while dynamic content is streamed when required.

### Cached Public Content

Public profile content uses caching and revalidation to avoid unnecessary repeated database work while still allowing content to refresh.

Profile updates explicitly revalidate affected profile paths.

### Dynamic Content

Authentication-dependent and user-specific content is resolved at request time.

API Route Handlers are dynamically executed for reads, mutations, authentication, validation and authorization.

## Error Handling

The application uses meaningful HTTP status codes, including:

- `200` — successful request
- `201` — resource created
- `400` — invalid input
- `401` — authentication required
- `403` — authenticated but not authorized
- `404` — resource not found
- `409` — conflicting or duplicate operation
- `500` — unexpected server error

The UI also provides custom loading, application-error and not-found states.

## Environment Variables

Create a `.env.local` file in the project root.

Required variables:

```env
MONGODB_URI=
AUTH_SECRET=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

Never commit `.env.local` or authentication/database secrets to GitHub.

Production environment variables are configured securely through Vercel.

## OAuth Configuration

For local development, OAuth providers should allow callbacks to:

```text
http://localhost:3000/api/auth/callback/github
http://localhost:3000/api/auth/callback/google
```

Production OAuth providers must also contain the corresponding callback URLs for the deployed Vercel domain.

## Running the Project Locally

Clone the repository:

```bash
git clone https://github.com/sereenghazali787/Sereen-ghazali-DevCommunity-Capstone.git
```

Enter the project directory:

```bash
cd Sereen-ghazali-DevCommunity-Capstone
```

Install dependencies:

```bash
npm install
```

Create `.env.local` and configure the required environment variables.

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production Build

Verify the application before deployment:

```bash
npm run build
```

The project is configured with Next.js Cache Components and supports Partial Prerendering with dynamically streamed content.

## Deployment

DevCommunity is deployed using Vercel with MongoDB Atlas as the production database.

Production deployment requires:

- Vercel environment variables
- MongoDB Atlas network access
- GitHub production OAuth callback
- Google production OAuth callback

The production application has been tested with both GitHub and Google authentication and database-backed user interactions.

## Project Structure

```text
app/
├── api/
│   ├── auth/
│   ├── comments/
│   ├── communities/
│   ├── posts/
│   └── profile/
├── blogs/
├── bookmarks/
├── communities/
├── create/
├── dashboard/
├── profile/
├── settings/
├── error.tsx
├── loading.tsx
├── not-found.tsx
├── layout.tsx
└── page.tsx

components/
lib/
models/
schemas/
types/
```

## Production Testing

The deployed application was tested for:

- GitHub authentication
- Google authentication
- Blog creation
- Blog editing
- Blog deletion
- Post view tracking
- Comment creation and deletion
- Bookmarking and unbookmarking
- Community join and leave
- Profile editing
- Public profile updates
- Search
- Topic filtering
- Latest/trending sorting
- Dashboard data
- Custom 404 handling
- Cascading post cleanup

## Author

**Sereen Ghazali**

TechTalks Full-Stack Capstone Project

## Capstone Submission

Final project prepared for mentor review.
