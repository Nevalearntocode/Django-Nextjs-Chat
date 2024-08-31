from rest_framework.viewsets import ModelViewSet
from channel.models import Channel
from channel.serializers import ChannelSerializer


class ChannelViewSet(ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
