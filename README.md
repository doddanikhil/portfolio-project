## Portfolio Project (Django REST API + Next.js Frontend)

A full‑stack personal portfolio showcasing projects, blog posts, and site stats. The backend is a Django REST API, and the frontend is a modern Next.js (App Router + Tailwind) single-page experience.

### Tech Stack
- **Backend**: Django 5, Django REST Framework, PostgreSQL, Whitenoise, Cloudinary, Resend (email)
- **Frontend**: Next.js 15, React 19, Tailwind CSS, SWR
- **Tooling**: TypeScript, ESLint, dotenv

### Monorepo Layout
```
backend/                      # Django project (API)
  portfolio_backend/
    settings.py               # Loads .env, Postgres, CORS, static
    urls.py                   # Mounts /api/v1/, /api/v1/blog/, /api/v1/core/
    blog/                     # Blog API (posts, categories, recent)
    core/                     # Core info (highlights, config, stats, contact)
  projects/                   # Projects API (projects, tech-stack, stats, contact)
  manage.py
  requirements.txt            # Python dependencies

frontend/                     # Next.js app (App Router)
  src/app/                    # Pages (/, /projects, /blog, /about, /contact)
  src/lib/api.ts              # API client + types
  tailwind.config.ts          # Tailwind setup
```

## Quick Start

### 1) Prerequisites
- Python 3.11+ (3.13 works locally; production often uses 3.11)
- Node.js 20+
- PostgreSQL 13+

### 2) Backend setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create and fill .env (see example below)
cp ../.env.example .env  # if you create one; or touch backend/.env and edit

python manage.py migrate

# Optional: create admin user
python manage.py createsuperuser

# Optional: seed sample content
python manage.py shell < quick_setup.py

# Run API
python manage.py runserver
```

### 3) Frontend setup (Next.js)
```bash
cd frontend
npm install

# Set API base (see .env examples)
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" > .env.local

npm run dev
```

Visit frontend at http://localhost:3000 and backend API at http://127.0.0.1:8000.

## Environment Variables

### Backend (`backend/portfolio_backend/.env`)
```bash
# Django
SECRET_KEY=replace_me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
DB_NAME=portfolio
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_PORT=5432

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Media (Cloudinary)
CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Notes:
- `.env` is loaded by `settings.py` with `python-dotenv`.
- In production, set `DEBUG=False` and configure `ALLOWED_HOSTS` properly.
- The database config in `settings.py` uses PostgreSQL with `sslmode=require`. Adjust for local setups if needed.

### Frontend (`frontend/.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## API Overview

Base URL: `http://<backend-host>/api/v1`

### Health/Test
- `GET /api/v1/test/` — API health probe.

### Projects
- `GET /api/v1/projects/` — All published projects.
- `GET /api/v1/projects/featured/` — Featured projects (top 3).
- `GET /api/v1/projects/<slug>/` — Project details (includes technologies, optional details).
- `GET /api/v1/tech-stack/` — Technologies grouped by category.
- `GET /api/v1/highlights/` — Career highlights.
- `GET /api/v1/metadata/` — Site metadata (name, tagline, links, etc.).
- `GET /api/v1/stats/` — Computed site stats (projects, technologies, views, etc.).
- `POST /api/v1/contact/` — Contact form submission.

### Blog
Prefix: `/api/v1/blog`
- `GET /api/v1/blog/posts/?category=&search=` — Blog list with optional filters.
- `GET /api/v1/blog/posts/<slug>/` — Blog detail (increments views).
- `GET /api/v1/blog/recent/` — Recent posts (for homepage).
- `GET /api/v1/blog/categories/` — Categories with counts.

### Core
Prefix: `/api/v1/core`
- `GET /api/v1/core/highlights/` — Career highlights (core variant).
- `GET /api/v1/core/config/` — Site configuration (fallback defaults if empty).
- `GET /api/v1/core/stats/` — Portfolio stats snapshot.
- `POST /api/v1/core/contact/` — Contact form submission (core variant).

### Example: submit contact
```bash
curl -X POST http://127.0.0.1:8000/api/v1/contact/ \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"Jane Doe",
    "email":"jane@example.com",
    "subject":"Hello",
    "message":"Nice portfolio!"
  }'
```

## Frontend

Key pages (App Router):
- `/` — Hero, featured projects, recent blog posts.
- `/projects` — All projects grid.
- `/blog` and `/blog/[slug]` — Blog list and details.
- `/about` — About page.
- `/contact` — Contact page.

Client library `src/lib/api.ts` wraps all backend endpoints and exports TypeScript types for projects, blog posts, metadata, and stats.

## Deployment

### Backend (Gunicorn/Render/Any PaaS)
- Start command: `gunicorn portfolio_backend.wsgi:application`
- Typical build steps:
  - `pip install -r requirements.txt`
  - `python manage.py collectstatic --no-input`
  - `python manage.py migrate`
- Required environment variables in your host:
  - `DJANGO_SETTINGS_MODULE=portfolio_backend.settings`
  - `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=<your-domain>`
  - Database variables (`DB_*`)
  - `RESEND_API_KEY`
  - Cloudinary variables if you host media on Cloudinary

### Frontend (Vercel/Netlify/Any)
- Build command: `next build`
- Start command: `next start`
- Environment: `NEXT_PUBLIC_API_URL=https://<your-backend-domain>`

## Security & Operations
- Secrets must be supplied via environment variables. Do not commit keys to the repo.
- `.env`, `.env.local`, and production env files are git‑ignored.
- If a secret is ever exposed, rotate it immediately in your provider (e.g., Resend) and update the environment.
- For production, set strict `ALLOWED_HOSTS` and configure CORS as needed.

## Troubleshooting
- 500 on API calls: check `DJANGO_SETTINGS_MODULE`, database connectivity, and migrations.
- 404s from frontend: verify `NEXT_PUBLIC_API_URL` matches your backend URL and that `/api/v1/*` endpoints respond.
- Email not sending: ensure `RESEND_API_KEY` is set and valid; check provider logs.
- Media not loading: ensure Cloudinary variables are configured and files are uploaded.

## Scripts & Utilities
- `backend/quick_setup.py`: seeds minimal configuration, categories, technologies, and a sample project.
- `backend/build.sh`: example build steps for PaaS (install, collectstatic, migrate).

## License
Choose a license and add it here (e.g., MIT). If omitted, all rights reserved by default.


