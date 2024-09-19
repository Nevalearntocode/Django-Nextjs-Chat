from rest_framework import serializers
from channel.models import Channel
from django.conf import settings

from server.serializers import get_one_or_two


class ChannelSerializer(serializers.ModelSerializer):
    server_banner = serializers.ReadOnlyField(source="server.banner")
    url = serializers.HyperlinkedIdentityField(view_name="channel-detail")

    class Meta:
        model = Channel
        fields = "__all__"

    def validate(self, attrs):
        user = self.context.get("request").user
        server = attrs.get("server")
        if server.owner != user:
            raise serializers.ValidationError("Only server owner can create a channel.")
        return super().validate(attrs)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data.get("server_banner"):
            data["server_banner"] = (
                f"{settings.WEBSITE_URL}/media/server/server-banner-{get_one_or_two()}.jpg"
            )
        return data
