from rest_framework.viewsets import ModelViewSet
from channel.models import Channel
from channel.serializers import ChannelSerializer
from channel.permissions import ChannelPermission
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response


class ChannelViewSet(ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [ChannelPermission]

    def get_queryset(self):
        request = self.request
        queryset = super().get_queryset()
        server = request.query_params.get("server", None)
        if server is not None and server != "":
            queryset = queryset.filter(server=server)
        return queryset

    @extend_schema(responses=ChannelSerializer)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        data = request.data.copy()
        data["server"] = instance.server.id
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
