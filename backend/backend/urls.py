from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from category.views import CategoryViewSet
from server.views import ServerViewSet
from channel.views import ChannelViewSet
from chat.views import MessageViewSet
from chat.consumers import ChatConsumer
from account.views import AccountViewSet

router = DefaultRouter()

router.register("accounts", AccountViewSet)
router.register("categories", CategoryViewSet)
router.register("servers", ServerViewSet)
router.register("channels", ChannelViewSet)
router.register("messages", MessageViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("docs/schema", SpectacularAPIView.as_view(), name="schema"),
    path(
        "docs/schema/ui",
        SpectacularSwaggerView.as_view(),
    ),
    path("api/", include(router.urls)),
    path("api/", include("account.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

websocket_urlpatterns = [
    path("ws/chat/<str:channels>/", ChatConsumer.as_asgi()),
]
