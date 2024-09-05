import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

django_application = get_asgi_application()

from backend import urls

application = ProtocolTypeRouter(
    {
        "http": django_application,
        "websocket": URLRouter(urls.websocket_urlpatterns),
    }
)
