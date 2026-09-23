"""
Django settings for Real Estate Backend (NirvanaSpace style)
"""
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "insecure-default-key-change-in-prod")
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = [
    h.strip() for h in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h.strip()
]

# ─── Installed Apps ────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "storages",           # django-storages for Cloudflare R2
    # Local apps
    "apps.core",
    "apps.properties",
    "apps.leads",
    "apps.blog",
]

# ─── Middleware ────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",         # Must be first
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ─── Database (SQLite for dev, PostgreSQL in production via DATABASE_URL) ────
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    try:
        import dj_database_url
        DATABASES = {"default": dj_database_url.config(default=DATABASE_URL, conn_max_age=600)}
    except ImportError:
        import urllib.parse as urlparse
        _db_url = urlparse.urlparse(DATABASE_URL)
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": _db_url.path[1:],
                "USER": _db_url.username,
                "PASSWORD": _db_url.password,
                "HOST": _db_url.hostname,
                "PORT": _db_url.port or 5432,
            }
        }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ─── Auth ─────────────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ─── Internationalization ──────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# ─── Static & Media Files ─────────────────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# ─── Media & Storage ──────────────────────────────────────────────────────────
# Switch: USE_R2_STORAGE=True in .env to use Cloudflare R2 in production
_USE_R2 = os.getenv("USE_R2_STORAGE", "False") == "True"

if _USE_R2:
    # ── Cloudflare R2 (S3-compatible) ─────────────────────────────────────────
    DEFAULT_FILE_STORAGE    = "storages.backends.s3boto3.S3Boto3Storage"

    AWS_ACCESS_KEY_ID       = os.getenv("CLOUDFLARE_R2_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY   = os.getenv("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = os.getenv("CLOUDFLARE_R2_BUCKET_NAME", "nirvanaspace-media")
    AWS_S3_ENDPOINT_URL     = (
        f"https://{os.getenv('CLOUDFLARE_R2_ACCOUNT_ID')}.r2.cloudflarestorage.com"
    )
    AWS_S3_CUSTOM_DOMAIN    = os.getenv("CLOUDFLARE_R2_PUBLIC_URL", "").replace("https://", "")
    AWS_DEFAULT_ACL         = "public-read"
    AWS_QUERYSTRING_AUTH    = False         # No signed URLs — public bucket
    AWS_S3_FILE_OVERWRITE   = False         # Never overwrite existing files
    AWS_S3_OBJECT_PARAMETERS = {
        "CacheControl": "max-age=86400",   # 1 day browser cache
    }
    MEDIA_URL = os.getenv("CLOUDFLARE_R2_PUBLIC_URL", "") + "/"
    MEDIA_ROOT = ""                         # Not used when R2 is active
else:
    # ── Local storage (development) ────────────────────────────────────────────
    MEDIA_URL  = os.getenv("MEDIA_URL", "/media/")
    MEDIA_ROOT = BASE_DIR / "media"

# ── Allow large video uploads (up to 250MB) ────────────────────────────────────
DATA_UPLOAD_MAX_MEMORY_SIZE = 250 * 1024 * 1024   # 250 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 250 * 1024 * 1024   # 250 MB

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ─── CORS (Next.js frontend) ──────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",") if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True

# In development, also allow local network origins (10.x.x.x, 192.168.x.x, localhost on any port)
if DEBUG:
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^http://localhost(:\d+)?$",
        r"^http://127\.0\.0\.1(:\d+)?$",
        r"^http://10\.\d+\.\d+\.\d+(:\d+)?$",
        r"^http://192\.168\.\d+\.\d+(:\d+)?$",
    ]

# Allow Authorization header so JWT token passes through cross-origin requests
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# ─── Django REST Framework ────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "120/minute",
        "user": "600/minute",
    },
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "apps.core.pagination.StandardResultsPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",   # For file uploads
        "rest_framework.parsers.FormParser",
    ],
}

# ─── JWT Settings ─────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(os.getenv("JWT_ACCESS_TOKEN_LIFETIME_MINUTES", 60))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=int(os.getenv("JWT_REFRESH_TOKEN_LIFETIME_DAYS", 7))
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ─── Logging ──────────────────────────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{asctime}] {levelname} {name}:{lineno} - {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
