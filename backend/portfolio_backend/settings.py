# backend/portfolio_backend/settings.py - Production Ready Configuration

from pathlib import Path
import os
from dotenv import load_dotenv
import psycopg2

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env (same level as manage.py)
load_dotenv(BASE_DIR / ".env")

# Core settings
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-secret-key")
DEBUG = os.getenv("DEBUG", "True") == "True"

# Enhanced ALLOWED_HOSTS for production
_allowed_hosts = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").strip()
if _allowed_hosts:
    ALLOWED_HOSTS = [h.strip() for h in _allowed_hosts.split(",") if h.strip()]
else:
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Add wildcard for render preview URLs in production
if not DEBUG:
    ALLOWED_HOSTS.extend([
        ".onrender.com",
        "api.iamdevnd.dev",
        "iamdevnd.dev",
        ".iamdevnd.dev"
    ])

# Installed apps
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'cloudinary_storage',
    'cloudinary',
]

LOCAL_APPS = [
    'projects',
    'portfolio_backend.blog',
    'portfolio_backend.core',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Middleware - optimized order for production
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'portfolio_backend.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Added templates directory
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portfolio_backend.wsgi.application'

# Database - Enhanced for production
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"), 
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT", "6543"),
        "OPTIONS": {
            "sslmode": "require",
            "options": "-c default_transaction_isolation=read_committed"
        },
        "CONN_MAX_AGE": 0,  # Disable connection pooling on Django side
    }
}

# Enhanced connection options for production
if not DEBUG:
    DATABASES["default"]["OPTIONS"].update({
        "connect_timeout": 10,
        "application_name": "portfolio_backend",
    })

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# DRF settings - Enhanced for production
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",  # Adjust based on your needs
    ],
}

# Add browsable API only in debug mode
if DEBUG:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"].append(
        "rest_framework.renderers.BrowsableAPIRenderer"
    )

# Production API throttling
if not DEBUG:
    REST_FRAMEWORK.update({
        "DEFAULT_THROTTLE_CLASSES": [
            "rest_framework.throttling.AnonRateThrottle",
            "rest_framework.throttling.UserRateThrottle",
        ],
        "DEFAULT_THROTTLE_RATES": {
            "anon": "100/hour",
            "user": "1000/hour",
        },
    })

# CORS Configuration - Production Ready
default_dev_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Production CORS settings
CORS_ALLOW_ALL_ORIGINS = DEBUG

_cors_env = os.getenv("CORS_ALLOWED_ORIGINS", "").strip()
if _cors_env:
    CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_env.split(",") if o.strip()]
elif not DEBUG:
    # Production origins for iamdevnd.dev
    CORS_ALLOWED_ORIGINS = [
        "https://iamdevnd.dev",
        "https://www.iamdevnd.dev",
    ]
else:
    CORS_ALLOWED_ORIGINS = default_dev_origins

# CORS additional settings for production
if not DEBUG:
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^https://.*\.iamdevnd\.dev$",  # Allow all subdomains
        r"^https://.*\.vercel\.app$",   # Allow Vercel preview URLs
    ]

# CSRF Configuration
_csrf_env = os.getenv("CSRF_TRUSTED_ORIGINS", "").strip()
if _csrf_env:
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in _csrf_env.split(",") if o.strip()]
elif not DEBUG:
    # Production CSRF origins
    CSRF_TRUSTED_ORIGINS = [
        "https://iamdevnd.dev",
        "https://www.iamdevnd.dev",
        "https://api.iamdevnd.dev",
    ]
else:
    CSRF_TRUSTED_ORIGINS = default_dev_origins

# Email Configuration - Resend
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

# Email backend configuration
if RESEND_API_KEY:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.resend.com'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = 'resend'
    EMAIL_HOST_PASSWORD = RESEND_API_KEY
    DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "hello@iamdevnd.dev")
    SERVER_EMAIL = DEFAULT_FROM_EMAIL
else:
    # Fallback to console backend for development
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Cloudinary Configuration
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv("CLOUD_NAME", "your-cloud-name"),
    'API_KEY': os.getenv("CLOUDINARY_API_KEY", "your-api-key"),
    'API_SECRET': os.getenv("CLOUDINARY_API_SECRET", "your-api-secret"),
    'SECURE': True,  # Use HTTPS URLs
}

# Media files configuration
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
MEDIA_URL = '/media/'

