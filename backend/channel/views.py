from rest_framework.viewsets import ModelViewSet
from channel.models import Channel
from channel.serializers import ChannelSerializer
from channel.permissions import ChannelPermission
from drf_spectacular.utils import extend_schema


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
