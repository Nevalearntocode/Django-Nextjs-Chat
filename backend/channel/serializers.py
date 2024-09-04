from rest_framework import serializers
from channel.models import Channel


class ChannelSerializer(serializers.ModelSerializer):
    server_banner = serializers.ReadOnlyField(source="server.banner")

    class Meta:
        model = Channel
        fields = "__all__"
