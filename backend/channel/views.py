from rest_framework.viewsets import ModelViewSet
from channel.models import Channel
from channel.serializers import ChannelSerializer
from drf_spectacular.utils import extend_schema


class ChannelViewSet(ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    
    @extend_schema(responses=ChannelSerializer)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
