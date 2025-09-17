# Portfolio Project - Next.js + Django

A modern, production-ready portfolio website built with Next.js 14 frontend and Django REST Framework backend, showcasing AI/ML projects and professional experience.

## 🚀 Features

### Frontend (Next.js 14)
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Design**: Glassmorphism UI with Apple-like design principles
- **Performance**: Optimized images, system fonts, compressed assets
- **SEO**: Dynamic sitemap, robots.txt, Open Graph tags
- **Responsive**: Mobile-first design with smooth animations

### Backend (Django REST Framework)
- **API**: RESTful endpoints for projects, blog, career highlights
- **Security**: Hardened settings, rate limiting, CORS protection
- **Database**: PostgreSQL (production) / SQLite (development)
- **Storage**: Cloudinary integration for media files
- **Email**: Resend integration for contact forms
- **Monitoring**: Sentry error tracking and structured logging

### DevOps & Deployment
- **CI/CD**: GitHub Actions workflows for testing and deployment
- **Testing**: Comprehensive test suite for API endpoints
- **Code Quality**: ESLint, TypeScript, Black, Flake8, isort
- **Security**: Automated security audits and dependency checks

## 📁 Project Structure

```
portfolio-project/
├── backend/                    # Django REST API
│   ├── portfolio_backend/      # Main Django project
│   ├── projects/               # Projects app
│   ├── portfolio_backend/blog/ # Blog app
│   ├── portfolio_backend/core/ # Core app (config, highlights)
│   ├── requirements.txt        # Production dependencies
│   ├── requirements-dev.txt    # Development dependencies
│   └── .env.example           # Environment variables template
├── frontend/                   # Next.js application
│   ├── src/app/               # App router pages
│   ├── src/components/        # Reusable components
│   ├── src/lib/              # Utilities and API client
│   ├── public/               # Static assets
│   └── package.json          # Dependencies
├── .github/workflows/         # CI/CD pipelines
└── README.md                 # This file
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.0 + Django REST Framework 3.14
- **Database**: PostgreSQL 15 (production), SQLite (development)
- **Storage**: Cloudinary for media files
- **Email**: Resend for transactional emails
- **Monitoring**: Sentry for error tracking
- **Server**: Gunicorn + WhiteNoise

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Lucide React icons
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios with custom API wrapper

### Development & Deployment
- **Code Quality**: ESLint, Prettier, Black, Flake8, isort
- **Testing**: Jest (frontend), pytest + Django TestCase (backend)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend), Render (backend)
- **DNS**: Cloudflare

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL (for production)

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   git clone https://github.com/doddanikhil/portfolio-project.git
   cd portfolio-project/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # For development
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser  # Optional
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

   API will be available at `http://localhost:8000/api/v1/`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   # Create .env.local with:
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Application will be available at `http://localhost:3000`

## 📚 API Documentation

### Core Endpoints

- `GET /api/v1/test/` - API health check
- `GET /api/v1/projects/` - List all projects
- `GET /api/v1/projects/featured/` - Featured projects
- `GET /api/v1/projects/{slug}/` - Project details
- `GET /api/v1/tech-stack/` - Technology stack
- `GET /api/v1/highlights/` - Career highlights
- `GET /api/v1/metadata/` - Site configuration
- `POST /api/v1/contact/` - Contact form submission

### Blog Endpoints

- `GET /api/v1/blog/posts/` - List blog posts
- `GET /api/v1/blog/posts/{slug}/` - Blog post details
- `GET /api/v1/blog/recent/` - Recent blog posts

### Core Endpoints

- `GET /api/v1/core/config/` - Site configuration
- `GET /api/v1/core/highlights/` - Career highlights
- `GET /api/v1/core/stats/` - Portfolio statistics
- `POST /api/v1/core/contact/` - Contact form

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run lint
npm run type-check
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Configure environment variables
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn portfolio_backend.wsgi:application`

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure environment variables
4. Deploy automatically on push to main

## 🔒 Security Features

- **HTTPS**: Enforced in production
- **CORS**: Configured for specific origins
- **CSP**: Content Security Policy headers
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Form and API validation
- **Error Tracking**: Sentry integration

## 👨‍💻 Author

**Nikhil Dodda** - Applied AI Engineer
- Email: hello@nikhildodda.dev
- GitHub: [@doddanikhil](https://github.com/doddanikhil)
- Bluesky: [@devdn.bsky.social](https://bsky.app/profile/devdn.bsky.social)

---

**Built with ❤️ using Next.js and Django**