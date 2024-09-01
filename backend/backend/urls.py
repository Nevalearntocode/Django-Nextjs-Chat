from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from category.views import CategoryViewSet
from server.views import ServerViewSet
from channel.views import ChannelViewSet

router = DefaultRouter()

router.register("category", CategoryViewSet)
router.register("server", ServerViewSet)
router.register("channel", ChannelViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("docs/schema", SpectacularAPIView.as_view(), name="schema"),
    path(
        "docs/schema/ui",
        SpectacularSwaggerView.as_view(),
    ),
    path("api/", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
