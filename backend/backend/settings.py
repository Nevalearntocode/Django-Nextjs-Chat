from pathlib import Path
from os import getenv, path
import dj_database_url
import dotenv


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

dotenv_file = BASE_DIR / ".env.dev"

if path.isfile(dotenv_file):
    dotenv.load_dotenv(dotenv_file)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = getenv("DEBUG")

ALLOWED_HOSTS = getenv("ALLOWED_HOSTS").split(",")


# Application definition

INSTALLED_APPS = [
    # external
    "drf_spectacular",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    # default
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # internal
    "account",
    "category",
    "server",
    "channel",
    "chat",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "djangobnb_backend.wsgi.application"
ASGI_APPLICATION = "djangobnb_backend.asgi.application"

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": getenv("SQL_DATABASE"),
        "USER": getenv("DOCKER_SQL_USER"),
        "PASSWORD": getenv("DOCKER_SQL_PASSWORD"),
        "HOST": getenv("DOCKER_SQL_HOST"),
        "PORT": getenv("5432"),
    }
}

DATABASES["default"] = dj_database_url.parse(getenv("DATABASE_URL"))

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"
MEDIA_URL = "media/"
STATIC_ROOT = BASE_DIR / "static"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

CORS_ALLOWED_ORIGINS = getenv("CORS_ALLOWED_ORIGINS").split(",")
CSRF_TRUSTED_ORIGINS = getenv("CSRF_TRUSTED_ORIGINS").split(",")
CORS_ORIGIN_WHITELIST = getenv("CORS_ORIGIN_WHITELIST").split(",")
CORS_ALLOW_CREDENTIALS = True

AUTH_COOKIE_HTTPONLY = getenv("AUTH_COOKIE_HTTPONLY") == "1"
AUTH_COOKIE_SECURE = getenv("AUTH_COOKIE_SECURE") == "1"
AUTH_COOKIE_SAMESITE = getenv("AUTH_COOKIE_SAMESITE")
AUTH_COOKIE_PATH = getenv("AUTH_COOKIE_PATH")
AUTH_COOKIE_ACCESS_MAX_AGE = 60 * 60 * 24
AUTH_COOKIE_REFRESH_MAX_AGE = 60 * 60 * 24 * 7

if DEBUG:
    WEBSITE_URL = getenv("WEBSITE_URL")
else:
    WEBSITE_URL = getenv("PROD_WEBSITE_URL")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "account.Account"

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "account.authentication.CustomJWTAuthentication",
    ],
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Chat API",
    "DESCRIPTION": "Chat API",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": True,
}


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "USER": "default",
        "PASSWORD": "c7gxxsLue85DFAw2SNe2lpbh9XxpUSLi",
        "CONFIG": {
            "hosts": [
                f"redis://{getenv('REDIS_USER')}:{getenv('REDIS_PASSWORD')}@{getenv('REDIS_HOST')}:{getenv('REDIS_PORT')}/0",
                # ("redis", 6379),
            ],
        },
    },
}


CLOUDFLARE_R2_ACCESS_KEY_ID = getenv("CLOUDFLARE_R2_ACCESS_KEY_ID")
CLOUDFLARE_R2_SECRET_ACCESS_KEY = getenv("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
CLOUDFLARE_R2_BUCKET_NAME = getenv("CLOUDFLARE_R2_BUCKET_NAME")
CLOUDFLARE_R2_ENDPOINT = getenv("CLOUDFLARE_R2_ENDPOINT")
CLOUDFLARE_R2_BUCKET_URL = getenv("CLOUDFLARE_R2_BUCKET_URL")
