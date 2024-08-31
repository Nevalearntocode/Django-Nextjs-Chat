from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from category.views import CategoryViewSet
from server.views import ServerViewSet
from channel.views import ChannelViewSet
from rest_framework.routers import DefaultRouter

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
]