# Static files configuration - Production optimized
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Enhanced static files configuration for production
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
    WHITENOISE_USE_FINDERS = True
    WHITENOISE_AUTOREFRESH = False
    WHITENOISE_SKIP_COMPRESS_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'zip', 'gz', 'tgz', 'bz2', 'tbz', 'xz', 'br']
else:
    STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ========================================
# PRODUCTION SECURITY SETTINGS
# ========================================

if not DEBUG:
    # SSL/HTTPS Configuration
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    
    # HSTS (HTTP Strict Transport Security)
    SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Cookie Security
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'
    CSRF_COOKIE_SAMESITE = 'Strict'
    
    # Content Security
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
    
    # Additional security headers
    SECURE_CROSS_ORIGIN_OPENER_POLICY = 'same-origin'

# ========================================
# LOGGING CONFIGURATION
# ========================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose' if not DEBUG else 'simple',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        } if not DEBUG else {
            'class': 'logging.NullHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO' if not DEBUG else 'DEBUG',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'] if not DEBUG else ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['console', 'file'] if not DEBUG else ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'portfolio_backend': {
            'handlers': ['console', 'file'] if not DEBUG else ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Create logs directory if it doesn't exist
if not DEBUG:
    logs_dir = BASE_DIR / 'logs'
    logs_dir.mkdir(exist_ok=True)

# ========================================
# CACHING CONFIGURATION (Production)
# ========================================

if not DEBUG:
    # Redis cache configuration (if Redis URL is provided)
    redis_url = os.getenv('REDIS_URL')
    if redis_url:
        CACHES = {
            'default': {
                'BACKEND': 'django.core.cache.backends.redis.RedisCache',
                'LOCATION': redis_url,
                'OPTIONS': {
                    'CLIENT_CLASS': 'django_redis.client.DefaultClient',
                },
                'KEY_PREFIX': 'portfolio',
                'TIMEOUT': 300,  # 5 minutes default
            }
        }
    else:
        # Fallback to database cache
        CACHES = {
            'default': {
                'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
                'LOCATION': 'django_cache_table',
                'TIMEOUT': 300,
                'OPTIONS': {
                    'MAX_ENTRIES': 1000,
                }
            }
        }
        
    # Cache sessions in production
    SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'
    SESSION_CACHE_ALIAS = 'default'

# ========================================
# ADMIN CONFIGURATION
# ========================================

# Admin site customization
ADMIN_URL = os.getenv('ADMIN_URL', 'admin/')  # Allow custom admin URL for security

# Force admin over HTTPS in production
if not DEBUG:
    SECURE_ADMIN_REDIRECT = True

# ========================================
# API DOCUMENTATION (Development only)
# ========================================

if DEBUG:
    # Add DRF spectacular for API documentation
    try:
        import drf_spectacular
        INSTALLED_APPS.append('drf_spectacular')
        REST_FRAMEWORK['DEFAULT_SCHEMA_CLASS'] = 'drf_spectacular.openapi.AutoSchema'
        
        SPECTACULAR_SETTINGS = {
            'TITLE': 'Portfolio API',
            'DESCRIPTION': 'API for Nikhil Dodda Portfolio',
            'VERSION': '1.0.0',
            'SERVE_INCLUDE_SCHEMA': False,
        }
    except ImportError:
        pass

# ========================================
# HEALTH CHECK CONFIGURATION
# ========================================

# Simple health check endpoint configuration
HEALTH_CHECK_URL = '/api/v1/test/'

# ========================================
# PERFORMANCE OPTIMIZATIONS
# ========================================

if not DEBUG:
    # File upload settings
    FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
    DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB

# ========================================
# ENVIRONMENT-SPECIFIC OVERRIDES
# ========================================

# Allow environment-specific settings override
env_settings_file = BASE_DIR / f"settings_{os.getenv('ENVIRONMENT', 'local')}.py"
if env_settings_file.exists():
    exec(open(env_settings_file).read())

# ========================================
# FINAL VALIDATION
# ========================================

# Validate required environment variables in production
if not DEBUG:
    required_env_vars = [
        'SECRET_KEY',
        'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST',
        'CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET',
    ]
    
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Ensure secret key is secure in production
if not DEBUG and (not SECRET_KEY or SECRET_KEY == "unsafe-secret-key" or len(SECRET_KEY) < 50):
    raise ValueError("SECRET_KEY must be set to a secure value (50+ characters) in production")

print(f"🚀 Django settings loaded - DEBUG: {DEBUG}, Environment: {os.getenv('ENVIRONMENT', 'local')}")